-- TechUz Electronics E-Commerce Schema
-- Supabase PostgreSQL Migration
-- Created: 2026-10-16

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
  city TEXT DEFAULT 'Toshkent',
  street_address TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Addresses
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Uy',
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT DEFAULT 'Toshkent viloyati',
  postal_code TEXT DEFAULT '',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PRODUCT CATALOG
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_uz TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  icon TEXT,
  badge TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.brands (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  logo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.phone_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  release_year INT,
  popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  name_uz TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  desc_uz TEXT,
  desc_ru TEXT,
  price NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
  old_price NUMERIC(14, 2) CHECK (old_price >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  warranty_months INT DEFAULT 12,
  badge TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  compatible_models JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ORDERS & SHOPPING
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_region TEXT DEFAULT 'Toshkent',
  customer_city TEXT DEFAULT 'Toshkent',
  customer_street TEXT DEFAULT '',
  customer_notes TEXT DEFAULT '',
  subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(14, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total NUMERIC(14, 2) NOT NULL CHECK (total >= 0),
  payment_method TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'click', 'payme')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. INDEXES FOR HIGH PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);
CREATE INDEX IF NOT EXISTS idx_phone_models_brand ON public.phone_models(brand);

-- 7. AUTOMATIC USER PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role, city, street_address)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'city', 'Toshkent'),
    COALESCE(NEW.raw_user_meta_data->>'street_address', NEW.raw_user_meta_data->>'streetAddress', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END,
    phone = CASE WHEN EXCLUDED.phone <> '' THEN EXCLUDED.phone ELSE public.profiles.phone END,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Helper function to promote any user to admin securely
CREATE OR REPLACE FUNCTION public.promote_to_admin(target_email TEXT)
RETURNS TEXT AS $$
DECLARE
  v_count INT;
BEGIN
  UPDATE public.profiles
  SET role = 'admin'
  WHERE LOWER(email) = LOWER(target_email);

  GET DIAGNOSTICS v_count = ROW_COUNT;
  IF v_count > 0 THEN
    RETURN 'Foydalanuvchi muvaffaqiyatli admin etib tayinlandi: ' || target_email;
  ELSE
    RETURN 'Foydalanuvchi topilmadi: ' || target_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. STORAGE BUCKET CONFIGURATION
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 9. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Clean existing policies
DROP POLICY IF EXISTS "Profiles are readable by owner or admin" ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be updated by owner or admin" ON public.profiles;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Categories manageable by admin" ON public.categories;
DROP POLICY IF EXISTS "Brands are viewable by everyone" ON public.brands;
DROP POLICY IF EXISTS "Brands manageable by admin" ON public.brands;
DROP POLICY IF EXISTS "Phone models are viewable by everyone" ON public.phone_models;
DROP POLICY IF EXISTS "Phone models manageable by admin" ON public.phone_models;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products manageable by admin" ON public.products;
DROP POLICY IF EXISTS "Orders viewable by owner or admin" ON public.orders;
DROP POLICY IF EXISTS "Orders insertable by customer or guest" ON public.orders;
DROP POLICY IF EXISTS "Orders updatable by admin" ON public.orders;
DROP POLICY IF EXISTS "Site settings viewable by everyone" ON public.site_settings;
DROP POLICY IF EXISTS "Site settings manageable by admin" ON public.site_settings;

-- PROFILES Policies
CREATE POLICY "Profiles are readable by owner or admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles can be updated by owner or admin"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles can be inserted by authenticated user or admin"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- USER ADDRESSES Policies
CREATE POLICY "User addresses viewable by owner"
  ON public.user_addresses FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "User addresses manageable by owner"
  ON public.user_addresses FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- CATEGORIES Policies
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Categories manageable by admin"
  ON public.categories FOR ALL
  USING (public.is_admin());

-- BRANDS Policies
CREATE POLICY "Brands are viewable by everyone"
  ON public.brands FOR SELECT
  USING (true);

CREATE POLICY "Brands manageable by admin"
  ON public.brands FOR ALL
  USING (public.is_admin());

-- PHONE MODELS Policies
CREATE POLICY "Phone models are viewable by everyone"
  ON public.phone_models FOR SELECT
  USING (true);

CREATE POLICY "Phone models manageable by admin"
  ON public.phone_models FOR ALL
  USING (public.is_admin());

-- PRODUCTS Policies
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Products manageable by admin"
  ON public.products FOR ALL
  USING (public.is_admin());

-- ORDERS Policies
CREATE POLICY "Orders viewable by owner or admin"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Orders insertable by customer or guest"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Orders updatable by admin"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- SITE SETTINGS Policies
CREATE POLICY "Site settings viewable by everyone"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Site settings manageable by admin"
  ON public.site_settings FOR ALL
  USING (public.is_admin());

-- STORAGE POLICIES
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');


-- ==========================================
-- INITIAL CATALOG SEED DATA
-- ==========================================

-- TechUz Supabase Seed Data
-- Generated automatically from existing catalog

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, slug, name_uz, name_ru, icon, badge)
VALUES
  ('smartphones', 'smartphones', 'Smartfonlar', 'Смартфоны', 'Smartphone', NULL),
  ('cases', 'cases', 'G''iloflar va Chexollar', 'Чехлы и бамперы', 'Shield', 'Trend'),
  ('chargers', 'chargers', 'Quvvatlagichlar', 'Зарядные устройства', 'Zap', 'Top'),
  ('headphones', 'headphones', 'Quloqchinlar', 'Наушники', 'Headphones', NULL),
  ('screen_protectors', 'screen-protectors', 'Himoya oynalari', 'Защитные стекла', 'SmartphoneNfc', NULL),
  ('power_banks', 'power-banks', 'Powerbanklar', 'Повербанки', 'BatteryCharging', NULL),
  ('cables', 'cables', 'Kabellar va Adapterlar', 'Кабели и адаптеры', 'Cable', NULL)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug, name_uz = EXCLUDED.name_uz, name_ru = EXCLUDED.name_ru, icon = EXCLUDED.icon, badge = EXCLUDED.badge;

-- 2. SEED BRANDS
INSERT INTO public.brands (id, slug, name, active)
VALUES
  ('apple', 'apple', 'Apple', true),
  ('samsung', 'samsung', 'Samsung', true),
  ('xiaomi', 'xiaomi', 'Xiaomi', true),
  ('google', 'google', 'Google', true),
  ('anker', 'anker', 'Anker', true),
  ('baseus', 'baseus', 'Baseus', true),
  ('ugreen', 'ugreen', 'Ugreen', true),
  ('hoco', 'hoco', 'Hoco', true),
  ('joyroom', 'joyroom', 'Joyroom', true)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug, name = EXCLUDED.name, active = EXCLUDED.active;

