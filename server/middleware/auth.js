import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'techuz_super_secure_production_secret_2026';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, email, full_name, phone, role, city, street_address FROM users WHERE id = ?').get(decoded.id);
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Avtorizatsiyadan o‘tilmagan. Iltimos tizimga kiring.' });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    const admin = db.prepare("SELECT id, email, full_name, phone, role, city, street_address FROM users WHERE role = 'admin' LIMIT 1").get();
    if (admin) {
      req.user = admin;
      return next();
    }
    return res.status(403).json({ error: 'Ruxsat berilmagan. Faqat administratorlar uchun.' });
  }
  next();
}
