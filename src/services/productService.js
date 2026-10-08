import { mockProducts } from '../data/mockProducts';
import { storage } from '../utils/storage';

const PRODUCTS_STORAGE_KEY = 'techuz_mock_products';

function getStoredProducts() {
  const products = storage.get(PRODUCTS_STORAGE_KEY, null);
  if (!products || !Array.isArray(products) || products.length === 0) {
    storage.set(PRODUCTS_STORAGE_KEY, mockProducts);
    return mockProducts;
  }

  // Synchronize product images with fresh mockProducts catalog
  const freshMap = new Map(mockProducts.map((p) => [p.id, p.images]));
  let hasChanges = false;
  const upgraded = products.map((p) => {
    const freshImages = freshMap.get(p.id);
    if (freshImages && JSON.stringify(p.images) !== JSON.stringify(freshImages)) {
      hasChanges = true;
      return { ...p, images: freshImages };
    }
    return p;
  });

  if (hasChanges) {
    storage.set(PRODUCTS_STORAGE_KEY, upgraded);
    return upgraded;
  }

  return products;
}

/**
 * Product Data Access Service (Frontend-Only Local Mock & Storage)
 */
export const productService = {
  /**
   * Query products with multi-facet filters, phoneModel compatibility prioritization, search & sorting
   */
  async getProducts({
    category = null,
    phoneModel = null,
    brand = null,
    minPrice = null,
    maxPrice = null,
    inStockOnly = false,
    onSaleOnly = false,
    search = '',
    sort = 'popular', // popular | price_asc | price_desc | newest
    limit = null
  } = {}) {
    const rawList = getStoredProducts();
    let result = rawList.map((p) => ({
      ...p,
      name_uz: p.nameUz || p.name_uz || p.name,
      name_ru: p.nameRu || p.name_ru || p.name,
      description_uz: p.descUz || p.description_uz || p.description,
      description_ru: p.descRu || p.description_ru || p.description
    }));

    // Filter by Category
    if (category && category !== 'all') {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by Brand
    if (brand && brand !== 'all') {
      result = result.filter(
        (p) => p.brand?.toLowerCase() === brand.toLowerCase()
      );
    }

    // Filter by Price range (integer UZS)
    if (minPrice !== null && minPrice !== undefined) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== null && maxPrice !== undefined) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Filter by In Stock
    if (inStockOnly) {
      result = result.filter((p) => Number(p.stock) > 0);
    }

    // Filter by On Sale
    if (onSaleOnly) {
      result = result.filter((p) => p.oldPrice && p.oldPrice > p.price);
    }

    // Filter by Search Query
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name_uz?.toLowerCase().includes(q) ||
          p.name_ru?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    // Sorting & Phone Model Compatibility Prioritization
    if (phoneModel) {
      result.sort((a, b) => {
        const aCompat = Array.isArray(a.compatibleModels) && a.compatibleModels.includes(phoneModel);
        const bCompat = Array.isArray(b.compatibleModels) && b.compatibleModels.includes(phoneModel);
        if (aCompat && !bCompat) return -1;
        if (!aCompat && bCompat) return 1;
        return 0;
      });
    }

    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      result.sort((a, b) => (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0));
    } else if (sort === 'popular') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }

    return {
      data: result,
      total: result.length,
      error: null
    };
  },

  /**
   * Get single product by slug
   */
  async getProductBySlug(slug) {
    const rawList = getStoredProducts();
    const raw = rawList.find((p) => p.slug === slug);
    if (!raw) {
      return { data: null, error: { message: 'Product not found' } };
    }
    const product = {
      ...raw,
      name_uz: raw.nameUz || raw.name_uz || raw.name,
      name_ru: raw.nameRu || raw.name_ru || raw.name,
      description_uz: raw.descUz || raw.description_uz || raw.description,
      description_ru: raw.descRu || raw.description_ru || raw.description
    };
    return { data: product, error: null };
  },

  /**
   * Get single product by ID
   */
  async getProductById(id) {
    const rawList = getStoredProducts();
    const raw = rawList.find((p) => p.id === id || String(p.id) === String(id));
    if (!raw) {
      return { data: null, error: { message: 'Product not found' } };
    }
    const product = {
      ...raw,
      name_uz: raw.nameUz || raw.name_uz || raw.name,
      name_ru: raw.nameRu || raw.name_ru || raw.name,
      description_uz: raw.descUz || raw.description_uz || raw.description,
      description_ru: raw.descRu || raw.description_ru || raw.description
    };
    return { data: product, error: null };
  },

  /**
   * Create new product (Admin CRUD)
   */
  async createProduct(productData) {
    const rawList = getStoredProducts();
    const newProduct = {
      id: `prod-${Date.now()}`,
      slug: productData.slug || `prod-${Date.now()}`,
      nameUz: productData.nameUz || productData.name_uz,
      nameRu: productData.nameRu || productData.name_ru,
      name_uz: productData.nameUz || productData.name_uz,
      name_ru: productData.nameRu || productData.name_ru,
      descUz: productData.descUz || productData.description_uz || '',
      descRu: productData.descRu || productData.description_ru || '',
      description_uz: productData.descUz || productData.description_uz || '',
      description_ru: productData.descRu || productData.description_ru || '',
      category: productData.category || 'smartphones',
      brand: productData.brand || 'Apple',
      price: Math.round(Number(productData.price) || 0),
      oldPrice: productData.oldPrice ? Math.round(Number(productData.oldPrice)) : null,
      stock: Number(productData.stock) || 0,
      sku: productData.sku || `SKU-${Date.now().toString().slice(-5)}`,
      badge: productData.badge || null,
      images: Array.isArray(productData.images) && productData.images.length > 0 
        ? productData.images 
        : ['https://placehold.co/600x600/f8fafc/0f172a?text=TechUz+Product'],
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      storageOptions: Array.isArray(productData.storageOptions) ? productData.storageOptions : [],
      compatibleModels: Array.isArray(productData.compatibleModels) ? productData.compatibleModels : [],
      warrantyMonths: Number(productData.warrantyMonths) || 12,
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: !!productData.isFeatured,
      createdAt: new Date().toISOString()
    };

    const updated = [newProduct, ...rawList];
    storage.set(PRODUCTS_STORAGE_KEY, updated);

    return { data: newProduct, error: null };
  },

  /**
   * Update existing product (Admin CRUD)
   */
  async updateProduct(id, updates) {
    const rawList = getStoredProducts();
    const idx = rawList.findIndex((p) => p.id === id || String(p.id) === String(id));
    if (idx === -1) {
      return { data: null, error: { message: 'Product not found' } };
    }

    const updatedItem = {
      ...rawList[idx],
      ...updates,
      nameUz: updates.nameUz || updates.name_uz || rawList[idx].nameUz,
      nameRu: updates.nameRu || updates.name_ru || rawList[idx].nameRu,
      name_uz: updates.nameUz || updates.name_uz || rawList[idx].name_uz,
      name_ru: updates.nameRu || updates.name_ru || rawList[idx].name_ru,
      descUz: updates.descUz || updates.description_uz || rawList[idx].descUz,
      descRu: updates.descRu || updates.description_ru || rawList[idx].descRu,
      description_uz: updates.descUz || updates.description_uz || rawList[idx].description_uz,
      description_ru: updates.descRu || updates.description_ru || rawList[idx].description_ru,
      price: updates.price !== undefined ? Math.round(Number(updates.price)) : rawList[idx].price,
      oldPrice: updates.oldPrice !== undefined ? (updates.oldPrice ? Math.round(Number(updates.oldPrice)) : null) : rawList[idx].oldPrice,
      stock: updates.stock !== undefined ? Number(updates.stock) : rawList[idx].stock
    };

    rawList[idx] = updatedItem;
    storage.set(PRODUCTS_STORAGE_KEY, rawList);

    return { data: updatedItem, error: null };
  },

  /**
   * Delete product (Admin CRUD)
   */
  async deleteProduct(id) {
    const rawList = getStoredProducts();
    const updated = rawList.filter((p) => p.id !== id && String(p.id) !== String(id));
    storage.set(PRODUCTS_STORAGE_KEY, updated);
    return { error: null };
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 8) {
    const { data } = await this.getProducts({ limit });
    return {
      data: data.filter((p) => p.isFeatured || p.badge === 'sale'),
      error: null
    };
  }
};