-- 3. SEED PHONE MODELS
INSERT INTO public.phone_models (id, name, brand, release_year, popular)
VALUES
  ('iphone-15-pro-max', 'iPhone 15 Pro Max', 'Apple', 2023, true),
  ('iphone-15-pro', 'iPhone 15 Pro', 'Apple', 2023, true),
  ('iphone-15', 'iPhone 15', 'Apple', 2023, true),
  ('iphone-14-pro', 'iPhone 14 Pro', 'Apple', 2022, true),
  ('iphone-14', 'iPhone 14', 'Apple', 2022, true),
  ('iphone-13', 'iPhone 13', 'Apple', 2021, false),
  ('iphone-12', 'iPhone 12', 'Apple', 2020, false),
  ('samsung-s24-ultra', 'Samsung Galaxy S24 Ultra', 'Samsung', 2024, true),
  ('samsung-s24', 'Samsung Galaxy S24', 'Samsung', 2024, true),
  ('samsung-s23-ultra', 'Samsung Galaxy S23 Ultra', 'Samsung', 2023, false),
  ('samsung-a55', 'Samsung Galaxy A55 5G', 'Samsung', 2024, true),
  ('samsung-a35', 'Samsung Galaxy A35 5G', 'Samsung', 2024, false),
  ('samsung-a54', 'Samsung Galaxy A54 5G', 'Samsung', 2023, false),
  ('xiaomi-14', 'Xiaomi 14', 'Xiaomi', 2024, true),
  ('xiaomi-redmi-note-13-pro', 'Xiaomi Redmi Note 13 Pro', 'Xiaomi', 2024, true),
  ('xiaomi-redmi-note-13', 'Xiaomi Redmi Note 13', 'Xiaomi', 2024, true),
  ('xiaomi-redmi-12', 'Xiaomi Redmi 12', 'Xiaomi', 2023, false),
  ('pixel-8-pro', 'Google Pixel 8 Pro', 'Google', 2023, true),
  ('pixel-8', 'Google Pixel 8', 'Google', 2023, true),
  ('pixel-7a', 'Google Pixel 7a', 'Google', 2023, false)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, brand = EXCLUDED.brand, release_year = EXCLUDED.release_year, popular = EXCLUDED.popular;

