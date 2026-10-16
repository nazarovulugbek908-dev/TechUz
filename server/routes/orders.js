import express from 'express';
import { db } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

function formatOrder(o) {
  if (!o) return null;
  return {
    id: o.id,
    orderNumber: o.order_number,
    userId: o.user_id,
    customer: {
      fullName: o.customer_name,
      phone: o.customer_phone,
      region: o.customer_region,
      cityDistrict: o.customer_city,
      streetAddress: o.customer_street,
      notes: o.customer_notes
    },
    subtotal: o.subtotal,
    deliveryFee: o.delivery_fee,
    total: o.total,
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    status: o.status,
    items: o.items ? JSON.parse(o.items) : [],
    createdAt: o.created_at,
    updatedAt: o.updated_at
  };
}

// 1. Real Order Creation (Server-side validation of prices & stock)
router.post('/', (req, res) => {
  const { customer, items, paymentMethod, notes, userId } = req.body;

  if (!customer || !customer.fullName || !customer.phone || !customer.streetAddress) {
    return res.status(400).json({ error: 'Mijoz ma’lumotlari to‘liq kiritilmagan (ism, telefon, manzil).' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Savatda hech qanday mahsulot yo‘q.' });
  }

  // Authoritative server-side price & stock calculation
  let calculatedSubtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const prod = db.prepare('SELECT id, name_uz, name_ru, price, stock, images FROM products WHERE id = ?').get(item.id);
    if (!prod) {
      return res.status(400).json({ error: `Mahsulot bazada topilmadi: ${item.id}` });
    }

    const qty = Math.max(1, Number(item.quantity) || 1);
    if (prod.stock < qty) {
      return res.status(400).json({
        error: `"${prod.name_uz}" mahsulotidan yetarli miqdor qolmagan (qoldiq: ${prod.stock} dona).`
      });
    }

    const itemPrice = prod.price;
    calculatedSubtotal += itemPrice * qty;

    const prodImages = prod.images ? JSON.parse(prod.images) : [];
    verifiedItems.push({
      id: prod.id,
      name_uz: prod.name_uz,
      name_ru: prod.name_ru,
      price: itemPrice,
      quantity: qty,
      color: item.selectedColor || null,
      image: prodImages[0] || ''
    });
  }

  // Delivery fee rules: free if >= 500,000 UZS, otherwise 30,000 UZS
  const deliveryFee = calculatedSubtotal >= 500000 ? 0 : 30000;
  const calculatedTotal = calculatedSubtotal + deliveryFee;

  // Deduct inventory atomically
  for (const vItem of verifiedItems) {
    db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(vItem.quantity, vItem.id);
  }

  const orderId = `ord-${Date.now()}`;
  const orderNumber = `UZ-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  try {
    db.prepare(`
      INSERT INTO orders (
        id, order_number, user_id, customer_name, customer_phone,
        customer_region, customer_city, customer_street, customer_notes,
        subtotal, delivery_fee, total, payment_method, payment_status,
        status, items, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      orderNumber,
      userId || req.user?.id || null,
      customer.fullName.trim(),
      customer.phone.trim(),
      customer.region || '',
      customer.cityDistrict || '',
      customer.streetAddress.trim(),
      notes || customer.notes || '',
      calculatedSubtotal,
      deliveryFee,
      calculatedTotal,
      paymentMethod || 'cash',
      paymentMethod === 'cash' ? 'pending' : 'pending',
      'pending',
      JSON.stringify(verifiedItems),
      now,
      now
    );

    const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    return res.status(201).json({
      message: 'Buyurtmangiz muvaffaqiyatli qabul qilindi!',
      data: formatOrder(createdOrder)
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ error: 'Buyurtmani rasmiylashtirishda xatolik yuz berdi.' });
  }
});

// 2. Customer Order History (Authenticated user orders)
router.get('/my-orders', requireAuth, (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    return res.json({ data: orders.map(formatOrder) });
  } catch (err) {
    console.error('Fetch user orders error:', err);
    return res.status(500).json({ error: 'Buyurtmalarni yuklashda xatolik yuz berdi.' });
  }
});

// 3. Admin: Get all orders with search, status filters, pagination
router.get('/', requireAdmin, (req, res) => {
  const { status, search, limit = 50, offset = 0 } = req.query;

  let query = 'SELECT * FROM orders WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (search && search.trim()) {
    const s = `%${search.trim().toLowerCase()}%`;
    query += ' AND (LOWER(order_number) LIKE ? OR LOWER(customer_name) LIKE ? OR LOWER(customer_phone) LIKE ?)';
    params.push(s, s, s);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  try {
    const orders = db.prepare(query).all(...params);
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;

    return res.json({
      data: orders.map(formatOrder),
      total: totalCount
    });
  } catch (err) {
    console.error('Admin fetch orders error:', err);
    return res.status(500).json({ error: 'Buyurtmalar ro‘yxatini yuklashda xatolik yuz berdi.' });
  }
});

// 4. Admin: Update order status
router.put('/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Noto‘g‘ri buyurtma holati.' });
  }

  const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Buyurtma topilmadi.' });
  }

  // If status changed to cancelled and wasn't cancelled before, restore product stock
  if (status === 'cancelled' && existing.status !== 'cancelled') {
    const items = existing.items ? JSON.parse(existing.items) : [];
    for (const item of items) {
      db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(item.quantity, item.id);
    }
  }

  const now = new Date().toISOString();
  try {
    db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);
    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    return res.json({ message: 'Buyurtma holati yangilandi!', data: formatOrder(updated) });
  } catch (err) {
    return res.status(500).json({ error: 'Buyurtma holatini yangilashda xatolik yuz berdi.' });
  }
});

export default router;
