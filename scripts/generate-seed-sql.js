import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mockCategories } from '../src/data/mockCategories.js';
import { mockBrands } from '../src/data/mockBrands.js';
import { mockPhoneModels } from '../src/data/mockPhoneModels.js';
import { mockProducts } from '../src/data/mockProducts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escapeJson(obj) {
  if (obj === null || obj === undefined) return "'[]'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

let sql = `-- TechUz Supabase Seed Data
-- Generated automatically from existing catalog

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, slug, name_uz, name_ru, icon, badge)
VALUES
`;

const catRows = mockCategories.map((c) => {
  return `  (${escapeSql(c.id)}, ${escapeSql(c.slug)}, ${escapeSql(c.name_uz || c.nameUz)}, ${escapeSql(c.name_ru || c.nameRu)}, ${escapeSql(c.icon)}, ${escapeSql(c.badge)})`;
});
sql += catRows.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET\n  slug = EXCLUDED.slug, name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, icon = EXCLUDED.icon, badge = EXCLUDED.badge;\n\n';

// 2. SEED BRANDS
sql += `-- 2. SEED BRANDS\nINSERT INTO public.brands (id, slug, name, active)\nVALUES\n`;
const brandRows = mockBrands.map((b) => {
  return `  (${escapeSql(b.id)}, ${escapeSql(b.slug)}, ${escapeSql(b.name)}, ${b.active ? 'true' : 'false'})`;
});
sql += brandRows.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET\n  slug = EXCLUDED.slug, name = EXCLUDED.name, active = EXCLUDED.active;\n\n';

// 3. SEED PHONE MODELS
sql += `-- 3. SEED PHONE MODELS\nINSERT INTO public.phone_models (id, name, brand, release_year, popular)\nVALUES\n`;
const modelRows = mockPhoneModels.map((m) => {
  return `  (${escapeSql(m.id)}, ${escapeSql(m.name)}, ${escapeSql(m.brand)}, ${m.releaseYear || 'NULL'}, ${m.popular ? 'true' : 'false'})`;
});
sql += modelRows.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET\n  name = EXCLUDED.name, brand = EXCLUDED.brand, release_year = EXCLUDED.release_year, popular = EXCLUDED.popular;\n\n';

// 4. SEED PRODUCTS
sql += `-- 4. SEED PRODUCTS\nINSERT INTO public.products (
  id, slug, category, brand, name_uz, name_ru, desc_uz, desc_ru,
  price, old_price, stock, warranty_months, badge, rating, reviews_count,
  is_featured, compatible_models, images, variants, specs
)\nVALUES\n`;

const prodRows = mockProducts.map((p) => {
  return `  (
    ${escapeSql(p.id)},
    ${escapeSql(p.slug)},
    ${escapeSql(p.category)},
    ${escapeSql(p.brand)},
    ${escapeSql(p.nameUz || p.name_uz)},
    ${escapeSql(p.nameRu || p.name_ru)},
    ${escapeSql(p.descUz || p.desc_uz)},
    ${escapeSql(p.descRu || p.desc_ru)},
    ${p.price},
    ${p.oldPrice || 'NULL'},
    ${p.stock || 0},
    ${p.warrantyMonths || 12},
    ${escapeSql(p.badge)},
    ${p.rating || 5.0},
    ${p.reviewsCount || 0},
    ${p.isFeatured ? 'true' : 'false'},
    ${escapeJson(p.compatibleModels || [])},
    ${escapeJson(p.images || [])},
    ${escapeJson(p.variants || [])},
    ${escapeJson(p.specs || {})}
  )`;
});

sql += prodRows.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET\n' +
  '  slug = EXCLUDED.slug,\n' +
  '  category = EXCLUDED.category,\n' +
  '  brand = EXCLUDED.brand,\n' +
  '  name_uz = EXCLUDED.name_uz,\n' +
  '  name_ru = EXCLUDED.name_ru,\n' +
  '  desc_uz = EXCLUDED.desc_uz,\n' +
  '  desc_ru = EXCLUDED.desc_ru,\n' +
  '  price = EXCLUDED.price,\n' +
  '  old_price = EXCLUDED.old_price,\n' +
  '  stock = EXCLUDED.stock,\n' +
  '  warranty_months = EXCLUDED.warranty_months,\n' +
  '  badge = EXCLUDED.badge,\n' +
  '  rating = EXCLUDED.rating,\n' +
  '  reviews_count = EXCLUDED.reviews_count,\n' +
  '  is_featured = EXCLUDED.is_featured,\n' +
  '  compatible_models = EXCLUDED.compatible_models,\n' +
  '  images = EXCLUDED.images,\n' +
  '  variants = EXCLUDED.variants,\n' +
  '  specs = EXCLUDED.specs;\n\n';

// 5. SEED SITE SETTINGS
sql += `-- 5. SEED SITE SETTINGS\nINSERT INTO public.site_settings (key, value)\nVALUES\n` +
  `  ('store_info', '{"name": "TechUz Electronics", "phone": "+998 94 587-64-72", "email": "info@techuz.uz", "address": "Toshkent shahri, Chilonzor 9-mavze", "working_hours": "09:00 - 21:00"}'::jsonb),\n` +
  `  ('delivery_settings', '{"standard_fee": 25000, "free_delivery_threshold": 300000, "express_fee": 45000}'::jsonb)\n` +
  `ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;\n`;

const outputPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
fs.writeFileSync(outputPath, sql, 'utf-8');
console.log('Seed SQL generated successfully at:', outputPath);