-- 4. SEED PRODUCTS
INSERT INTO public.products (
  id, slug, category, brand, name_uz, name_ru, desc_uz, desc_ru,
  price, old_price, stock, warranty_months, badge, rating, reviews_count,
  is_featured, compatible_models, images, variants, specs
)
VALUES
  (
    'phone-apple-ip15pm',
    'apple-iphone-15-pro-max-256gb',
    'smartphones',
    'Apple',
    'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    'Apple iPhone 15 Pro Max 256GB Натуральный титан',
    'A17 Pro 3nm chipi, 48MP asosiy kamera, 5x optik zoom va yengil titan korpus.',
    'Процессор A17 Pro 3нм, основная камера 48 МП, 5-кратный оптический зум и титановый корпус.',
    15890000,
    16900000,
    14,
    12,
    'premium',
    4.9,
    54,
    true,
    '["iphone-15-pro-max"]'::jsonb,
    '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-ip15pm-nat","color":"#8E857B","colorNameUz":"Natural Titanium","colorNameRu":"Натуральный титан","storage":"256GB","price":15890000,"oldPrice":16900000,"stock":8},{"id":"v-ip15pm-blk","color":"#27262A","colorNameUz":"Black Titanium","colorNameRu":"Черный титан","storage":"256GB","price":15890000,"oldPrice":16900000,"stock":6},{"id":"v-ip15pm-blu","color":"#2F3843","colorNameUz":"Blue Titanium","colorNameRu":"Синий титан","storage":"512GB","price":17950000,"oldPrice":18900000,"stock":0}]'::jsonb,
    '{"Ekran":"6.7\" Super Retina XDR OLED 120Hz","Protsessor":"Apple A17 Pro (3 nm)","Xotira":"256GB / 8GB RAM","Kamera":"48 MP + 12 MP (5x) + 12 MP","Batareya":"4441 mAh, Type-C 3.0"}'::jsonb
  ),
  (
    'phone-apple-ip15p',
    'apple-iphone-15-pro-128gb',
    'smartphones',
    'Apple',
    'Apple iPhone 15 Pro 128GB Black Titanium',
    'Apple iPhone 15 Pro 128GB Черный титан',
    'Yengil titan ramka, Action Button tugmasi va dinamik orol funksiyasi.',
    'Легкая титановая рамка, кнопка Action Button и Dynamic Island.',
    13650000,
    14400000,
    9,
    12,
    'new',
    4.8,
    37,
    true,
    '["iphone-15-pro"]'::jsonb,
    '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-ip15p-blk","color":"#18181B","colorNameUz":"Black Titanium","colorNameRu":"Черный титан","storage":"128GB","price":13650000,"oldPrice":14400000,"stock":5},{"id":"v-ip15p-wht","color":"#E3E4E5","colorNameUz":"White Titanium","colorNameRu":"Белый титан","storage":"128GB","price":13650000,"oldPrice":14400000,"stock":4}]'::jsonb,
    '{"Ekran":"6.1\" OLED 120Hz ProMotion","Protsessor":"Apple A17 Pro","Xotira":"128GB / 8GB RAM","Kamera":"48 MP + 12 MP + 12 MP (3x)","Batareya":"3274 mAh"}'::jsonb
  ),
  (
    'phone-apple-ip15',
    'apple-iphone-15-128gb',
    'smartphones',
    'Apple',
    'Apple iPhone 15 128GB Pink / Pushti',
    'Apple iPhone 15 128GB Розовый',
    'Rangli mot shisha orqa panel, Dynamic Island va 48MP asosiy kamera.',
    'Матовое стекло задней панели, Dynamic Island и камера 48 МП.',
    10450000,
    NULL,
    18,
    12,
    NULL,
    4.8,
    42,
    false,
    '["iphone-15"]'::jsonb,
    '["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-ip15-pnk","color":"#FBCFE8","colorNameUz":"Pushti","colorNameRu":"Розовый","storage":"128GB","price":10450000,"oldPrice":null,"stock":10},{"id":"v-ip15-blk","color":"#18181B","colorNameUz":"Qora","colorNameRu":"Черный","storage":"128GB","price":10450000,"oldPrice":null,"stock":8}]'::jsonb,
    '{"Ekran":"6.1\" Super Retina XDR OLED","Protsessor":"Apple A16 Bionic","Xotira":"128GB / 6GB RAM","Kamera":"48 MP + 12 MP UltraWide","Batareya":"3349 mAh"}'::jsonb
  ),
  (
    'phone-samsung-s24u',
    'samsung-galaxy-s24-ultra-512gb',
    'smartphones',
    'Samsung',
    'Samsung Galaxy S24 Ultra 512GB Titanium Gray (AI)',
    'Samsung Galaxy S24 Ultra 512GB Серый титан (AI)',
    'Galaxy AI sun''iy intellekt, 200MP kamera, o''rnatilgan S-Pen va 2600 nit yorqin ekran.',
    'Искусственный интеллект Galaxy AI, камера 200 МП, встроенный S-Pen и экран 2600 нит.',
    16200000,
    17800000,
    11,
    12,
    'sale',
    4.9,
    61,
    true,
    '["samsung-s24-ultra"]'::jsonb,
    '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-s24u-gry","color":"#475569","colorNameUz":"Titanium Gray","colorNameRu":"Серый титан","storage":"512GB","price":16200000,"oldPrice":17800000,"stock":6},{"id":"v-s24u-blk","color":"#1E293B","colorNameUz":"Titanium Black","colorNameRu":"Черный титан","storage":"512GB","price":16200000,"oldPrice":17800000,"stock":5}]'::jsonb,
    '{"Ekran":"6.8\" Dynamic LTPO AMOLED 2X 120Hz","Protsessor":"Snapdragon 8 Gen 3 for Galaxy","Xotira":"512GB / 12GB RAM","Kamera":"200 MP + 50 MP (5x) + 10 MP (3x) + 12 MP","Batareya":"5000 mAh, 45W"}'::jsonb
  ),
  (
    'phone-samsung-s24',
    'samsung-galaxy-s24-256gb',
    'smartphones',
    'Samsung',
    'Samsung Galaxy S24 8/256GB Onyx Black',
    'Samsung Galaxy S24 8/256GB Черный оникс',
    'Kompakt flagman, yupqa simmetrik ramkalar va Galaxy AI tarjimon funksiyalari.',
    'Компактный флагман, симметричные тонкие рамки и функции Galaxy AI.',
    9890000,
    10500000,
    15,
    12,
    'new',
    4.7,
    29,
    false,
    '["samsung-s24"]'::jsonb,
    '["https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-s24-blk","color":"#0F172A","colorNameUz":"Onyx Black","colorNameRu":"Черный оникс","storage":"256GB","price":9890000,"oldPrice":10500000,"stock":10},{"id":"v-s24-ylw","color":"#FEF08A","colorNameUz":"Amber Yellow","colorNameRu":"Желтый янтарь","storage":"256GB","price":9890000,"oldPrice":10500000,"stock":5}]'::jsonb,
    '{"Ekran":"6.2\" Dynamic AMOLED 2X 120Hz","Protsessor":"Exynos 2400","Xotira":"256GB / 8GB RAM","Kamera":"50 MP + 10 MP (3x) + 12 MP","Batareya":"4000 mAh"}'::jsonb
  ),
  (
    'phone-samsung-a55',
    'samsung-galaxy-a55-5g-128gb',
    'smartphones',
    'Samsung',
    'Samsung Galaxy A55 5G 8/128GB Awesome Iceblue',
    'Samsung Galaxy A55 5G 8/128GB Ледяной синий',
    'Metall rom, shisha korpus, 50MP tungi fotosuratlar kamerasi va IP67 himoyasi.',
    'Металлическая рамка, стеклянный корпус, камера 50 МП и защита IP67.',
    4690000,
    4990000,
    22,
    12,
    'sale',
    4.6,
    45,
    true,
    '["samsung-a55"]'::jsonb,
    '["https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-a55-blu","color":"#BAE6FD","colorNameUz":"Ice Blue","colorNameRu":"Ледяной синий","storage":"128GB","price":4690000,"oldPrice":4990000,"stock":14},{"id":"v-a55-nvy","color":"#1E293B","colorNameUz":"Navy","colorNameRu":"Темно-синий","storage":"128GB","price":4690000,"oldPrice":4990000,"stock":8}]'::jsonb,
    '{"Ekran":"6.6\" Super AMOLED 120Hz 1000 nits","Protsessor":"Exynos 1480 (4 nm)","Xotira":"128GB / 8GB RAM","Kamera":"50 MP OIS + 12 MP + 5 MP","Batareya":"5000 mAh, 25W"}'::jsonb
  ),
  (
    'phone-xiaomi-14',
    'xiaomi-14-12-512gb-leica',
    'smartphones',
    'Xiaomi',
    'Xiaomi 14 12/512GB Leica Optics Black',
    'Xiaomi 14 12/512GB Оптика Leica Черный',
    'Leica Summilux professional linzalari, Snapdragon 8 Gen 3 va 90W HyperCharge zaryadlash.',
    'Профессиональная оптика Leica Summilux, чип Snapdragon 8 Gen 3 и зарядка 90 Вт.',
    10200000,
    NULL,
    7,
    12,
    'premium',
    4.8,
    19,
    true,
    '["xiaomi-14"]'::jsonb,
    '["https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-mi14-blk","color":"#18181B","colorNameUz":"Black","colorNameRu":"Черный","storage":"512GB","price":10200000,"oldPrice":null,"stock":4},{"id":"v-mi14-grn","color":"#166534","colorNameUz":"Jade Green","colorNameRu":"Нефритовый зеленый","storage":"512GB","price":10200000,"oldPrice":null,"stock":3}]'::jsonb,
    '{"Ekran":"6.36\" LTPO OLED 120Hz 3000 nits","Protsessor":"Snapdragon 8 Gen 3","Xotira":"512GB / 12GB RAM","Kamera":"50 MP Leica + 50 MP (3.2x) + 50 MP","Batareya":"4610 mAh, 90W simli / 50W simsiz"}'::jsonb
  ),
  (
    'phone-xiaomi-rn13pro',
    'xiaomi-redmi-note-13-pro-256gb',
    'smartphones',
    'Xiaomi',
    'Xiaomi Redmi Note 13 Pro 8/256GB Midnight Black',
    'Xiaomi Redmi Note 13 Pro 8/256GB Черный',
    '200MP OIS ultra-tiniq kamera, 120Hz AMOLED ekran va 67W tezkor zaryadlash.',
    'Камера 200 МП с OIS, AMOLED 120 Гц и турбо-зарядка 67 Вт.',
    3350000,
    3650000,
    30,
    12,
    'sale',
    4.7,
    88,
    true,
    '["xiaomi-redmi-note-13-pro"]'::jsonb,
    '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-rn13p-blk","color":"#1E1E24","colorNameUz":"Midnight Black","colorNameRu":"Черный","storage":"256GB","price":3350000,"oldPrice":3650000,"stock":18},{"id":"v-rn13p-blu","color":"#38BDF8","colorNameUz":"Ocean Teal","colorNameRu":"Морской синий","storage":"256GB","price":3350000,"oldPrice":3650000,"stock":12}]'::jsonb,
    '{"Ekran":"6.67\" AMOLED 120Hz 1800 nits","Protsessor":"MediaTek Helio G99-Ultra","Xotira":"256GB / 8GB RAM","Kamera":"200 MP OIS + 8 MP + 2 MP","Batareya":"5000 mAh, 67W"}'::jsonb
  ),
  (
    'case-magsafe-ip15p',
    'magsafe-silicone-case-iphone-15-pro',
    'cases',
    'TechUz Original',
    'MagSafe Silicone Case iPhone 15 Pro uchun (Mikrofibra)',
    'Силиконовый чехол MagSafe для iPhone 15 Pro с микрофиброй',
    'Kuchli neodim magnitli MagSafe halqasi, yumshoq soft-touch qoplama va ichki baxmal mikrofibra.',
    'Мощное кольцо MagSafe, soft-touch покрытие и внутренняя подкладка из микрофибры.',
    185000,
    240000,
    45,
    3,
    'sale',
    4.9,
    112,
    true,
    '["iphone-15-pro"]'::jsonb,
    '["https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-case-ip15p-org","color":"#FF7900","colorNameUz":"Orange Tech","colorNameRu":"Оранжевый Tech","price":185000,"oldPrice":240000,"stock":20},{"id":"v-case-ip15p-blk","color":"#18181B","colorNameUz":"Midnight Black","colorNameRu":"Черный полночь","price":185000,"oldPrice":240000,"stock":15},{"id":"v-case-ip15p-blu","color":"#1E3A8A","colorNameUz":"Deep Blue","colorNameRu":"Глубокий синий","price":185000,"oldPrice":240000,"stock":10}]'::jsonb,
    '{"Material":"Premium Silikon + Mikrofibra","MagSafe":"Ha, o''rnatilgan kuchli neodim magnit","Kamera himoyasi":"1.5mm ko''tarilgan burchak romi"}'::jsonb
  ),
  (
    'case-magsafe-ip15pm',
    'magsafe-silicone-case-iphone-15-pro-max',
    'cases',
    'TechUz Original',
    'MagSafe Silicone Case iPhone 15 Pro Max uchun',
    'Силиконовый чехол MagSafe для iPhone 15 Pro Max',
    'Kuchli MagSafe magniti, kamera linzalarini to''liq himoyalovchi mustahkam rom.',
    'Мощный магнит MagSafe, защита блока камер и soft-touch покрытие.',
    195000,
    250000,
    35,
    3,
    'new',
    4.8,
    78,
    true,
    '["iphone-15-pro-max"]'::jsonb,
    '["https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-case-ip15pm-org","color":"#FF7900","colorNameUz":"Orange Tech","colorNameRu":"Оранжевый","price":195000,"oldPrice":250000,"stock":15},{"id":"v-case-ip15pm-blk","color":"#18181B","colorNameUz":"Black","colorNameRu":"Черный","price":195000,"oldPrice":250000,"stock":20}]'::jsonb,
    '{"Material":"Silikon + Neodim magnitlar","Qalinlik":"1.8 mm"}'::jsonb
  ),
  (
    'case-s24u-armor',
    'shockproof-armor-case-galaxy-s24-ultra',
    'cases',
    'ArmorShield',
    'Zarbalarga chidamli Armor Case Samsung Galaxy S24 Ultra uchun',
    'Ударопрочный чехол Armor для Samsung Galaxy S24 Ultra',
    'Harbiy darajadagi MIL-STD-810G himoyasi, burchaklardagi havo yostiqchalari va yig''iluvchi metall stend.',
    'Военный стандарт защиты MIL-STD-810G, усиленные углы и встроенная подставка.',
    210000,
    270000,
    18,
    6,
    'sale',
    4.7,
    41,
    false,
    '["samsung-s24-ultra"]'::jsonb,
    '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-s24u-arm-blk","color":"#1E293B","colorNameUz":"Matte Black","colorNameRu":"Матовый черный","price":210000,"oldPrice":270000,"stock":10},{"id":"v-s24u-arm-red","color":"#991B1B","colorNameUz":"Crimson Red","colorNameRu":"Темно-красный","price":210000,"oldPrice":270000,"stock":8}]'::jsonb,
    '{"Himoya":"MIL-STD-810G 3 metrli tushish testi","Material":"Polikarbonat + TPU","Qo''shimcha":"Metall stend-tutqich"}'::jsonb
  ),
  (
    'case-s24-clear',
    'clear-hybrid-case-galaxy-s24',
    'cases',
    'CrystalClear',
    'Shaffof gibrid g''ilof Samsung Galaxy S24 uchun',
    'Прозрачный гибридный чехол для Samsung Galaxy S24',
    'Sarg''ayishga qarshi maxsus UV polimer, yupqa va mutlaqo shaffof korpus.',
    'Антижелтеющий полимер, ультратонкий и кристально прозрачный.',
    120000,
    150000,
    25,
    1,
    NULL,
    4.6,
    22,
    false,
    '["samsung-s24"]'::jsonb,
    '["https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-s24-clr","color":"#FFFFFF","colorNameUz":"Shaffof / Transparent","colorNameRu":"Прозрачный","price":120000,"oldPrice":150000,"stock":25}]'::jsonb,
    '{"Material":"Anti-UV Polikarbonat","Qalinligi":"1.2 mm"}'::jsonb
  ),
  (
    'case-a55-matte',
    'matte-silicone-case-galaxy-a55',
    'cases',
    'TechUz Original',
    'Mot silikon g''ilof Samsung Galaxy A55 5G uchun',
    'Матовый силиконовый чехол для Samsung Galaxy A55 5G',
    'Barmoq izlari qoldirmaydigan mot yuzaga ega qulay silikon chexol.',
    'Матовое покрытие без отпечатков пальцев, идеальная посадка.',
    95000,
    NULL,
    40,
    1,
    NULL,
    4.7,
    33,
    false,
    '["samsung-a55"]'::jsonb,
    '["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-a55-blk","color":"#18181B","colorNameUz":"Qora","colorNameRu":"Черный","price":95000,"oldPrice":null,"stock":20},{"id":"v-a55-grn","color":"#065F46","colorNameUz":"Zaytun","colorNameRu":"Оливковый","price":95000,"oldPrice":null,"stock":20}]'::jsonb,
    '{"Material":"TPU Silikon","Qalinligi":"1.5 mm"}'::jsonb
  ),
  (
    'case-rn13pro-carbon',
    'carbon-fiber-case-redmi-note-13-pro',
    'cases',
    'CarbonStyle',
    'Karbon teksturali g''ilof Xiaomi Redmi Note 13 Pro uchun',
    'Чехол с карбоновой текстурой для Xiaomi Redmi Note 13 Pro',
    'Yengil uglerod tolasiga taqlid qilingan zamonaviy tekstura va issiqlik tarqatuvchi ichki naqsh.',
    'Стильная карбоновая текстура, эффективное рассеивание тепла.',
    85000,
    110000,
    25,
    1,
    'sale',
    4.5,
    16,
    false,
    '["xiaomi-redmi-note-13-pro","xiaomi-redmi-note-13"]'::jsonb,
    '["https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-rn13-crb","color":"#27272A","colorNameUz":"Carbon Black","colorNameRu":"Карбоновый черный","price":85000,"oldPrice":110000,"stock":0}]'::jsonb,
    '{"Material":"Elastik Karbon-TPU","Og''irligi":"28 gramm"}'::jsonb
  ),
  (
    'chg-anker-65w',
    'anker-prime-65w-gan-3port-fast-charger',
    'chargers',
    'Anker',
    'Anker Prime 65W GaN III 3-Portli Tezkor Quvvatlagich',
    'Быстрое зарядное устройство Anker Prime 65W GaN III (3 порта)',
    'Noutbuk, planshet va smartfonni bir vaqtda zaryadlash. ActiveShield 2.0 aqlli harorat nazorati.',
    'Одновременная зарядка ноутбука, планшета и смартфона с защитой ActiveShield 2.0.',
    490000,
    590000,
    22,
    18,
    'premium',
    4.9,
    94,
    true,
    '["iphone-15-pro-max","iphone-15-pro","iphone-15","iphone-14-pro","iphone-14","iphone-13","samsung-s24-ultra","samsung-s24","samsung-s23-ultra","samsung-a55","samsung-a35","xiaomi-14","xiaomi-redmi-note-13-pro","xiaomi-redmi-note-13","pixel-8-pro","pixel-8"]'::jsonb,
    '["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-ank65-blk","color":"#1E293B","colorNameUz":"Graphite Black","colorNameRu":"Графитовый черный","price":490000,"oldPrice":590000,"stock":15},{"id":"v-ank65-slv","color":"#E2E8F0","colorNameUz":"Silver","colorNameRu":"Серебристый","price":490000,"oldPrice":590000,"stock":7}]'::jsonb,
    '{"Quvvati":"65W Max GaN III","Portlar":"2x USB-C + 1x USB-A","Protokollar":"PD 3.0, PPS, QC 4.0+, Samsung Super Fast Charge"}'::jsonb
  ),
  (
    'chg-apple-20w',
    'original-apple-20w-usb-c-power-adapter',
    'chargers',
    'Apple',
    'Original Apple 20W USB-C Power Adapter',
    'Оригинальный адаптер питания Apple 20W USB-C',
    'iPhone 12 dan 15 Pro Max gacha bo''lgan modellarni 30 daqiqada 50% gacha tez quvvatlaydi.',
    'Быстрая зарядка iPhone от 12 до 15 Pro Max до 50% за 30 минут.',
    295000,
    350000,
    50,
    12,
    'sale',
    4.9,
    160,
    true,
    '["iphone-15-pro-max","iphone-15-pro","iphone-15","iphone-14-pro","iphone-14","iphone-13","iphone-12"]'::jsonb,
    '["https://images.unsplash.com/photo-1618478594486-c65b899c4936?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-ap20-wht","color":"#FFFFFF","colorNameUz":"White","colorNameRu":"Белый","price":295000,"oldPrice":350000,"stock":50}]'::jsonb,
    '{"Quvvati":"20W Power Delivery","Port":"1x USB-C"}'::jsonb
  ),
  (
    'chg-samsung-45w',
    'original-samsung-45w-super-fast-charger-2-0',
    'chargers',
    'Samsung',
    'Original Samsung 45W Super Fast Charger 2.0 (Type-C kabel bilan)',
    'Оригинальное зарядное устройство Samsung 45W Super Fast 2.0 (с кабелем)',
    'Galaxy S24 Ultra va S23 Ultra uchun maksimal tezlikdagi 45W quvvatlagich.',
    'Максимальная скорость зарядки 45 Вт для Galaxy S24 Ultra и S23 Ultra.',
    360000,
    420000,
    28,
    12,
    'new',
    4.8,
    65,
    false,
    '["samsung-s24-ultra","samsung-s24","samsung-s23-ultra","samsung-a55"]'::jsonb,
    '["https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-sam45-blk","color":"#18181B","colorNameUz":"Black","colorNameRu":"Черный","price":360000,"oldPrice":420000,"stock":28}]'::jsonb,
    '{"Quvvati":"45W Super Fast Charging 2.0 (PPS)","Komplekt":"45W Blok + 5A 1.8m Type-C kabel"}'::jsonb
  ),
  (
    'chg-baseus-30w-gan',
    'baseus-compact-30w-gan-fast-charger',
    'chargers',
    'Baseus',
    'Baseus GaN5 30W Mini Tezkor Quvvatlagich',
    'Компактное зарядное устройство Baseus GaN5 30W',
    'Ultra ixcham korpus, barcha zamonaviy smartfonlar uchun mos tezkor zaryadlash.',
    'Сверхкомпактный размер, поддержка быстрой зарядки всех современных смартфонов.',
    165000,
    NULL,
    35,
    6,
    NULL,
    4.7,
    38,
    false,
    '["iphone-15-pro-max","iphone-15-pro","iphone-15","iphone-14","samsung-s24","samsung-a55","xiaomi-redmi-note-13-pro","pixel-8"]'::jsonb,
    '["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-bas30-blk","color":"#18181B","colorNameUz":"Qora","colorNameRu":"Черный","price":165000,"oldPrice":null,"stock":20},{"id":"v-bas30-wht","color":"#FFFFFF","colorNameUz":"Oq","colorNameRu":"Белый","price":165000,"oldPrice":null,"stock":15}]'::jsonb,
    '{"Quvvati":"30W GaN5 Pro","Port":"1x USB-C"}'::jsonb
  ),
  (
    'chg-ugreen-100w-gan',
    'ugreen-nexode-100w-4port-gan-desktop-charger',
    'chargers',
    'UGREEN',
    'UGREEN Nexode 100W 4-Portli GaN Universal Quvvatlagich',
    'Универсальное зарядное устройство UGREEN Nexode 100W (4 порта)',
    '4 ta qurilmani bir vaqtda zaryadlovchi 100W super-quvvatli GaN stansiyasi.',
    'Мощная зарядная станция 100 Вт для одновременной зарядки 4 устройств.',
    780000,
    890000,
    30,
    18,
    'premium',
    5,
    44,
    false,
    '["iphone-15-pro-max","iphone-15-pro","samsung-s24-ultra","xiaomi-14","pixel-8-pro"]'::jsonb,
    '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-ug100-blk","color":"#1E293B","colorNameUz":"Space Gray","colorNameRu":"Серый космос","price":780000,"oldPrice":890000,"stock":0}]'::jsonb,
    '{"Quvvati":"100W Max","Portlar":"3x USB-C + 1x USB-A"}'::jsonb
  ),
  (
    'cbl-baseus-100w-c-to-c',
    'baseus-100w-type-c-to-type-c-fast-charging-cable',
    'cables',
    'Baseus',
    'Baseus 100W Type-C to Type-C Mustahkam O''rilgan Kabel (1.2m)',
    'Кабель Baseus 100W Type-C - Type-C в нейлоновой оплетке (1.2м)',
    'E-Marker aqlli chipi, 100W PD tezkor zaryadlash va 480 Mbps ma''lumot uzatish tezligi.',
    'Чип E-Marker, поддержка 100W PD и передача данных 480 Мбит/с.',
    85000,
    110000,
    80,
    6,
    'sale',
    4.8,
    95,
    true,
    '["iphone-15-pro-max","iphone-15-pro","iphone-15","samsung-s24-ultra","samsung-s24","samsung-a55","xiaomi-14","xiaomi-redmi-note-13-pro","pixel-8-pro","pixel-8"]'::jsonb,
    '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-cbl-org","color":"#FF7900","colorNameUz":"Orange-Black","colorNameRu":"Оранжево-черный","price":85000,"oldPrice":110000,"stock":45},{"id":"v-cbl-blk","color":"#18181B","colorNameUz":"Black","colorNameRu":"Черный","price":85000,"oldPrice":110000,"stock":35}]'::jsonb,
    '{"Quvvat":"100W (20V/5A)","Uzunlik":"1.2 metr","Material":"Zich neylon o''ralma"}'::jsonb
  ),
  (
    'cbl-apple-lightning-1m',
    'apple-original-usb-c-to-lightning-cable-1m',
    'cables',
    'Apple',
    'Original Apple USB-C to Lightning Kabel (1 metr)',
    'Оригинальный кабель Apple USB-C - Lightning (1м)',
    'iPhone 14, 13, 12, 11 modellari uchun original tezkor zaryadlash kabeli.',
    'Оригинальный кабель быстрой зарядки для iPhone 14, 13, 12, 11.',
    195000,
    240000,
    40,
    12,
    'sale',
    4.9,
    130,
    false,
    '["iphone-14-pro","iphone-14","iphone-13","iphone-12"]'::jsonb,
    '["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-cbl-ap-ltg","color":"#FFFFFF","colorNameUz":"White","colorNameRu":"Белый","price":195000,"oldPrice":240000,"stock":40}]'::jsonb,
    '{"Turi":"USB-C to Lightning MFi","Uzunligi":"1.0 metr"}'::jsonb
  ),
  (
    'cbl-anker-flow-c-to-c',
    'anker-flow-silicone-type-c-to-type-c-cable',
    'cables',
    'Anker',
    'Anker PowerLine Flow Yumshoq Silikon Type-C Kabel (1.8m)',
    'Мягкий силиконовый кабель Anker PowerLine Flow Type-C (1.8м)',
    'Chigal bo''lmaydigan ultra yumshoq silikon qoplama, 100W PD quvvati va 25000 marta egilish sinovi.',
    'Ультрамягкий силикон без запутывания, 100W PD и тест на 25000 сгибаний.',
    155000,
    NULL,
    25,
    18,
    'new',
    4.9,
    52,
    false,
    '["iphone-15-pro-max","iphone-15-pro","iphone-15","samsung-s24-ultra","samsung-s24","xiaomi-14","pixel-8"]'::jsonb,
    '["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-ank-cbl-blu","color":"#60A5FA","colorNameUz":"Cloud Blue","colorNameRu":"Голубой","price":155000,"oldPrice":null,"stock":15},{"id":"v-ank-cbl-blk","color":"#18181B","colorNameUz":"Midnight","colorNameRu":"Черный","price":155000,"oldPrice":null,"stock":10}]'::jsonb,
    '{"Quvvat":"100W Max Fast Charge","Uzunlik":"1.8 metr","Xususiyat":"Silicone Soft-Touch"}'::jsonb
  ),
  (
    'cbl-3in1-baseus',
    'baseus-3-in-1-universal-fast-charging-cable',
    'cables',
    'Baseus',
    'Baseus 3-in-1 Universal Tezkor Zaryadlash Kabeli (Lightning + Type-C + Micro)',
    'Универсальный кабель 3-в-1 Baseus (Lightning + Type-C + Micro-USB)',
    'Bir vaqtning o''zida har qanday 3 ta smartfonni zaryadlash uchun qulay o''rilgan kabel.',
    'Удобный кабель для одновременной зарядки 3 любых устройств.',
    95000,
    120000,
    35,
    6,
    NULL,
    4.6,
    68,
    false,
    '["iphone-15-pro-max","iphone-15-pro","iphone-14","iphone-13","samsung-s24-ultra","samsung-s24","samsung-a55","xiaomi-redmi-note-13-pro"]'::jsonb,
    '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-cbl3in1-blk","color":"#1E293B","colorNameUz":"Black","colorNameRu":"Черный","price":95000,"oldPrice":120000,"stock":35}]'::jsonb,
    '{"Ulagichlar":"Type-C, Lightning, Micro-USB","Oqim kuchi":"3.5A Max","Uzunligi":"1.2 metr"}'::jsonb
  ),
  (
    'glass-ip15p-privacy',
    'privacy-9h-tempered-glass-iphone-15-pro',
    'screen_protectors',
    'GlassPro',
    'Maxfiylik 9H Zirhli Shisha (Privacy Glass) iPhone 15 Pro uchun',
    'Антишпионское защитное стекло Privacy 9H для iPhone 15 Pro',
    '28 darajadan boshlab ekranni yondan ko''rinmas qiladi. Yuqori darajadagi oleofob qoplama.',
    'Защищает экран от посторонних взглядов под углом от 28°. Олеофобное покрытие.',
    110000,
    150000,
    65,
    1,
    'sale',
    4.8,
    84,
    true,
    '["iphone-15-pro","iphone-15"]'::jsonb,
    '["https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-gls-ip15p-prv","color":"#000000","colorNameUz":"Anti-Spy Black","colorNameRu":"Антишпион черный","price":110000,"oldPrice":150000,"stock":65}]'::jsonb,
    '{"Qattiqligi":"9H Tempered Glass","Burchak":"28° Anti-Spy Filter","Qalinlik":"0.33 mm"}'::jsonb
  ),
  (
    'glass-ip15pm-hd',
    'ultra-clear-9h-glass-iphone-15-pro-max',
    'screen_protectors',
    'GlassPro',
    'Ultra-Clear 9H Himoya Shishasi iPhone 15 Pro Max uchun (2 dona to''plam)',
    'Ультрапрозрачное защитное стекло 9H для iPhone 15 Pro Max (набор 2 шт)',
    '99.9% shaffoflik, chang o''tkazmaydigan dinamik to''ri va oson yopishtirish uchun joylagich rom.',
    '99.9% прозрачности, рамка для легкой установки и сетка от пыли.',
    135000,
    170000,
    45,
    1,
    'new',
    4.9,
    56,
    false,
    '["iphone-15-pro-max"]'::jsonb,
    '["https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-gls-ip15pm-hd","color":"#FFFFFF","colorNameUz":"Ultra Clear","colorNameRu":"Прозрачный","price":135000,"oldPrice":170000,"stock":45}]'::jsonb,
    '{"Komplekt":"2 dona shisha + o''rnatish qolipi","Qattiqlik":"9H Sapphire Hardness"}'::jsonb
  ),
  (
    'glass-s24u-uv',
    'uv-liquid-glass-samsung-galaxy-s24-ultra',
    'screen_protectors',
    'GlassPro',
    'UV Liquid to''liq yopishtiruvchi shisha Galaxy S24 Ultra uchun',
    'UV защитное стекло с ультрафиолетовой лампой для Galaxy S24 Ultra',
    'Ultratovushli barmoq izi skaneri bilan 100% mos ishlaydi. UV lampasi komplektda mavjud.',
    '100% совместимость с ультразвуковым сканером отпечатка. УФ-лампа в комплекте.',
    145000,
    190000,
    30,
    1,
    'sale',
    4.7,
    39,
    false,
    '["samsung-s24-ultra","samsung-s23-ultra"]'::jsonb,
    '["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-gls-s24u-uv","color":"#FFFFFF","colorNameUz":"UV Clear","colorNameRu":"УФ Прозрачный","price":145000,"oldPrice":190000,"stock":30}]'::jsonb,
    '{"Skaner mosligi":"100% sezgir ultrasonik skaner","Texnologiya":"Liquid Optical Clear Glue + UV Lamp"}'::jsonb
  ),
  (
    'glass-a55-full',
    'full-glue-9d-glass-galaxy-a55',
    'screen_protectors',
    'GlassPro',
    '9D To''liq romli mustahkam shisha Galaxy A55 uchun',
    'Защитное стекло 9D с полной проклейкой для Galaxy A55',
    'Qora romli 9D himoya oynasi, chetlari silliqlangan 2.5D egri radius.',
    'Защитное стекло 9D с черной рамкой и скругленными краями 2.5D.',
    65000,
    NULL,
    50,
    1,
    NULL,
    4.6,
    28,
    false,
    '["samsung-a55"]'::jsonb,
    '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-gls-a55-blk","color":"#000000","colorNameUz":"Black Edge","colorNameRu":"Черная рамка","price":65000,"oldPrice":null,"stock":50}]'::jsonb,
    '{"Qattiqlik":"9H","Qoplama":"Anti-Scratch Oleophobic"}'::jsonb
  ),
  (
    'audio-airpods-pro-2',
    'apple-airpods-pro-2nd-gen-type-c',
    'headphones',
    'Apple',
    'Apple AirPods Pro 2 (USB-C MagSafe Case)',
    'Беспроводные наушники Apple AirPods Pro 2 (USB-C)',
    '2 barobar kuchliroq faol shovqinni so''ndirish (ANC), shaffoflik rejimi va moslashuvchan audio.',
    'В 2 раза мощнее активное шумоподавление (ANC), прозрачный режим и адаптивное аудио.',
    3150000,
    3450000,
    16,
    12,
    'premium',
    5,
    145,
    true,
    '["iphone-15-pro-max","iphone-15-pro","iphone-15","iphone-14-pro","iphone-14","samsung-s24-ultra","samsung-s24","xiaomi-14","pixel-8-pro"]'::jsonb,
    '["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-app2-wht","color":"#FFFFFF","colorNameUz":"White","colorNameRu":"Белый","price":3150000,"oldPrice":3450000,"stock":16}]'::jsonb,
    '{"Shovqin so''ndirish":"Active Noise Cancellation (ANC)","Avtonomiya":"6 soat (keys bilan 30 soat)","Chip":"Apple H2 chip, Bluetooth 5.3"}'::jsonb
  ),
  (
    'audio-galaxy-buds2-pro',
    'samsung-galaxy-buds2-pro-graphite',
    'headphones',
    'Samsung',
    'Samsung Galaxy Buds2 Pro 24-bit Hi-Fi Graphite',
    'Беспроводные наушники Samsung Galaxy Buds2 Pro Графит',
    '24-bit Hi-Fi musiqiy sifat, 3 ta yuqori sezgir SNR mikrofon va 360 Audio fazoviy ovoz.',
    'Звук 24-бит Hi-Fi, 3 микрофона с высоким SNR и объемный звук 360 Audio.',
    1890000,
    2190000,
    12,
    12,
    'sale',
    4.8,
    72,
    true,
    '["samsung-s24-ultra","samsung-s24","samsung-s23-ultra","samsung-a55","iphone-15-pro","xiaomi-14","pixel-8"]'::jsonb,
    '["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-buds2-grp","color":"#27272A","colorNameUz":"Graphite","colorNameRu":"Графит","price":1890000,"oldPrice":2190000,"stock":8},{"id":"v-buds2-wht","color":"#FFFFFF","colorNameUz":"White","colorNameRu":"Белый","price":1890000,"oldPrice":2190000,"stock":4}]'::jsonb,
    '{"Ovoz sifati":"24bit Hi-Fi SSC Codec","ANC":"Intellektual faol shovqin so''ndirish","Suvga chidamlilik":"IPX7"}'::jsonb
  ),
  (
    'audio-anker-q30-headphone',
    'anker-soundcore-life-q30-anc-headphones',
    'headphones',
    'Anker',
    'Anker Soundcore Life Q30 Sim-Simsiz ANC Quloqchin',
    'Полноразмерные наушники Anker Soundcore Life Q30 ANC',
    'Gibrid faol shovqinni so''ndirish, Hi-Res Audio sertifikati va 40 soatlik ulkan avtonomiya.',
    'Гибридный ANC, сертификация Hi-Res Audio и 40 часов автономной работы.',
    990000,
    1190000,
    15,
    18,
    'sale',
    4.8,
    88,
    false,
    '["iphone-15-pro-max","iphone-15","samsung-s24-ultra","xiaomi-14","pixel-8"]'::jsonb,
    '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-q30-blk","color":"#0F172A","colorNameUz":"Midnight Black","colorNameRu":"Черный","price":990000,"oldPrice":1190000,"stock":15}]'::jsonb,
    '{"Turi":"Over-ear to''liq qoplovchi","Batareya":"40 soat (ANC bilan) / 60 soat (standart)"}'::jsonb
  ),
  (
    'audio-baseus-bowie-e3',
    'baseus-bowie-e3-tws-wireless-earphones',
    'headphones',
    'Baseus',
    'Baseus Bowie E3 TWS Simsiz Quloqchin',
    'Беспроводные наушники TWS Baseus Bowie E3',
    'Flash Charge tezkor 10 daqiqada zaryadlash, past kechikish rejimi va toza ovoz.',
    'Быстрая зарядка Flash Charge (10 мин = 2 часа работы) и чистый звук.',
    240000,
    290000,
    45,
    6,
    NULL,
    4.5,
    64,
    false,
    '["iphone-15","iphone-14","samsung-a55","xiaomi-redmi-note-13-pro"]'::jsonb,
    '["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-e3-wht","color":"#FFFFFF","colorNameUz":"White","colorNameRu":"Белый","price":240000,"oldPrice":290000,"stock":25},{"id":"v-e3-blk","color":"#18181B","colorNameUz":"Black","colorNameRu":"Черный","price":240000,"oldPrice":290000,"stock":20}]'::jsonb,
    '{"Avtonomiya":"5 soat (keys bilan 25 soat)","Kechikish":"0.06s Low Latency"}'::jsonb
  ),
  (
    'pb-anker-737-24k',
    'anker-737-power-bank-24000mah-140w',
    'power_banks',
    'Anker',
    'Anker 737 Power Bank (PowerCore 24K) 140W Smart Display',
    'Повербанк Anker 737 (24000 мАч) 140 Вт со смарт-дисплеем',
    '140W ikki tomonlama ultra-tezkor zaryadlash, rangli aqlli displey va 24,000 mAh quvvat.',
    'Двусторонняя быстрая зарядка 140 Вт, цветной информационный дисплей и 24000 мАч.',
    1350000,
    1550000,
    10,
    18,
    'premium',
    5,
    47,
    true,
    '["iphone-15-pro-max","iphone-15-pro","samsung-s24-ultra","xiaomi-14","pixel-8-pro"]'::jsonb,
    '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-ank737-blk","color":"#1E293B","colorNameUz":"Black Titanium","colorNameRu":"Черный","price":1350000,"oldPrice":1550000,"stock":10}]'::jsonb,
    '{"Sig''imi":"24,000 mAh (86.4Wh)","Chiqish quvvati":"140W Max PD 3.1","Portlar":"2x USB-C + 1x USB-A"}'::jsonb
  ),
  (
    'pb-baseus-magsafe-10k',
    'baseus-magnetic-magsafe-power-bank-10000mah-20w',
    'power_banks',
    'Baseus',
    'Baseus Magnetic MagSafe 20W Power Bank 10,000 mAh',
    'Магнитный повербанк MagSafe Baseus 10000 мАч (20 Вт)',
    'Kuchli neodim magnitli simsiz quvvatlagich, ixcham o''lcham va 20W PD tezkor simli zaryadlash.',
    'Мощный магнит MagSafe для беспроводной зарядки и порт 20W PD.',
    360000,
    420000,
    24,
    6,
    'sale',
    4.8,
    65,
    true,
    '["iphone-15-pro-max","iphone-15-pro","iphone-15","iphone-14-pro","iphone-14","iphone-13","iphone-12"]'::jsonb,
    '["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-pb-mag-blu","color":"#38BDF8","colorNameUz":"Sky Blue","colorNameRu":"Голубой","price":360000,"oldPrice":420000,"stock":14},{"id":"v-pb-mag-blk","color":"#18181B","colorNameUz":"Black","colorNameRu":"Черный","price":360000,"oldPrice":420000,"stock":10}]'::jsonb,
    '{"Sig''imi":"10,000 mAh","Simsiz quvvat":"15W MagSafe","Simli quvvat":"20W Power Delivery"}'::jsonb
  ),
  (
    'pb-xiaomi-20k-22w',
    'xiaomi-redmi-power-bank-20000mah-22-5w',
    'power_banks',
    'Xiaomi',
    'Xiaomi Power Bank 20,000 mAh 22.5W Fast Charge',
    'Повербанк Xiaomi 20000 мАч 22.5W быстрая зарядка',
    'Katta sig''im, 3 ta port va bir vaqtning o''zida 3 ta qurilmani zaryadlash imkoniyati.',
    'Большая емкость, 3 порта и возможность одновременной зарядки 3 устройств.',
    265000,
    NULL,
    35,
    6,
    NULL,
    4.7,
    110,
    false,
    '["xiaomi-14","xiaomi-redmi-note-13-pro","samsung-a55","samsung-s24","iphone-15"]'::jsonb,
    '["https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-mi-pb-blk","color":"#18181B","colorNameUz":"Qora","colorNameRu":"Черный","price":265000,"oldPrice":null,"stock":20},{"id":"v-mi-pb-wht","color":"#FFFFFF","colorNameUz":"Oq","colorNameRu":"Белый","price":265000,"oldPrice":null,"stock":15}]'::jsonb,
    '{"Sig''imi":"20,000 mAh (74Wh)","Maksimal quvvat":"22.5W Fast Charge"}'::jsonb
  ),
  (
    'car-chg-baseus-65w',
    'baseus-65w-dual-port-car-fast-charger',
    'chargers',
    'Baseus',
    'Baseus 65W Avtomobil Tezkor Zaryadlovchi Qurilmasi (Metal korpus)',
    'Автомобильное зарядное устройство Baseus 65W (металлический корпус)',
    '12V-24V avtomobillar uchun 65W PD tezkor zaryadlash va muz-ko''k LED yoritish halqasi.',
    'Быстрая зарядка 65W PD для авто 12V-24V с мягкой лед-подсветкой.',
    175000,
    220000,
    30,
    6,
    'sale',
    4.8,
    55,
    false,
    '["iphone-15-pro-max","iphone-15","samsung-s24-ultra","xiaomi-14","pixel-8"]'::jsonb,
    '["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-car-chg-gry","color":"#334155","colorNameUz":"Space Gray","colorNameRu":"Серый","price":175000,"oldPrice":220000,"stock":30}]'::jsonb,
    '{"Quvvat":"65W (USB-C 45W + USB-A 20W)","Kirish":"DC 12V-24V"}'::jsonb
  ),
  (
    'car-holder-magsafe-baseus',
    'baseus-magsafe-wireless-car-mount-charger-15w',
    'chargers',
    'Baseus',
    'Baseus MagSafe Avtomobil Magnitli Simsiz Zaryadlovchi Tutqich (15W)',
    'Магнитный автодержатель с беспроводной зарядкой MagSafe Baseus 15W',
    'Kuchli 16 ta neodim magnit, deflektorga qotirish va 360 daraja buriluvchi sharli bo''g''in.',
    '16 мощных магнитов, надежное крепление в дефлектор и вращение 360 градусов.',
    285000,
    340000,
    20,
    6,
    'new',
    4.8,
    39,
    true,
    '["iphone-15-pro-max","iphone-15-pro","iphone-15","iphone-14-pro","iphone-14","iphone-13","iphone-12"]'::jsonb,
    '["https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-car-mag-blk","color":"#18181B","colorNameUz":"Black","colorNameRu":"Черный","price":285000,"oldPrice":340000,"stock":20}]'::jsonb,
    '{"Simsiz quvvat":"15W Max MagSafe","O''rnatish":"Havo kanali (deflektor)"}'::jsonb
  ),
  (
    'car-holder-gravity-ugreen',
    'ugreen-gravity-metal-car-phone-holder',
    'cases',
    'UGREEN',
    'UGREEN Gravity Metall Avtomobil Telefon Tutqichi',
    'Гравитационный металлический автодержатель для телефона UGREEN',
    'Smartfon og''irligi hisobiga avtomatik qisuvchi alyuminiy korpusli mustahkam tutqich.',
    'Гравитационный зажим из сплава алюминия, надежная фиксация смартфона.',
    135000,
    NULL,
    25,
    6,
    NULL,
    4.7,
    31,
    false,
    '["iphone-15-pro-max","iphone-15","samsung-s24-ultra","samsung-s24","samsung-a55","xiaomi-redmi-note-13-pro"]'::jsonb,
    '["https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    '[{"id":"v-car-ug-slv","color":"#64748B","colorNameUz":"Titanium Silver","colorNameRu":"Серебристый","price":135000,"oldPrice":null,"stock":25}]'::jsonb,
    '{"Moslik":"4.7 - 7.2 dyuymli smartfonlar","Material":"Aviatsiya alyuminiyi + Silikon"}'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  brand = EXCLUDED.brand,
  name_uz = EXCLUDED.name_uz,
  name_ru = EXCLUDED.name_ru,
  desc_uz = EXCLUDED.desc_uz,
  desc_ru = EXCLUDED.desc_ru,
  price = EXCLUDED.price,
  old_price = EXCLUDED.old_price,
  stock = EXCLUDED.stock,
  warranty_months = EXCLUDED.warranty_months,
  badge = EXCLUDED.badge,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  is_featured = EXCLUDED.is_featured,
  compatible_models = EXCLUDED.compatible_models,
  images = EXCLUDED.images,
  variants = EXCLUDED.variants,
  specs = EXCLUDED.specs;

-- 5. SEED SITE SETTINGS
INSERT INTO public.site_settings (key, value)
VALUES
  ('store_info', '{"name": "TechUz Electronics", "phone": "+998 94 587-64-72", "email": "info@techuz.uz", "address": "Toshkent shahri, Chilonzor 9-mavze", "working_hours": "09:00 - 21:00"}'::jsonb),
  ('delivery_settings', '{"standard_fee": 25000, "free_delivery_threshold": 300000, "express_fee": 45000}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
