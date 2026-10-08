/**
 * TechUz Comprehensive Mock Products Catalog
 * 
 * Includes:
 * - 8 Flagship & Mid-range Smartphones (Apple, Samsung, Xiaomi, Google Pixel)
 * - 24+ Accessories (Cases, GaN Chargers, USB-C & Lightning Cables, 9H Screen Protectors, TWS Earbuds, Power Banks, Car Chargers, Magnetic Car Phone Holders)
 * - Pricing strictly stored as integer UZS (e.g. 15890000 for 15,890,000 so'm)
 * - Full bilingual metadata (nameUz, nameRu, descUz, descRu)
 * - Phone model compatibility tags matching mockPhoneModels.js IDs
 * - High resolution product photography
 */

export const mockProducts = [
  // ==========================================
  // SMARTPHONES (8 Devices)
  // ==========================================
  {
    id: 'phone-apple-ip15pm',
    slug: 'apple-iphone-15-pro-max-256gb',
    category: 'smartphones',
    brand: 'Apple',
    nameUz: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    nameRu: 'Apple iPhone 15 Pro Max 256GB Натуральный титан',
    descUz: 'A17 Pro 3nm chipi, 48MP asosiy kamera, 5x optik zoom va yengil titan korpus.',
    descRu: 'Процессор A17 Pro 3нм, основная камера 48 МП, 5-кратный оптический зум и титановый корпус.',
    price: 15890000,
    oldPrice: 16900000,
    stock: 14,
    warrantyMonths: 12,
    badge: 'premium',
    rating: 4.9,
    reviewsCount: 54,
    isFeatured: true,
    compatibleModels: ['iphone-15-pro-max'],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-ip15pm-nat', color: '#8E857B', colorNameUz: 'Natural Titanium', colorNameRu: 'Натуральный титан', storage: '256GB', price: 15890000, oldPrice: 16900000, stock: 8 },
      { id: 'v-ip15pm-blk', color: '#27262A', colorNameUz: 'Black Titanium', colorNameRu: 'Черный титан', storage: '256GB', price: 15890000, oldPrice: 16900000, stock: 6 },
      { id: 'v-ip15pm-blu', color: '#2F3843', colorNameUz: 'Blue Titanium', colorNameRu: 'Синий титан', storage: '512GB', price: 17950000, oldPrice: 18900000, stock: 0 }
    ],
    specs: {
      'Ekran': '6.7" Super Retina XDR OLED 120Hz',
      'Protsessor': 'Apple A17 Pro (3 nm)',
      'Xotira': '256GB / 8GB RAM',
      'Kamera': '48 MP + 12 MP (5x) + 12 MP',
      'Batareya': '4441 mAh, Type-C 3.0'
    }
  },
  {
    id: 'phone-apple-ip15p',
    slug: 'apple-iphone-15-pro-128gb',
    category: 'smartphones',
    brand: 'Apple',
    nameUz: 'Apple iPhone 15 Pro 128GB Black Titanium',
    nameRu: 'Apple iPhone 15 Pro 128GB Черный титан',
    descUz: 'Yengil titan ramka, Action Button tugmasi va dinamik orol funksiyasi.',
    descRu: 'Легкая титановая рамка, кнопка Action Button и Dynamic Island.',
    price: 13650000,
    oldPrice: 14400000,
    stock: 9,
    warrantyMonths: 12,
    badge: 'new',
    rating: 4.8,
    reviewsCount: 37,
    isFeatured: true,
    compatibleModels: ['iphone-15-pro'],
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-ip15p-blk', color: '#18181B', colorNameUz: 'Black Titanium', colorNameRu: 'Черный титан', storage: '128GB', price: 13650000, oldPrice: 14400000, stock: 5 },
      { id: 'v-ip15p-wht', color: '#E3E4E5', colorNameUz: 'White Titanium', colorNameRu: 'Белый титан', storage: '128GB', price: 13650000, oldPrice: 14400000, stock: 4 }
    ],
    specs: {
      'Ekran': '6.1" OLED 120Hz ProMotion',
      'Protsessor': 'Apple A17 Pro',
      'Xotira': '128GB / 8GB RAM',
      'Kamera': '48 MP + 12 MP + 12 MP (3x)',
      'Batareya': '3274 mAh'
    }
  },
  {
    id: 'phone-apple-ip15',
    slug: 'apple-iphone-15-128gb',
    category: 'smartphones',
    brand: 'Apple',
    nameUz: 'Apple iPhone 15 128GB Pink / Pushti',
    nameRu: 'Apple iPhone 15 128GB Розовый',
    descUz: 'Rangli mot shisha orqa panel, Dynamic Island va 48MP asosiy kamera.',
    descRu: 'Матовое стекло задней панели, Dynamic Island и камера 48 МП.',
    price: 10450000,
    oldPrice: null,
    stock: 18,
    warrantyMonths: 12,
    badge: null,
    rating: 4.8,
    reviewsCount: 42,
    isFeatured: false,
    compatibleModels: ['iphone-15'],
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-ip15-pnk', color: '#FBCFE8', colorNameUz: 'Pushti', colorNameRu: 'Розовый', storage: '128GB', price: 10450000, oldPrice: null, stock: 10 },
      { id: 'v-ip15-blk', color: '#18181B', colorNameUz: 'Qora', colorNameRu: 'Черный', storage: '128GB', price: 10450000, oldPrice: null, stock: 8 }
    ],
    specs: {
      'Ekran': '6.1" Super Retina XDR OLED',
      'Protsessor': 'Apple A16 Bionic',
      'Xotira': '128GB / 6GB RAM',
      'Kamera': '48 MP + 12 MP UltraWide',
      'Batareya': '3349 mAh'
    }
  },
  {
    id: 'phone-samsung-s24u',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    category: 'smartphones',
    brand: 'Samsung',
    nameUz: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray (AI)',
    nameRu: 'Samsung Galaxy S24 Ultra 512GB Серый титан (AI)',
    descUz: 'Galaxy AI sun\'iy intellekt, 200MP kamera, o\'rnatilgan S-Pen va 2600 nit yorqin ekran.',
    descRu: 'Искусственный интеллект Galaxy AI, камера 200 МП, встроенный S-Pen и экран 2600 нит.',
    price: 16200000,
    oldPrice: 17800000,
    stock: 11,
    warrantyMonths: 12,
    badge: 'sale',
    rating: 4.9,
    reviewsCount: 61,
    isFeatured: true,
    compatibleModels: ['samsung-s24-ultra'],
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-s24u-gry', color: '#475569', colorNameUz: 'Titanium Gray', colorNameRu: 'Серый титан', storage: '512GB', price: 16200000, oldPrice: 17800000, stock: 6 },
      { id: 'v-s24u-blk', color: '#1E293B', colorNameUz: 'Titanium Black', colorNameRu: 'Черный титан', storage: '512GB', price: 16200000, oldPrice: 17800000, stock: 5 }
    ],
    specs: {
      'Ekran': '6.8" Dynamic LTPO AMOLED 2X 120Hz',
      'Protsessor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Xotira': '512GB / 12GB RAM',
      'Kamera': '200 MP + 50 MP (5x) + 10 MP (3x) + 12 MP',
      'Batareya': '5000 mAh, 45W'
    }
  },
  {
    id: 'phone-samsung-s24',
    slug: 'samsung-galaxy-s24-256gb',
    category: 'smartphones',
    brand: 'Samsung',
    nameUz: 'Samsung Galaxy S24 8/256GB Onyx Black',
    nameRu: 'Samsung Galaxy S24 8/256GB Черный оникс',
    descUz: 'Kompakt flagman, yupqa simmetrik ramkalar va Galaxy AI tarjimon funksiyalari.',
    descRu: 'Компактный флагман, симметричные тонкие рамки и функции Galaxy AI.',
    price: 9890000,
    oldPrice: 10500000,
    stock: 15,
    warrantyMonths: 12,
    badge: 'new',
    rating: 4.7,
    reviewsCount: 29,
    isFeatured: false,
    compatibleModels: ['samsung-s24'],
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-s24-blk', color: '#0F172A', colorNameUz: 'Onyx Black', colorNameRu: 'Черный оникс', storage: '256GB', price: 9890000, oldPrice: 10500000, stock: 10 },
      { id: 'v-s24-ylw', color: '#FEF08A', colorNameUz: 'Amber Yellow', colorNameRu: 'Желтый янтарь', storage: '256GB', price: 9890000, oldPrice: 10500000, stock: 5 }
    ],
    specs: {
      'Ekran': '6.2" Dynamic AMOLED 2X 120Hz',
      'Protsessor': 'Exynos 2400',
      'Xotira': '256GB / 8GB RAM',
      'Kamera': '50 MP + 10 MP (3x) + 12 MP',
      'Batareya': '4000 mAh'
    }
  },
  {
    id: 'phone-samsung-a55',
    slug: 'samsung-galaxy-a55-5g-128gb',
    category: 'smartphones',
    brand: 'Samsung',
    nameUz: 'Samsung Galaxy A55 5G 8/128GB Awesome Iceblue',
    nameRu: 'Samsung Galaxy A55 5G 8/128GB Ледяной синий',
    descUz: 'Metall rom, shisha korpus, 50MP tungi fotosuratlar kamerasi va IP67 himoyasi.',
    descRu: 'Металлическая рамка, стеклянный корпус, камера 50 МП и защита IP67.',
    price: 4690000,
    oldPrice: 4990000,
    stock: 22,
    warrantyMonths: 12,
    badge: 'sale',
    rating: 4.6,
    reviewsCount: 45,
    isFeatured: true,
    compatibleModels: ['samsung-a55'],
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-a55-blu', color: '#BAE6FD', colorNameUz: 'Ice Blue', colorNameRu: 'Ледяной синий', storage: '128GB', price: 4690000, oldPrice: 4990000, stock: 14 },
      { id: 'v-a55-nvy', color: '#1E293B', colorNameUz: 'Navy', colorNameRu: 'Темно-синий', storage: '128GB', price: 4690000, oldPrice: 4990000, stock: 8 }
    ],
    specs: {
      'Ekran': '6.6" Super AMOLED 120Hz 1000 nits',
      'Protsessor': 'Exynos 1480 (4 nm)',
      'Xotira': '128GB / 8GB RAM',
      'Kamera': '50 MP OIS + 12 MP + 5 MP',
      'Batareya': '5000 mAh, 25W'
    }
  },
  {
    id: 'phone-xiaomi-14',
    slug: 'xiaomi-14-12-512gb-leica',
    category: 'smartphones',
    brand: 'Xiaomi',
    nameUz: 'Xiaomi 14 12/512GB Leica Optics Black',
    nameRu: 'Xiaomi 14 12/512GB Оптика Leica Черный',
    descUz: 'Leica Summilux professional linzalari, Snapdragon 8 Gen 3 va 90W HyperCharge zaryadlash.',
    descRu: 'Профессиональная оптика Leica Summilux, чип Snapdragon 8 Gen 3 и зарядка 90 Вт.',
    price: 10200000,
    oldPrice: null,
    stock: 7,
    warrantyMonths: 12,
    badge: 'premium',
    rating: 4.8,
    reviewsCount: 19,
    isFeatured: true,
    compatibleModels: ['xiaomi-14'],
    images: [
      'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-mi14-blk', color: '#18181B', colorNameUz: 'Black', colorNameRu: 'Черный', storage: '512GB', price: 10200000, oldPrice: null, stock: 4 },
      { id: 'v-mi14-grn', color: '#166534', colorNameUz: 'Jade Green', colorNameRu: 'Нефритовый зеленый', storage: '512GB', price: 10200000, oldPrice: null, stock: 3 }
    ],
    specs: {
      'Ekran': '6.36" LTPO OLED 120Hz 3000 nits',
      'Protsessor': 'Snapdragon 8 Gen 3',
      'Xotira': '512GB / 12GB RAM',
      'Kamera': '50 MP Leica + 50 MP (3.2x) + 50 MP',
      'Batareya': '4610 mAh, 90W simli / 50W simsiz'
    }
  },
  {
    id: 'phone-xiaomi-rn13pro',
    slug: 'xiaomi-redmi-note-13-pro-256gb',
    category: 'smartphones',
    brand: 'Xiaomi',
    nameUz: 'Xiaomi Redmi Note 13 Pro 8/256GB Midnight Black',
    nameRu: 'Xiaomi Redmi Note 13 Pro 8/256GB Черный',
    descUz: '200MP OIS ultra-tiniq kamera, 120Hz AMOLED ekran va 67W tezkor zaryadlash.',
    descRu: 'Камера 200 МП с OIS, AMOLED 120 Гц и турбо-зарядка 67 Вт.',
    price: 3350000,
    oldPrice: 3650000,
    stock: 30,
    warrantyMonths: 12,
    badge: 'sale',
    rating: 4.7,
    reviewsCount: 88,
    isFeatured: true,
    compatibleModels: ['xiaomi-redmi-note-13-pro'],
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-rn13p-blk', color: '#1E1E24', colorNameUz: 'Midnight Black', colorNameRu: 'Черный', storage: '256GB', price: 3350000, oldPrice: 3650000, stock: 18 },
      { id: 'v-rn13p-blu', color: '#38BDF8', colorNameUz: 'Ocean Teal', colorNameRu: 'Морской синий', storage: '256GB', price: 3350000, oldPrice: 3650000, stock: 12 }
    ],
    specs: {
      'Ekran': '6.67" AMOLED 120Hz 1800 nits',
      'Protsessor': 'MediaTek Helio G99-Ultra',
      'Xotira': '256GB / 8GB RAM',
      'Kamera': '200 MP OIS + 8 MP + 2 MP',
      'Batareya': '5000 mAh, 67W'
    }
  },

  // ==========================================
  // CASES (6 Items)
  // ==========================================
  {
    id: 'case-magsafe-ip15p',
    slug: 'magsafe-silicone-case-iphone-15-pro',
    category: 'cases',
    brand: 'TechUz Original',
    nameUz: 'MagSafe Silicone Case iPhone 15 Pro uchun (Mikrofibra)',
    nameRu: 'Силиконовый чехол MagSafe для iPhone 15 Pro с микрофиброй',
    descUz: 'Kuchli neodim magnitli MagSafe halqasi, yumshoq soft-touch qoplama va ichki baxmal mikrofibra.',
    descRu: 'Мощное кольцо MagSafe, soft-touch покрытие и внутренняя подкладка из микрофибры.',
    price: 185000,
    oldPrice: 240000,
    stock: 45,
    warrantyMonths: 3,
    badge: 'sale',
    rating: 4.9,
    reviewsCount: 112,
    isFeatured: true,
    compatibleModels: ['iphone-15-pro'],
    images: [
      'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-case-ip15p-org', color: '#FF7A00', colorNameUz: 'Orange Tech', colorNameRu: 'Оранжевый Tech', price: 185000, oldPrice: 240000, stock: 20 },
      { id: 'v-case-ip15p-blk', color: '#18181B', colorNameUz: 'Midnight Black', colorNameRu: 'Черный полночь', price: 185000, oldPrice: 240000, stock: 15 },
      { id: 'v-case-ip15p-blu', color: '#1E3A8A', colorNameUz: 'Deep Blue', colorNameRu: 'Глубокий синий', price: 185000, oldPrice: 240000, stock: 10 }
    ],
    specs: {
      'Material': 'Premium Silikon + Mikrofibra',
      'MagSafe': 'Ha, o\'rnatilgan kuchli neodim magnit',
      'Kamera himoyasi': '1.5mm ko\'tarilgan burchak romi'
    }
  },
  {
    id: 'case-magsafe-ip15pm',
    slug: 'magsafe-silicone-case-iphone-15-pro-max',
    category: 'cases',
    brand: 'TechUz Original',
    nameUz: 'MagSafe Silicone Case iPhone 15 Pro Max uchun',
    nameRu: 'Силиконовый чехол MagSafe для iPhone 15 Pro Max',
    descUz: 'Kuchli MagSafe magniti, kamera linzalarini to\'liq himoyalovchi mustahkam rom.',
    descRu: 'Мощный магнит MagSafe, защита блока камер и soft-touch покрытие.',
    price: 195000,
    oldPrice: 250000,
    stock: 35,
    warrantyMonths: 3,
    badge: 'new',
    rating: 4.8,
    reviewsCount: 78,
    isFeatured: true,
    compatibleModels: ['iphone-15-pro-max'],
    images: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-case-ip15pm-org', color: '#FF7A00', colorNameUz: 'Orange Tech', colorNameRu: 'Оранжевый', price: 195000, oldPrice: 250000, stock: 15 },
      { id: 'v-case-ip15pm-blk', color: '#18181B', colorNameUz: 'Black', colorNameRu: 'Черный', price: 195000, oldPrice: 250000, stock: 20 }
    ],
    specs: {
      'Material': 'Silikon + Neodim magnitlar',
      'Qalinlik': '1.8 mm'
    }
  },
  {
    id: 'case-s24u-armor',
    slug: 'shockproof-armor-case-galaxy-s24-ultra',
    category: 'cases',
    brand: 'ArmorShield',
    nameUz: 'Zarbalarga chidamli Armor Case Samsung Galaxy S24 Ultra uchun',
    nameRu: 'Ударопрочный чехол Armor для Samsung Galaxy S24 Ultra',
    descUz: 'Harbiy darajadagi MIL-STD-810G himoyasi, burchaklardagi havo yostiqchalari va yig\'iluvchi metall stend.',
    descRu: 'Военный стандарт защиты MIL-STD-810G, усиленные углы и встроенная подставка.',
    price: 210000,
    oldPrice: 270000,
    stock: 18,
    warrantyMonths: 6,
    badge: 'sale',
    rating: 4.7,
    reviewsCount: 41,
    isFeatured: false,
    compatibleModels: ['samsung-s24-ultra'],
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-s24u-arm-blk', color: '#1E293B', colorNameUz: 'Matte Black', colorNameRu: 'Матовый черный', price: 210000, oldPrice: 270000, stock: 10 },
      { id: 'v-s24u-arm-red', color: '#991B1B', colorNameUz: 'Crimson Red', colorNameRu: 'Темно-красный', price: 210000, oldPrice: 270000, stock: 8 }
    ],
    specs: {
      'Himoya': 'MIL-STD-810G 3 metrli tushish testi',
      'Material': 'Polikarbonat + TPU',
      'Qo\'shimcha': 'Metall stend-tutqich'
    }
  },
  {
    id: 'case-s24-clear',
    slug: 'clear-hybrid-case-galaxy-s24',
    category: 'cases',
    brand: 'CrystalClear',
    nameUz: 'Shaffof gibrid g\'ilof Samsung Galaxy S24 uchun',
    nameRu: 'Прозрачный гибридный чехол для Samsung Galaxy S24',
    descUz: 'Sarg\'ayishga qarshi maxsus UV polimer, yupqa va mutlaqo shaffof korpus.',
    descRu: 'Антижелтеющий полимер, ультратонкий и кристально прозрачный.',
    price: 120000,
    oldPrice: 150000,
    stock: 25,
    warrantyMonths: 1,
    badge: null,
    rating: 4.6,
    reviewsCount: 22,
    isFeatured: false,
    compatibleModels: ['samsung-s24'],
    images: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-s24-clr', color: '#FFFFFF', colorNameUz: 'Shaffof / Transparent', colorNameRu: 'Прозрачный', price: 120000, oldPrice: 150000, stock: 25 }
    ],
    specs: {
      'Material': 'Anti-UV Polikarbonat',
      'Qalinligi': '1.2 mm'
    }
  },
  {
    id: 'case-a55-matte',
    slug: 'matte-silicone-case-galaxy-a55',
    category: 'cases',
    brand: 'TechUz Original',
    nameUz: 'Mot silikon g\'ilof Samsung Galaxy A55 5G uchun',
    nameRu: 'Матовый силиконовый чехол для Samsung Galaxy A55 5G',
    descUz: 'Barmoq izlari qoldirmaydigan mot yuzaga ega qulay silikon chexol.',
    descRu: 'Матовое покрытие без отпечатков пальцев, идеальная посадка.',
    price: 95000,
    oldPrice: null,
    stock: 40,
    warrantyMonths: 1,
    badge: null,
    rating: 4.7,
    reviewsCount: 33,
    isFeatured: false,
    compatibleModels: ['samsung-a55'],
    images: [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-a55-blk', color: '#18181B', colorNameUz: 'Qora', colorNameRu: 'Черный', price: 95000, oldPrice: null, stock: 20 },
      { id: 'v-a55-grn', color: '#065F46', colorNameUz: 'Zaytun', colorNameRu: 'Оливковый', price: 95000, oldPrice: null, stock: 20 }
    ],
    specs: {
      'Material': 'TPU Silikon',
      'Qalinligi': '1.5 mm'
    }
  },
  {
    id: 'case-rn13pro-carbon',
    slug: 'carbon-fiber-case-redmi-note-13-pro',
    category: 'cases',
    brand: 'CarbonStyle',
    nameUz: 'Karbon teksturali g\'ilof Xiaomi Redmi Note 13 Pro uchun',
    nameRu: 'Чехол с карбоновой текстурой для Xiaomi Redmi Note 13 Pro',
    descUz: 'Yengil uglerod tolasiga taqlid qilingan zamonaviy tekstura va issiqlik tarqatuvchi ichki naqsh.',
    descRu: 'Стильная карбоновая текстура, эффективное рассеивание тепла.',
    price: 85000,
    oldPrice: 110000,
    stock: 0,
    warrantyMonths: 1,
    badge: 'sale',
    rating: 4.5,
    reviewsCount: 16,
    isFeatured: false,
    compatibleModels: ['xiaomi-redmi-note-13-pro', 'xiaomi-redmi-note-13'],
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-rn13-crb', color: '#27272A', colorNameUz: 'Carbon Black', colorNameRu: 'Карбоновый черный', price: 85000, oldPrice: 110000, stock: 0 }
    ],
    specs: {
      'Material': 'Elastik Karbon-TPU',
      'Og\'irligi': '28 gramm'
    }
  },

  // ==========================================
  // GaN & FAST CHARGERS (5 Items)
  // ==========================================
  {
    id: 'chg-anker-65w',
    slug: 'anker-prime-65w-gan-3port-fast-charger',
    category: 'chargers',
    brand: 'Anker',
    nameUz: 'Anker Prime 65W GaN III 3-Portli Tezkor Quvvatlagich',
    nameRu: 'Быстрое зарядное устройство Anker Prime 65W GaN III (3 порта)',
    descUz: 'Noutbuk, planshet va smartfonni bir vaqtda zaryadlash. ActiveShield 2.0 aqlli harorat nazorati.',
    descRu: 'Одновременная зарядка ноутбука, планшета и смартфона с защитой ActiveShield 2.0.',
    price: 490000,
    oldPrice: 590000,
    stock: 22,
    warrantyMonths: 18,
    badge: 'premium',
    rating: 4.9,
    reviewsCount: 94,
    isFeatured: true,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15-pro', 'iphone-15', 'iphone-14-pro', 'iphone-14', 'iphone-13',
      'samsung-s24-ultra', 'samsung-s24', 'samsung-s23-ultra', 'samsung-a55', 'samsung-a35',
      'xiaomi-14', 'xiaomi-redmi-note-13-pro', 'xiaomi-redmi-note-13',
      'pixel-8-pro', 'pixel-8'
    ],
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-ank65-blk', color: '#1E293B', colorNameUz: 'Graphite Black', colorNameRu: 'Графитовый черный', price: 490000, oldPrice: 590000, stock: 15 },
      { id: 'v-ank65-slv', color: '#E2E8F0', colorNameUz: 'Silver', colorNameRu: 'Серебристый', price: 490000, oldPrice: 590000, stock: 7 }
    ],
    specs: {
      'Quvvati': '65W Max GaN III',
      'Portlar': '2x USB-C + 1x USB-A',
      'Protokollar': 'PD 3.0, PPS, QC 4.0+, Samsung Super Fast Charge'
    }
  },
  {
    id: 'chg-apple-20w',
    slug: 'original-apple-20w-usb-c-power-adapter',
    category: 'chargers',
    brand: 'Apple',
    nameUz: 'Original Apple 20W USB-C Power Adapter',
    nameRu: 'Оригинальный адаптер питания Apple 20W USB-C',
    descUz: 'iPhone 12 dan 15 Pro Max gacha bo\'lgan modellarni 30 daqiqada 50% gacha tez quvvatlaydi.',
    descRu: 'Быстрая зарядка iPhone от 12 до 15 Pro Max до 50% за 30 минут.',
    price: 295000,
    oldPrice: 350000,
    stock: 50,
    warrantyMonths: 12,
    badge: 'sale',
    rating: 4.9,
    reviewsCount: 160,
    isFeatured: true,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15-pro', 'iphone-15', 'iphone-14-pro', 'iphone-14', 'iphone-13', 'iphone-12'
    ],
    images: [
      'https://images.unsplash.com/photo-1618478594486-c65b899c4936?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-ap20-wht', color: '#FFFFFF', colorNameUz: 'White', colorNameRu: 'Белый', price: 295000, oldPrice: 350000, stock: 50 }
    ],
    specs: {
      'Quvvati': '20W Power Delivery',
      'Port': '1x USB-C'
    }
  },
  {
    id: 'chg-samsung-45w',
    slug: 'original-samsung-45w-super-fast-charger-2-0',
    category: 'chargers',
    brand: 'Samsung',
    nameUz: 'Original Samsung 45W Super Fast Charger 2.0 (Type-C kabel bilan)',
    nameRu: 'Оригинальное зарядное устройство Samsung 45W Super Fast 2.0 (с кабелем)',
    descUz: 'Galaxy S24 Ultra va S23 Ultra uchun maksimal tezlikdagi 45W quvvatlagich.',
    descRu: 'Максимальная скорость зарядки 45 Вт для Galaxy S24 Ultra и S23 Ultra.',
    price: 360000,
    oldPrice: 420000,
    stock: 28,
    warrantyMonths: 12,
    badge: 'new',
    rating: 4.8,
    reviewsCount: 65,
    isFeatured: false,
    compatibleModels: ['samsung-s24-ultra', 'samsung-s24', 'samsung-s23-ultra', 'samsung-a55'],
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-sam45-blk', color: '#18181B', colorNameUz: 'Black', colorNameRu: 'Черный', price: 360000, oldPrice: 420000, stock: 28 }
    ],
    specs: {
      'Quvvati': '45W Super Fast Charging 2.0 (PPS)',
      'Komplekt': '45W Blok + 5A 1.8m Type-C kabel'
    }
  },
  {
    id: 'chg-baseus-30w-gan',
    slug: 'baseus-compact-30w-gan-fast-charger',
    category: 'chargers',
    brand: 'Baseus',
    nameUz: 'Baseus GaN5 30W Mini Tezkor Quvvatlagich',
    nameRu: 'Компактное зарядное устройство Baseus GaN5 30W',
    descUz: 'Ultra ixcham korpus, barcha zamonaviy smartfonlar uchun mos tezkor zaryadlash.',
    descRu: 'Сверхкомпактный размер, поддержка быстрой зарядки всех современных смартфонов.',
    price: 165000,
    oldPrice: null,
    stock: 35,
    warrantyMonths: 6,
    badge: null,
    rating: 4.7,
    reviewsCount: 38,
    isFeatured: false,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15-pro', 'iphone-15', 'iphone-14',
      'samsung-s24', 'samsung-a55', 'xiaomi-redmi-note-13-pro', 'pixel-8'
    ],
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-bas30-blk', color: '#18181B', colorNameUz: 'Qora', colorNameRu: 'Черный', price: 165000, oldPrice: null, stock: 20 },
      { id: 'v-bas30-wht', color: '#FFFFFF', colorNameUz: 'Oq', colorNameRu: 'Белый', price: 165000, oldPrice: null, stock: 15 }
    ],
    specs: {
      'Quvvati': '30W GaN5 Pro',
      'Port': '1x USB-C'
    }
  },
  {
    id: 'chg-ugreen-100w-gan',
    slug: 'ugreen-nexode-100w-4port-gan-desktop-charger',
    category: 'chargers',
    brand: 'UGREEN',
    nameUz: 'UGREEN Nexode 100W 4-Portli GaN Universal Quvvatlagich',
    nameRu: 'Универсальное зарядное устройство UGREEN Nexode 100W (4 порта)',
    descUz: '4 ta qurilmani bir vaqtda zaryadlovchi 100W super-quvvatli GaN stansiyasi.',
    descRu: 'Мощная зарядная станция 100 Вт для одновременной зарядки 4 устройств.',
    price: 780000,
    oldPrice: 890000,
    stock: 0,
    warrantyMonths: 18,
    badge: 'premium',
    rating: 5.0,
    reviewsCount: 44,
    isFeatured: false,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15-pro', 'samsung-s24-ultra', 'xiaomi-14', 'pixel-8-pro'
    ],
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-ug100-blk', color: '#1E293B', colorNameUz: 'Space Gray', colorNameRu: 'Серый космос', price: 780000, oldPrice: 890000, stock: 0 }
    ],
    specs: {
      'Quvvati': '100W Max',
      'Portlar': '3x USB-C + 1x USB-A'
    }
  },

  // ==========================================
  // CABLES (4 Items)
  // ==========================================
  {
    id: 'cbl-baseus-100w-c-to-c',
    slug: 'baseus-100w-type-c-to-type-c-fast-charging-cable',
    category: 'cables',
    brand: 'Baseus',
    nameUz: 'Baseus 100W Type-C to Type-C Mustahkam O\'rilgan Kabel (1.2m)',
    nameRu: 'Кабель Baseus 100W Type-C - Type-C в нейлоновой оплетке (1.2м)',
    descUz: 'E-Marker aqlli chipi, 100W PD tezkor zaryadlash va 480 Mbps ma\'lumot uzatish tezligi.',
    descRu: 'Чип E-Marker, поддержка 100W PD и передача данных 480 Мбит/с.',
    price: 85000,
    oldPrice: 110000,
    stock: 80,
    warrantyMonths: 6,
    badge: 'sale',
    rating: 4.8,
    reviewsCount: 95,
    isFeatured: true,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15-pro', 'iphone-15',
      'samsung-s24-ultra', 'samsung-s24', 'samsung-a55',
      'xiaomi-14', 'xiaomi-redmi-note-13-pro', 'pixel-8-pro', 'pixel-8'
    ],
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-cbl-org', color: '#FF7A00', colorNameUz: 'Orange-Black', colorNameRu: 'Оранжево-черный', price: 85000, oldPrice: 110000, stock: 45 },
      { id: 'v-cbl-blk', color: '#18181B', colorNameUz: 'Black', colorNameRu: 'Черный', price: 85000, oldPrice: 110000, stock: 35 }
    ],
    specs: {
      'Quvvat': '100W (20V/5A)',
      'Uzunlik': '1.2 metr',
      'Material': 'Zich neylon o\'ralma'
    }
  },
  {
    id: 'cbl-apple-lightning-1m',
    slug: 'apple-original-usb-c-to-lightning-cable-1m',
    category: 'cables',
    brand: 'Apple',
    nameUz: 'Original Apple USB-C to Lightning Kabel (1 metr)',
    nameRu: 'Оригинальный кабель Apple USB-C - Lightning (1м)',
    descUz: 'iPhone 14, 13, 12, 11 modellari uchun original tezkor zaryadlash kabeli.',
    descRu: 'Оригинальный кабель быстрой зарядки для iPhone 14, 13, 12, 11.',
    price: 195000,
    oldPrice: 240000,
    stock: 40,
    warrantyMonths: 12,
    badge: 'sale',
    rating: 4.9,
    reviewsCount: 130,
    isFeatured: false,
    compatibleModels: ['iphone-14-pro', 'iphone-14', 'iphone-13', 'iphone-12'],
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-cbl-ap-ltg', color: '#FFFFFF', colorNameUz: 'White', colorNameRu: 'Белый', price: 195000, oldPrice: 240000, stock: 40 }
    ],
    specs: {
      'Turi': 'USB-C to Lightning MFi',
      'Uzunligi': '1.0 metr'
    }
  },
  {
    id: 'cbl-anker-flow-c-to-c',
    slug: 'anker-flow-silicone-type-c-to-type-c-cable',
    category: 'cables',
    brand: 'Anker',
    nameUz: 'Anker PowerLine Flow Yumshoq Silikon Type-C Kabel (1.8m)',
    nameRu: 'Мягкий силиконовый кабель Anker PowerLine Flow Type-C (1.8м)',
    descUz: 'Chigal bo\'lmaydigan ultra yumshoq silikon qoplama, 100W PD quvvati va 25000 marta egilish sinovi.',
    descRu: 'Ультрамягкий силикон без запутывания, 100W PD и тест на 25000 сгибаний.',
    price: 155000,
    oldPrice: null,
    stock: 25,
    warrantyMonths: 18,
    badge: 'new',
    rating: 4.9,
    reviewsCount: 52,
    isFeatured: false,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15-pro', 'iphone-15',
      'samsung-s24-ultra', 'samsung-s24', 'xiaomi-14', 'pixel-8'
    ],
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-ank-cbl-blu', color: '#60A5FA', colorNameUz: 'Cloud Blue', colorNameRu: 'Голубой', price: 155000, oldPrice: null, stock: 15 },
      { id: 'v-ank-cbl-blk', color: '#18181B', colorNameUz: 'Midnight', colorNameRu: 'Черный', price: 155000, oldPrice: null, stock: 10 }
    ],
    specs: {
      'Quvvat': '100W Max Fast Charge',
      'Uzunlik': '1.8 metr',
      'Xususiyat': 'Silicone Soft-Touch'
    }
  },
  {
    id: 'cbl-3in1-baseus',
    slug: 'baseus-3-in-1-universal-fast-charging-cable',
    category: 'cables',
    brand: 'Baseus',
    nameUz: 'Baseus 3-in-1 Universal Tezkor Zaryadlash Kabeli (Lightning + Type-C + Micro)',
    nameRu: 'Универсальный кабель 3-в-1 Baseus (Lightning + Type-C + Micro-USB)',
    descUz: 'Bir vaqtning o\'zida har qanday 3 ta smartfonni zaryadlash uchun qulay o\'rilgan kabel.',
    descRu: 'Удобный кабель для одновременной зарядки 3 любых устройств.',
    price: 95000,
    oldPrice: 120000,
    stock: 35,
    warrantyMonths: 6,
    badge: null,
    rating: 4.6,
    reviewsCount: 68,
    isFeatured: false,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15-pro', 'iphone-14', 'iphone-13',
      'samsung-s24-ultra', 'samsung-s24', 'samsung-a55', 'xiaomi-redmi-note-13-pro'
    ],
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-cbl3in1-blk', color: '#1E293B', colorNameUz: 'Black', colorNameRu: 'Черный', price: 95000, oldPrice: 120000, stock: 35 }
    ],
    specs: {
      'Ulagichlar': 'Type-C, Lightning, Micro-USB',
      'Oqim kuchi': '3.5A Max',
      'Uzunligi': '1.2 metr'
    }
  },

  // ==========================================
  // SCREEN PROTECTORS (4 Items)
  // ==========================================
  {
    id: 'glass-ip15p-privacy',
    slug: 'privacy-9h-tempered-glass-iphone-15-pro',
    category: 'screen_protectors',
    brand: 'GlassPro',
    nameUz: 'Maxfiylik 9H Zirhli Shisha (Privacy Glass) iPhone 15 Pro uchun',
    nameRu: 'Антишпионское защитное стекло Privacy 9H для iPhone 15 Pro',
    descUz: '28 darajadan boshlab ekranni yondan ko\'rinmas qiladi. Yuqori darajadagi oleofob qoplama.',
    descRu: 'Защищает экран от посторонних взглядов под углом от 28°. Олеофобное покрытие.',
    price: 110000,
    oldPrice: 150000,
    stock: 65,
    warrantyMonths: 1,
    badge: 'sale',
    rating: 4.8,
    reviewsCount: 84,
    isFeatured: true,
    compatibleModels: ['iphone-15-pro', 'iphone-15'],
    images: [
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-gls-ip15p-prv', color: '#000000', colorNameUz: 'Anti-Spy Black', colorNameRu: 'Антишпион черный', price: 110000, oldPrice: 150000, stock: 65 }
    ],
    specs: {
      'Qattiqligi': '9H Tempered Glass',
      'Burchak': '28° Anti-Spy Filter',
      'Qalinlik': '0.33 mm'
    }
  },
  {
    id: 'glass-ip15pm-hd',
    slug: 'ultra-clear-9h-glass-iphone-15-pro-max',
    category: 'screen_protectors',
    brand: 'GlassPro',
    nameUz: 'Ultra-Clear 9H Himoya Shishasi iPhone 15 Pro Max uchun (2 dona to\'plam)',
    nameRu: 'Ультрапрозрачное защитное стекло 9H для iPhone 15 Pro Max (набор 2 шт)',
    descUz: '99.9% shaffoflik, chang o\'tkazmaydigan dinamik to\'ri va oson yopishtirish uchun joylagich rom.',
    descRu: '99.9% прозрачности, рамка для легкой установки и сетка от пыли.',
    price: 135000,
    oldPrice: 170000,
    stock: 45,
    warrantyMonths: 1,
    badge: 'new',
    rating: 4.9,
    reviewsCount: 56,
    isFeatured: false,
    compatibleModels: ['iphone-15-pro-max'],
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-gls-ip15pm-hd', color: '#FFFFFF', colorNameUz: 'Ultra Clear', colorNameRu: 'Прозрачный', price: 135000, oldPrice: 170000, stock: 45 }
    ],
    specs: {
      'Komplekt': '2 dona shisha + o\'rnatish qolipi',
      'Qattiqlik': '9H Sapphire Hardness'
    }
  },
  {
    id: 'glass-s24u-uv',
    slug: 'uv-liquid-glass-samsung-galaxy-s24-ultra',
    category: 'screen_protectors',
    brand: 'GlassPro',
    nameUz: 'UV Liquid to\'liq yopishtiruvchi shisha Galaxy S24 Ultra uchun',
    nameRu: 'UV защитное стекло с ультрафиолетовой лампой для Galaxy S24 Ultra',
    descUz: 'Ultratovushli barmoq izi skaneri bilan 100% mos ishlaydi. UV lampasi komplektda mavjud.',
    descRu: '100% совместимость с ультразвуковым сканером отпечатка. УФ-лампа в комплекте.',
    price: 145000,
    oldPrice: 190000,
    stock: 30,
    warrantyMonths: 1,
    badge: 'sale',
    rating: 4.7,
    reviewsCount: 39,
    isFeatured: false,
    compatibleModels: ['samsung-s24-ultra', 'samsung-s23-ultra'],
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-gls-s24u-uv', color: '#FFFFFF', colorNameUz: 'UV Clear', colorNameRu: 'УФ Прозрачный', price: 145000, oldPrice: 190000, stock: 30 }
    ],
    specs: {
      'Skaner mosligi': '100% sezgir ultrasonik skaner',
      'Texnologiya': 'Liquid Optical Clear Glue + UV Lamp'
    }
  },
  {
    id: 'glass-a55-full',
    slug: 'full-glue-9d-glass-galaxy-a55',
    category: 'screen_protectors',
    brand: 'GlassPro',
    nameUz: '9D To\'liq romli mustahkam shisha Galaxy A55 uchun',
    nameRu: 'Защитное стекло 9D с полной проклейкой для Galaxy A55',
    descUz: 'Qora romli 9D himoya oynasi, chetlari silliqlangan 2.5D egri radius.',
    descRu: 'Защитное стекло 9D с черной рамкой и скругленными краями 2.5D.',
    price: 65000,
    oldPrice: null,
    stock: 50,
    warrantyMonths: 1,
    badge: null,
    rating: 4.6,
    reviewsCount: 28,
    isFeatured: false,
    compatibleModels: ['samsung-a55'],
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-gls-a55-blk', color: '#000000', colorNameUz: 'Black Edge', colorNameRu: 'Черная рамка', price: 65000, oldPrice: null, stock: 50 }
    ],
    specs: {
      'Qattiqlik': '9H',
      'Qoplama': 'Anti-Scratch Oleophobic'
    }
  },

  // ==========================================
  // EARBUDS & HEADPHONES (4 Items)
  // ==========================================
  {
    id: 'audio-airpods-pro-2',
    slug: 'apple-airpods-pro-2nd-gen-type-c',
    category: 'headphones',
    brand: 'Apple',
    nameUz: 'Apple AirPods Pro 2 (USB-C MagSafe Case)',
    nameRu: 'Беспроводные наушники Apple AirPods Pro 2 (USB-C)',
    descUz: '2 barobar kuchliroq faol shovqinni so\'ndirish (ANC), shaffoflik rejimi va moslashuvchan audio.',
    descRu: 'В 2 раза мощнее активное шумоподавление (ANC), прозрачный режим и адаптивное аудио.',
    price: 3150000,
    oldPrice: 3450000,
    stock: 16,
    warrantyMonths: 12,
    badge: 'premium',
    rating: 5.0,
    reviewsCount: 145,
    isFeatured: true,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15-pro', 'iphone-15', 'iphone-14-pro', 'iphone-14',
      'samsung-s24-ultra', 'samsung-s24', 'xiaomi-14', 'pixel-8-pro'
    ],
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-app2-wht', color: '#FFFFFF', colorNameUz: 'White', colorNameRu: 'Белый', price: 3150000, oldPrice: 3450000, stock: 16 }
    ],
    specs: {
      'Shovqin so\'ndirish': 'Active Noise Cancellation (ANC)',
      'Avtonomiya': '6 soat (keys bilan 30 soat)',
      'Chip': 'Apple H2 chip, Bluetooth 5.3'
    }
  },
  {
    id: 'audio-galaxy-buds2-pro',
    slug: 'samsung-galaxy-buds2-pro-graphite',
    category: 'headphones',
    brand: 'Samsung',
    nameUz: 'Samsung Galaxy Buds2 Pro 24-bit Hi-Fi Graphite',
    nameRu: 'Беспроводные наушники Samsung Galaxy Buds2 Pro Графит',
    descUz: '24-bit Hi-Fi musiqiy sifat, 3 ta yuqori sezgir SNR mikrofon va 360 Audio fazoviy ovoz.',
    descRu: 'Звук 24-бит Hi-Fi, 3 микрофона с высоким SNR и объемный звук 360 Audio.',
    price: 1890000,
    oldPrice: 2190000,
    stock: 12,
    warrantyMonths: 12,
    badge: 'sale',
    rating: 4.8,
    reviewsCount: 72,
    isFeatured: true,
    compatibleModels: [
      'samsung-s24-ultra', 'samsung-s24', 'samsung-s23-ultra', 'samsung-a55',
      'iphone-15-pro', 'xiaomi-14', 'pixel-8'
    ],
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-buds2-grp', color: '#27272A', colorNameUz: 'Graphite', colorNameRu: 'Графит', price: 1890000, oldPrice: 2190000, stock: 8 },
      { id: 'v-buds2-wht', color: '#FFFFFF', colorNameUz: 'White', colorNameRu: 'Белый', price: 1890000, oldPrice: 2190000, stock: 4 }
    ],
    specs: {
      'Ovoz sifati': '24bit Hi-Fi SSC Codec',
      'ANC': 'Intellektual faol shovqin so\'ndirish',
      'Suvga chidamlilik': 'IPX7'
    }
  },
  {
    id: 'audio-anker-q30-headphone',
    slug: 'anker-soundcore-life-q30-anc-headphones',
    category: 'headphones',
    brand: 'Anker',
    nameUz: 'Anker Soundcore Life Q30 Sim-Simsiz ANC Quloqchin',
    nameRu: 'Полноразмерные наушники Anker Soundcore Life Q30 ANC',
    descUz: 'Gibrid faol shovqinni so\'ndirish, Hi-Res Audio sertifikati va 40 soatlik ulkan avtonomiya.',
    descRu: 'Гибридный ANC, сертификация Hi-Res Audio и 40 часов автономной работы.',
    price: 990000,
    oldPrice: 1190000,
    stock: 15,
    warrantyMonths: 18,
    badge: 'sale',
    rating: 4.8,
    reviewsCount: 88,
    isFeatured: false,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15', 'samsung-s24-ultra', 'xiaomi-14', 'pixel-8'
    ],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-q30-blk', color: '#0F172A', colorNameUz: 'Midnight Black', colorNameRu: 'Черный', price: 990000, oldPrice: 1190000, stock: 15 }
    ],
    specs: {
      'Turi': 'Over-ear to\'liq qoplovchi',
      'Batareya': '40 soat (ANC bilan) / 60 soat (standart)'
    }
  },
  {
    id: 'audio-baseus-bowie-e3',
    slug: 'baseus-bowie-e3-tws-wireless-earphones',
    category: 'headphones',
    brand: 'Baseus',
    nameUz: 'Baseus Bowie E3 TWS Simsiz Quloqchin',
    nameRu: 'Беспроводные наушники TWS Baseus Bowie E3',
    descUz: 'Flash Charge tezkor 10 daqiqada zaryadlash, past kechikish rejimi va toza ovoz.',
    descRu: 'Быстрая зарядка Flash Charge (10 мин = 2 часа работы) и чистый звук.',
    price: 240000,
    oldPrice: 290000,
    stock: 45,
    warrantyMonths: 6,
    badge: null,
    rating: 4.5,
    reviewsCount: 64,
    isFeatured: false,
    compatibleModels: [
      'iphone-15', 'iphone-14', 'samsung-a55', 'xiaomi-redmi-note-13-pro'
    ],
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-e3-wht', color: '#FFFFFF', colorNameUz: 'White', colorNameRu: 'Белый', price: 240000, oldPrice: 290000, stock: 25 },
      { id: 'v-e3-blk', color: '#18181B', colorNameUz: 'Black', colorNameRu: 'Черный', price: 240000, oldPrice: 290000, stock: 20 }
    ],
    specs: {
      'Avtonomiya': '5 soat (keys bilan 25 soat)',
      'Kechikish': '0.06s Low Latency'
    }
  },

  // ==========================================
  // POWER BANKS (3 Items)
  // ==========================================
  {
    id: 'pb-anker-737-24k',
    slug: 'anker-737-power-bank-24000mah-140w',
    category: 'power_banks',
    brand: 'Anker',
    nameUz: 'Anker 737 Power Bank (PowerCore 24K) 140W Smart Display',
    nameRu: 'Повербанк Anker 737 (24000 мАч) 140 Вт со смарт-дисплеем',
    descUz: '140W ikki tomonlama ultra-tezkor zaryadlash, rangli aqlli displey va 24,000 mAh quvvat.',
    descRu: 'Двусторонняя быстрая зарядка 140 Вт, цветной информационный дисплей и 24000 мАч.',
    price: 1350000,
    oldPrice: 1550000,
    stock: 10,
    warrantyMonths: 18,
    badge: 'premium',
    rating: 5.0,
    reviewsCount: 47,
    isFeatured: true,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15-pro', 'samsung-s24-ultra', 'xiaomi-14', 'pixel-8-pro'
    ],
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-ank737-blk', color: '#1E293B', colorNameUz: 'Black Titanium', colorNameRu: 'Черный', price: 1350000, oldPrice: 1550000, stock: 10 }
    ],
    specs: {
      'Sig\'imi': '24,000 mAh (86.4Wh)',
      'Chiqish quvvati': '140W Max PD 3.1',
      'Portlar': '2x USB-C + 1x USB-A'
    }
  },
  {
    id: 'pb-baseus-magsafe-10k',
    slug: 'baseus-magnetic-magsafe-power-bank-10000mah-20w',
    category: 'power_banks',
    brand: 'Baseus',
    nameUz: 'Baseus Magnetic MagSafe 20W Power Bank 10,000 mAh',
    nameRu: 'Магнитный повербанк MagSafe Baseus 10000 мАч (20 Вт)',
    descUz: 'Kuchli neodim magnitli simsiz quvvatlagich, ixcham o\'lcham va 20W PD tezkor simli zaryadlash.',
    descRu: 'Мощный магнит MagSafe для беспроводной зарядки и порт 20W PD.',
    price: 360000,
    oldPrice: 420000,
    stock: 24,
    warrantyMonths: 6,
    badge: 'sale',
    rating: 4.8,
    reviewsCount: 65,
    isFeatured: true,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15-pro', 'iphone-15', 'iphone-14-pro', 'iphone-14', 'iphone-13', 'iphone-12'
    ],
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-pb-mag-blu', color: '#38BDF8', colorNameUz: 'Sky Blue', colorNameRu: 'Голубой', price: 360000, oldPrice: 420000, stock: 14 },
      { id: 'v-pb-mag-blk', color: '#18181B', colorNameUz: 'Black', colorNameRu: 'Черный', price: 360000, oldPrice: 420000, stock: 10 }
    ],
    specs: {
      'Sig\'imi': '10,000 mAh',
      'Simsiz quvvat': '15W MagSafe',
      'Simli quvvat': '20W Power Delivery'
    }
  },
  {
    id: 'pb-xiaomi-20k-22w',
    slug: 'xiaomi-redmi-power-bank-20000mah-22-5w',
    category: 'power_banks',
    brand: 'Xiaomi',
    nameUz: 'Xiaomi Power Bank 20,000 mAh 22.5W Fast Charge',
    nameRu: 'Повербанк Xiaomi 20000 мАч 22.5W быстрая зарядка',
    descUz: 'Katta sig\'im, 3 ta port va bir vaqtning o\'zida 3 ta qurilmani zaryadlash imkoniyati.',
    descRu: 'Большая емкость, 3 порта и возможность одновременной зарядки 3 устройств.',
    price: 265000,
    oldPrice: null,
    stock: 35,
    warrantyMonths: 6,
    badge: null,
    rating: 4.7,
    reviewsCount: 110,
    isFeatured: false,
    compatibleModels: [
      'xiaomi-14', 'xiaomi-redmi-note-13-pro', 'samsung-a55', 'samsung-s24', 'iphone-15'
    ],
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-mi-pb-blk', color: '#18181B', colorNameUz: 'Qora', colorNameRu: 'Черный', price: 265000, oldPrice: null, stock: 20 },
      { id: 'v-mi-pb-wht', color: '#FFFFFF', colorNameUz: 'Oq', colorNameRu: 'Белый', price: 265000, oldPrice: null, stock: 15 }
    ],
    specs: {
      'Sig\'imi': '20,000 mAh (74Wh)',
      'Maksimal quvvat': '22.5W Fast Charge'
    }
  },

  // ==========================================
  // CAR CHARGERS & CAR HOLDERS (3 Items)
  // ==========================================
  {
    id: 'car-chg-baseus-65w',
    slug: 'baseus-65w-dual-port-car-fast-charger',
    category: 'chargers',
    brand: 'Baseus',
    nameUz: 'Baseus 65W Avtomobil Tezkor Zaryadlovchi Qurilmasi (Metal korpus)',
    nameRu: 'Автомобильное зарядное устройство Baseus 65W (металлический корпус)',
    descUz: '12V-24V avtomobillar uchun 65W PD tezkor zaryadlash va muz-ko\'k LED yoritish halqasi.',
    descRu: 'Быстрая зарядка 65W PD для авто 12V-24V с мягкой лед-подсветкой.',
    price: 175000,
    oldPrice: 220000,
    stock: 30,
    warrantyMonths: 6,
    badge: 'sale',
    rating: 4.8,
    reviewsCount: 55,
    isFeatured: false,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15', 'samsung-s24-ultra', 'xiaomi-14', 'pixel-8'
    ],
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-car-chg-gry', color: '#334155', colorNameUz: 'Space Gray', colorNameRu: 'Серый', price: 175000, oldPrice: 220000, stock: 30 }
    ],
    specs: {
      'Quvvat': '65W (USB-C 45W + USB-A 20W)',
      'Kirish': 'DC 12V-24V'
    }
  },
  {
    id: 'car-holder-magsafe-baseus',
    slug: 'baseus-magsafe-wireless-car-mount-charger-15w',
    category: 'chargers',
    brand: 'Baseus',
    nameUz: 'Baseus MagSafe Avtomobil Magnitli Simsiz Zaryadlovchi Tutqich (15W)',
    nameRu: 'Магнитный автодержатель с беспроводной зарядкой MagSafe Baseus 15W',
    descUz: 'Kuchli 16 ta neodim magnit, deflektorga qotirish va 360 daraja buriluvchi sharli bo\'g\'in.',
    descRu: '16 мощных магнитов, надежное крепление в дефлектор и вращение 360 градусов.',
    price: 285000,
    oldPrice: 340000,
    stock: 20,
    warrantyMonths: 6,
    badge: 'new',
    rating: 4.8,
    reviewsCount: 39,
    isFeatured: true,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15-pro', 'iphone-15', 'iphone-14-pro', 'iphone-14', 'iphone-13', 'iphone-12'
    ],
    images: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-car-mag-blk', color: '#18181B', colorNameUz: 'Black', colorNameRu: 'Черный', price: 285000, oldPrice: 340000, stock: 20 }
    ],
    specs: {
      'Simsiz quvvat': '15W Max MagSafe',
      'O\'rnatish': 'Havo kanali (deflektor)'
    }
  },
  {
    id: 'car-holder-gravity-ugreen',
    slug: 'ugreen-gravity-metal-car-phone-holder',
    category: 'cases',
    brand: 'UGREEN',
    nameUz: 'UGREEN Gravity Metall Avtomobil Telefon Tutqichi',
    nameRu: 'Гравитационный металлический автодержатель для телефона UGREEN',
    descUz: 'Smartfon og\'irligi hisobiga avtomatik qisuvchi alyuminiy korpusli mustahkam tutqich.',
    descRu: 'Гравитационный зажим из сплава алюминия, надежная фиксация смартфона.',
    price: 135000,
    oldPrice: null,
    stock: 25,
    warrantyMonths: 6,
    badge: null,
    rating: 4.7,
    reviewsCount: 31,
    isFeatured: false,
    compatibleModels: [
      'iphone-15-pro-max', 'iphone-15', 'samsung-s24-ultra', 'samsung-s24', 'samsung-a55', 'xiaomi-redmi-note-13-pro'
    ],
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'v-car-ug-slv', color: '#64748B', colorNameUz: 'Titanium Silver', colorNameRu: 'Серебристый', price: 135000, oldPrice: null, stock: 25 }
    ],
    specs: {
      'Moslik': '4.7 - 7.2 dyuymli smartfonlar',
      'Material': 'Aviatsiya alyuminiyi + Silikon'
    }
  }
];
