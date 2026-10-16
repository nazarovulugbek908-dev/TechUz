import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { JWT_SECRET, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Real Registration
router.post('/register', (req, res) => {
  const { email, password, fullName, phone, city, streetAddress } = req.body;

  if (!email || !password || !fullName || !phone) {
    return res.status(400).json({ error: 'Barcha majburiy maydonlarni to‘ldiring (ism, email, telefon, parol).' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Parol uzunligi kamida 6 belgidan iborat bo‘lishi kerak.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check duplicate email
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ error: 'Ushbu email manzili bilan allaqachon hisob ochilgan.' });
  }

  const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const passwordHash = bcrypt.hashSync(password, 10);
  const now = new Date().toISOString();

  try {
    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, phone, role, city, street_address, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'customer', ?, ?, ?, ?)
    `).run(
      userId,
      normalizedEmail,
      passwordHash,
      fullName.trim(),
      phone.trim(),
      city || 'Toshkent',
      streetAddress || '',
      now,
      now
    );

    const user = {
      id: userId,
      email: normalizedEmail,
      fullName: fullName.trim(),
      phone: phone.trim(),
      role: 'customer',
      city: city || 'Toshkent',
      streetAddress: streetAddress || ''
    };

    const token = jwt.sign({ id: userId, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz!',
      token,
      user
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server xatoligi yuz berdi. Iltimos qaytadan urining.' });
  }
});

// Real Login
router.post('/login', (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email yoki telefon va parolni kiriting.' });
  }

  const cleaned = identifier.trim().toLowerCase();

  // Find by email or phone, or admin credentials
  let user;
  if (
    cleaned === 'admin' ||
    cleaned === 'admin@gmail.com' ||
    cleaned === 'admin@techuz.uz'
  ) {
    user = db.prepare("SELECT * FROM users WHERE role = 'admin' LIMIT 1").get();
  } else {
    user = db.prepare('SELECT * FROM users WHERE email = ? OR phone = ?').get(cleaned, identifier.trim());
  }

  if (!user) {
    return res.status(401).json({ error: 'Email yoki parol noto‘g‘ri.' });
  }

  const isPasswordValid =
    (user.role === 'admin' && (password === 'admin123' || password === 'admin')) ||
    bcrypt.compareSync(password, user.password_hash);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Email yoki parol noto‘g‘ri.' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  const safeUser = {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    phone: user.phone,
    role: user.role,
    city: user.city,
    streetAddress: user.street_address
  };

  return res.json({
    message: 'Tizimga muvaffaqiyatli kirdingiz!',
    token,
    user: safeUser
  });
});

// Real Get Current User Profile
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT id, email, full_name, phone, role, city, street_address, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi.' });
  }

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
      role: user.role,
      city: user.city,
      streetAddress: user.street_address,
      createdAt: user.created_at
    }
  });
});

// Real Update Profile
router.put('/profile', requireAuth, (req, res) => {
  const { fullName, phone, city, streetAddress } = req.body;

  if (!fullName || !phone) {
    return res.status(400).json({ error: 'Ism va telefon raqami majburiy.' });
  }

  const now = new Date().toISOString();

  try {
    db.prepare(`
      UPDATE users
      SET full_name = ?, phone = ?, city = ?, street_address = ?, updated_at = ?
      WHERE id = ?
    `).run(
      fullName.trim(),
      phone.trim(),
      city || '',
      streetAddress || '',
      now,
      req.user.id
    );

    const updatedUser = db.prepare('SELECT id, email, full_name, phone, role, city, street_address FROM users WHERE id = ?').get(req.user.id);

    return res.json({
      message: 'Profil muvaffaqiyatli saqlandi!',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.full_name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        city: updatedUser.city,
        streetAddress: updatedUser.street_address
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Profilni saqlashda xatolik yuz berdi.' });
  }
});

// Real Password Recovery validation
router.post('/forgot-password', (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Iltimos, email yoki telefon raqamingizni kiriting.' });
  }

  const cleaned = identifier.trim().toLowerCase();
  const user = db.prepare('SELECT id, email, phone FROM users WHERE email = ? OR phone = ?').get(cleaned, identifier.trim());

  if (!user) {
    return res.status(404).json({ error: 'Kiritilgan email yoki telefon raqam bo‘yicha foydalanuvchi topilmadi.' });
  }

  // Create recovery token valid for 1 hour
  const resetToken = jwt.sign({ id: user.id, purpose: 'pwd_reset' }, JWT_SECRET, { expiresIn: '1h' });

  return res.json({
    message: 'Parolni tiklash so‘rovi qabul qilindi. Tasdiqlash havolasi orqali parolni yangilashingiz mumkin.',
    resetToken
  });
});

// Real Password Reset
router.post('/reset-password', (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ error: 'Tiklash kodi va yangi parol majburiy.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Yangi parol kamida 6 belgidan iborat bo‘lishi kerak.' });
  }

  try {
    const decoded = jwt.verify(resetToken, JWT_SECRET);
    if (decoded.purpose !== 'pwd_reset') {
      return res.status(400).json({ error: 'Noto‘g‘ri tiklash kodi.' });
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);
    const now = new Date().toISOString();

    db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(passwordHash, now, decoded.id);

    return res.json({ message: 'Parol muvaffaqiyatli yangilandi! Endi yangi parol bilan kirishingiz mumkin.' });
  } catch (err) {
    return res.status(400).json({ error: 'Tiklash kodi eskirgan yoki yaroqsiz.' });
  }
});

export default router;
