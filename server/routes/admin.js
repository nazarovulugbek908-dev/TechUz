import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Real Admin Dashboard Stats
router.get('/stats', requireAdmin, (req, res) => {
  try {
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get().count;
    
    // Revenue calculated from confirmed/eligible transactions (exclude cancelled)
    const revenueRow = db.prepare("SELECT COALESCE(SUM(total), 0) as rev FROM orders WHERE status != 'cancelled'").get();
    const totalRevenue = revenueRow.rev || 0;

    // Real Status Distribution
    const statusRows = db.prepare('SELECT status, COUNT(*) as count FROM orders GROUP BY status').all();
    const statusDistribution = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    for (const r of statusRows) {
      if (statusDistribution[r.status] !== undefined) {
        statusDistribution[r.status] = r.count;
      }
    }

    // Real Recent Orders
    const recentOrdersRows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 6').all();
    const recentOrders = recentOrdersRows.map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      customerName: o.customer_name,
      total: o.total,
      status: o.status,
      createdAt: o.created_at,
      itemCount: o.items ? JSON.parse(o.items).length : 0
    }));

    // Real Low stock items (< 5)
    const lowStockCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock < 5').get().count;

    return res.json({
      data: {
        totalOrders,
        totalProducts,
        totalCustomers,
        totalRevenue,
        lowStockCount,
        statusDistribution,
        recentOrders
      }
    });
  } catch (err) {
    console.error('Fetch admin stats error:', err);
    return res.status(500).json({ error: 'Statistikani yuklashda xatolik yuz berdi.' });
  }
});

// Real Registered Customers list
router.get('/customers', requireAdmin, (req, res) => {
  const { search } = req.query;
  let query = "SELECT id, email, full_name, phone, city, street_address, created_at FROM users WHERE role = 'customer'";
  const params = [];

  if (search && search.trim()) {
    const s = `%${search.trim().toLowerCase()}%`;
    query += ' AND (LOWER(full_name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(phone) LIKE ?)';
    params.push(s, s, s);
  }

  query += ' ORDER BY created_at DESC';

  try {
    const users = db.prepare(query).all(...params);
    const customers = users.map((u) => {
      const stats = db.prepare("SELECT COUNT(*) as order_count, COALESCE(SUM(total), 0) as total_spent FROM orders WHERE user_id = ? AND status != 'cancelled'").get(u.id);
      return {
        id: u.id,
        fullName: u.full_name,
        email: u.email,
        phone: u.phone,
        city: u.city,
        streetAddress: u.street_address,
        createdAt: u.created_at,
        orderCount: stats.order_count,
        totalSpent: stats.total_spent
      };
    });

    return res.json({ data: customers });
  } catch (err) {
    console.error('Fetch customers error:', err);
    return res.status(500).json({ error: 'Mijozlar ro‘yxatini yuklashda xatolik yuz berdi.' });
  }
});

// Real Store Settings
router.get('/settings', requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    return res.json({ data: settings });
  } catch (err) {
    return res.status(500).json({ error: 'Sozlamalarni yuklashda xatolik yuz berdi.' });
  }
});

router.put('/settings', requireAdmin, (req, res) => {
  const settings = req.body;
  try {
    const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    for (const [key, value] of Object.entries(settings)) {
      upsert.run(key, String(value));
    }
    return res.json({ message: 'Sozlamalar saqlandi!' });
  } catch (err) {
    return res.status(500).json({ error: 'Sozlamalarni saqlashda xatolik yuz berdi.' });
  }
});

export default router;
