import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

function formatProduct(p) {
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    category: p.category,
    brand: p.brand,
    nameUz: p.name_uz,
    nameRu: p.name_ru,
    name_uz: p.name_uz,
    name_ru: p.name_ru,
    descUz: p.desc_uz,
    descRu: p.desc_ru,
    price: p.price,
    oldPrice: p.old_price,
    stock: p.stock,
    warrantyMonths: p.warranty_months,
    badge: p.badge,
    rating: p.rating,
    reviewsCount: p.reviews_count,
    isFeatured: Boolean(p.is_featured),
    compatibleModels: p.compatible_models ? JSON.parse(p.compatible_models) : [],
    images: p.images ? JSON.parse(p.images) : [],
    variants: p.variants ? JSON.parse(p.variants) : [],
    specs: p.specs ? JSON.parse(p.specs) : {},
    createdAt: p.created_at,
    updated_at: p.updated_at
  };
}

// 1. Get products with real filtering, search, sorting
router.get('/', (req, res) => {
  const {
    category,
    brand,
    search,
    minPrice,
    maxPrice,
    inStockOnly,
    onSaleOnly,
    phoneModel,
    sort,
    limit,
    offset
  } = req.query;

  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (brand && brand !== 'all') {
    query += ' AND LOWER(brand) = LOWER(?)';
    params.push(brand);
  }

  if (search && search.trim()) {
    const s = `%${search.trim().toLowerCase()}%`;
    query += ' AND (LOWER(name_uz) LIKE ? OR LOWER(name_ru) LIKE ? OR LOWER(desc_uz) LIKE ? OR LOWER(desc_ru) LIKE ? OR LOWER(brand) LIKE ?)';
    params.push(s, s, s, s, s);
  }

  if (minPrice) {
    query += ' AND price >= ?';
    params.push(Number(minPrice));
  }

  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(Number(maxPrice));
  }

  if (inStockOnly === 'true') {
    query += ' AND stock > 0';
  }

  if (onSaleOnly === 'true') {
    query += ' AND old_price IS NOT NULL AND old_price > price';
  }

  // Sorting
  switch (sort) {
    case 'price_asc':
      query += ' ORDER BY price ASC';
      break;
    case 'price_desc':
      query += ' ORDER BY price DESC';
      break;
    case 'newest':
      query += ' ORDER BY created_at DESC';
      break;
    case 'rating':
      query += ' ORDER BY rating DESC';
      break;
    default:
      query += ' ORDER BY is_featured DESC, rating DESC';
  }

  if (limit) {
    query += ' LIMIT ?';
    params.push(Number(limit));
    if (offset) {
      query += ' OFFSET ?';
      params.push(Number(offset));
    }
  }

  try {
    const rows = db.prepare(query).all(...params);
    let products = rows.map(formatProduct);

    // If phone model compatibility filter
    if (phoneModel) {
      products = products.filter(
        (p) => p.category === 'smartphones' || (Array.isArray(p.compatibleModels) && p.compatibleModels.includes(phoneModel))
      );
    }

    return res.json({ data: products, total: products.length });
  } catch (err) {
    console.error('Fetch products error:', err);
    return res.status(500).json({ error: 'Mahsulotlarni yuklashda xatolik yuz berdi.' });
  }
});

// 2. Get single product by ID or Slug
router.get('/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const p = db.prepare('SELECT * FROM products WHERE id = ? OR slug = ?').get(idOrSlug, idOrSlug);
  if (!p) {
    return res.status(404).json({ error: 'Mahsulot topilmadi.' });
  }
  return res.json({ data: formatProduct(p) });
});

// 3. Admin: Create product
router.post('/', requireAdmin, (req, res) => {
  const {
    nameUz, nameRu, category, brand, price, oldPrice, stock,
    warrantyMonths, badge, isFeatured, images, specs, variants, compatibleModels, descUz, descRu
  } = req.body;

  if (!nameUz || !price || !category) {
    return res.status(400).json({ error: 'Nomi, toifasi va narxi majburiy maydonlar.' });
  }

  const id = `prod-${Date.now()}`;
  const slug = `${nameUz.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
  const now = new Date().toISOString();

  try {
    db.prepare(`
      INSERT INTO products (
        id, slug, category, brand, name_uz, name_ru, desc_uz, desc_ru,
        price, old_price, stock, warranty_months, badge, rating, reviews_count,
        is_featured, compatible_models, images, variants, specs, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 0, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      slug,
      category,
      brand || 'Boshqa',
      nameUz,
      nameRu || nameUz,
      descUz || '',
      descRu || '',
      Math.round(price),
      oldPrice ? Math.round(oldPrice) : null,
      stock !== undefined ? Number(stock) : 0,
      warrantyMonths || 12,
      badge || '',
      isFeatured ? 1 : 0,
      JSON.stringify(compatibleModels || []),
      JSON.stringify(images || []),
      JSON.stringify(variants || []),
      JSON.stringify(specs || {}),
      now,
      now
    );

    const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return res.status(201).json({ message: 'Mahsulot muvaffaqiyatli qo‘shildi!', data: formatProduct(created) });
  } catch (err) {
    console.error('Create product error:', err);
    return res.status(500).json({ error: 'Mahsulot yaratishda xatolik yuz berdi.' });
  }
});

// 4. Admin: Update product
router.put('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Mahsulot topilmadi.' });
  }

  const {
    nameUz, nameRu, category, brand, price, oldPrice, stock,
    warrantyMonths, badge, isFeatured, images, specs, variants, compatibleModels, descUz, descRu
  } = req.body;

  const now = new Date().toISOString();

  try {
    db.prepare(`
      UPDATE products SET
        name_uz = ?, name_ru = ?, category = ?, brand = ?, price = ?, old_price = ?,
        stock = ?, warranty_months = ?, badge = ?, is_featured = ?, images = ?,
        specs = ?, variants = ?, compatible_models = ?, desc_uz = ?, desc_ru = ?, updated_at = ?
      WHERE id = ?
    `).run(
      nameUz !== undefined ? nameUz : existing.name_uz,
      nameRu !== undefined ? nameRu : existing.name_ru,
      category !== undefined ? category : existing.category,
      brand !== undefined ? brand : existing.brand,
      price !== undefined ? Math.round(price) : existing.price,
      oldPrice !== undefined ? (oldPrice ? Math.round(oldPrice) : null) : existing.old_price,
      stock !== undefined ? Number(stock) : existing.stock,
      warrantyMonths !== undefined ? warrantyMonths : existing.warranty_months,
      badge !== undefined ? badge : existing.badge,
      isFeatured !== undefined ? (isFeatured ? 1 : 0) : existing.is_featured,
      images !== undefined ? JSON.stringify(images) : existing.images,
      specs !== undefined ? JSON.stringify(specs) : existing.specs,
      variants !== undefined ? JSON.stringify(variants) : existing.variants,
      compatibleModels !== undefined ? JSON.stringify(compatibleModels) : existing.compatible_models,
      descUz !== undefined ? descUz : existing.desc_uz,
      descRu !== undefined ? descRu : existing.desc_ru,
      now,
      id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return res.json({ message: 'Mahsulot muvaffaqiyatli yangilandi!', data: formatProduct(updated) });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ error: 'Mahsulotni yangilashda xatolik yuz berdi.' });
  }
});

// 5. Admin: Delete product
router.delete('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Mahsulot topilmadi.' });
  }

  try {
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return res.json({ message: 'Mahsulot muvaffaqiyatli o‘chirildi.' });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.status(500).json({ error: 'Mahsulotni o‘chirishda xatolik yuz berdi.' });
  }
});

export default router;
