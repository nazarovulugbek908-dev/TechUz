import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { mockProducts } from '../src/data/mockProducts.js';
import { mockCategories } from '../src/data/mockCategories.js';
import { mockBrands } from '../src/data/mockBrands.js';
import { mockPhoneModels } from '../src/data/mockPhoneModels.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'techuz.db');
export const db = new DatabaseSync(DB_PATH);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer',
    city TEXT DEFAULT 'Toshkent',
    street_address TEXT DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name_uz TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    icon TEXT,
    badge TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS brands (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS phone_models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    release_year INTEGER,
    popular INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    name_uz TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    desc_uz TEXT,
    desc_ru TEXT,
    price INTEGER NOT NULL,
    old_price INTEGER,
    stock INTEGER NOT NULL DEFAULT 0,
    warranty_months INTEGER DEFAULT 12,
    badge TEXT,
    rating REAL DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    compatible_models TEXT,
    images TEXT,
    variants TEXT,
    specs TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_region TEXT,
    customer_city TEXT,
    customer_street TEXT,
    customer_notes TEXT,
    subtotal INTEGER NOT NULL,
    delivery_fee INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    status TEXT NOT NULL DEFAULT 'pending',
    items TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed default data if database is empty
export function initializeDatabase() {
  // 1. Seed or ensure Admin user
  const adminCheck = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('admin');
  const adminPassHash = bcrypt.hashSync('admin123', 10);
  const now = new Date().toISOString();

  if (!adminCheck) {
    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, phone, role, city, street_address, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'usr-admin-01',
      'admin@gmail.com',
      adminPassHash,
      'TechUz Boshqaruvchi',
      '+998 94 587-64-72',
      'admin',
      'Toshkent',
      'Amir Temur ko\'chasi, 10-uy',
      now,
      now
    );
    console.log('✓ Admin account seeded: admin@gmail.com / admin123');
  } else {
    // Ensure admin password is reset to admin123 and email is verified
    db.prepare("UPDATE users SET password_hash = ? WHERE role = 'admin'").run(adminPassHash);
  }

  // 2. Categories, Brands, Phone Models & Products - start clean for admin to manage
  // Auto-seeding of mock data disabled.

  // 6. Seed store settings if empty
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get().count;
  if (settingsCount === 0) {
    const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
    insertSetting.run('store_name', 'TechUz Store');
    insertSetting.run('hotline', '+998 94 587-64-72');
    insertSetting.run('free_delivery_threshold', '500000');
    insertSetting.run('standard_delivery_fee', '30000');
  }
}
