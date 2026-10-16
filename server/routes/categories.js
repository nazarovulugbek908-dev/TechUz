import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get categories with real product count
router.get('/', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories').all();
    const result = categories.map((c) => {
      const prodCount = db.prepare('SELECT COUNT(*) as cnt FROM products WHERE category = ?').get(c.id || c.slug).cnt;
      return {
        id: c.id,
        slug: c.slug,
        name_uz: c.name_uz,
        name_ru: c.name_ru,
        icon: c.icon,
        badge: c.badge,
        count: prodCount
      };
    });
    return res.json({ data: result });
  } catch (err) {
    console.error('Fetch categories error:', err);
    return res.status(500).json({ error: 'Kategoriyalarni yuklashda xatolik yuz berdi.' });
  }
});

// Admin: Add category
router.post('/', requireAdmin, (req, res) => {
  const { nameUz, nameRu, icon, badge } = req.body;
  if (!nameUz) {
    return res.status(400).json({ error: 'Kategoriya nomi kiritilishi shart.' });
  }

  const slug = nameUz.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const id = slug;
  const now = new Date().toISOString();

  try {
    db.prepare(`
      INSERT INTO categories (id, slug, name_uz, name_ru, icon, badge, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, slug, nameUz, nameRu || nameUz, icon || 'Layers', badge || null, now);

    return res.status(201).json({ message: 'Kategoriya yaratildi!', data: { id, slug, name_uz: nameUz, name_ru: nameRu || nameUz } });
  } catch (err) {
    console.error('Create category error:', err);
    return res.status(500).json({ error: 'Kategoriya yaratishda xatolik yuz berdi.' });
  }
});

// Admin: Update category
router.put('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { nameUz, nameRu, icon, badge } = req.body;

  try {
    db.prepare(`
      UPDATE categories
      SET name_uz = ?, name_ru = ?, icon = ?, badge = ?
      WHERE id = ?
    `).run(nameUz, nameRu || nameUz, icon || 'Layers', badge || null, id);

    return res.json({ message: 'Kategoriya yangilandi!' });
  } catch (err) {
    return res.status(500).json({ error: 'Kategoriyani yangilashda xatolik yuz berdi.' });
  }
});

// Admin: Delete category
router.delete('/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return res.json({ message: 'Kategoriya o‘chirildi.' });
  } catch (err) {
    return res.status(500).json({ error: 'Kategoriyani o‘chirishda xatolik yuz berdi.' });
  }
});

// Meta: Brands
router.get('/meta/brands', (req, res) => {
  try {
    const brands = db.prepare('SELECT * FROM brands').all();
    res.json({ data: brands });
  } catch (err) {
    res.status(500).json({ error: 'Brendlarni yuklashda xatolik.' });
  }
});

// Meta: Phone Models
router.get('/meta/phone-models', (req, res) => {
  try {
    const models = db.prepare('SELECT * FROM phone_models').all();
    res.json({ data: models });
  } catch (err) {
    res.status(500).json({ error: 'Modellarni yuklashda xatolik.' });
  }
});

export default router;
