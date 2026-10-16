import { supabase } from '../lib/supabase';
import { adminAuthService } from './adminAuthService';

export function normalizeProduct(p) {
  if (!p) return null;
  const isFeatured = p.is_featured !== undefined ? Boolean(p.is_featured) : Boolean(p.isFeatured);
  const images = Array.isArray(p.images)
    ? p.images
    : typeof p.images === 'string'
    ? (() => { try { return JSON.parse(p.images); } catch { return []; } })()
    : [];
  const compatibleModels = Array.isArray(p.compatible_models)
    ? p.compatible_models
    : Array.isArray(p.compatibleModels)
    ? p.compatibleModels
    : typeof p.compatible_models === 'string'
    ? (() => { try { return JSON.parse(p.compatible_models); } catch { return []; } })()
    : [];
  const variants = Array.isArray(p.variants)
    ? p.variants
    : typeof p.variants === 'string'
    ? (() => { try { return JSON.parse(p.variants); } catch { return []; } })()
    : [];
  const specs = typeof p.specs === 'object' && p.specs !== null
    ? p.specs
    : typeof p.specs === 'string'
    ? (() => { try { return JSON.parse(p.specs); } catch { return {}; } })()
    : {};

  return {
    id: String(p.id),
    slug: p.slug,
    category: p.category,
    brand: p.brand,
    nameUz: p.name_uz || p.nameUz || '',
    nameRu: p.name_ru || p.nameRu || '',
    name_uz: p.name_uz || p.nameUz || '',
    name_ru: p.name_ru || p.nameRu || '',
    descUz: p.desc_uz || p.descUz || '',
    descRu: p.desc_ru || p.descRu || '',
    desc_uz: p.desc_uz || p.descUz || '',
    desc_ru: p.desc_ru || p.descRu || '',
    price: Number(p.price) || 0,
    oldPrice: p.old_price != null ? Number(p.old_price) : p.oldPrice != null ? Number(p.oldPrice) : null,
    old_price: p.old_price != null ? Number(p.old_price) : p.oldPrice != null ? Number(p.oldPrice) : null,
    stock: p.stock != null ? Number(p.stock) : 0,
    warrantyMonths: p.warranty_months != null ? Number(p.warranty_months) : p.warrantyMonths != null ? Number(p.warrantyMonths) : 12,
    warranty_months: p.warranty_months != null ? Number(p.warranty_months) : p.warrantyMonths != null ? Number(p.warrantyMonths) : 12,
    badge: p.badge || null,
    rating: Number(p.rating) || 5.0,
    reviewsCount: Number(p.reviews_count || p.reviewsCount || 0),
    isFeatured,
    is_featured: isFeatured,
    isActive: p.is_active !== undefined ? Boolean(p.is_active) : true,
    compatibleModels,
    compatible_models: compatibleModels,
    images,
    variants,
    specs,
    createdAt: p.created_at || p.createdAt,
    created_at: p.created_at || p.createdAt,
    updatedAt: p.updated_at || p.updatedAt,
    updated_at: p.updated_at || p.updatedAt
  };
}

export const productService = {
  /**
   * Query products with Supabase first, fallback to local backend API
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
    sort = 'popular',
    limit = null,
    offset = 0
  } = {}) {
    // 1. Try Supabase query
    try {
      let query = supabase.from('products').select('*', { count: 'exact' });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (brand && brand !== 'all') {
        query = query.ilike('brand', brand);
      }
      if (inStockOnly) {
        query = query.gt('stock', 0);
      }
      if (minPrice != null && minPrice !== '') {
        query = query.gte('price', Number(minPrice));
      }
      if (maxPrice != null && maxPrice !== '') {
        query = query.lte('price', Number(maxPrice));
      }
      if (search && search.trim()) {
        const s = search.trim();
        query = query.or(`name_uz.ilike.%${s}%,name_ru.ilike.%${s}%,brand.ilike.%${s}%,category.ilike.%${s}%`);
      }

      // Sort
      if (sort === 'popular') {
        query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false });
      } else if (sort === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (sort === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else if (sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (limit != null) {
        query = query.range(offset, offset + Number(limit) - 1);
      }

      const { data, error, count } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return {
          data: data.map(normalizeProduct),
          total: count != null ? count : data.length,
          error: null
        };
      }
    } catch (err) {
      console.warn('Supabase getProducts fallback:', err);
    }

    // 2. Fallback to local server API
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (brand && brand !== 'all') params.append('brand', brand);
    if (search) params.append('search', search);
    if (minPrice) params.append('minPrice', String(minPrice));
    if (maxPrice) params.append('maxPrice', String(maxPrice));
    if (inStockOnly) params.append('inStockOnly', 'true');
    if (onSaleOnly) params.append('onSaleOnly', 'true');
    if (phoneModel) params.append('phoneModel', phoneModel);
    if (sort) params.append('sort', sort);
    if (limit) params.append('limit', String(limit));
    if (offset) params.append('offset', String(offset));

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const json = await res.json();
      const list = (json.data || []).map(normalizeProduct);
      return { data: list, total: json.total || list.length, error: null };
    } catch (err) {
      console.error('Failed to fetch products from API:', err);
      return { data: [], total: 0, error: err };
    }
  },

  /**
   * Get single product by id
   */
  async getProductById(id) {
    if (!id) return { data: null, error: 'Product ID required' };

    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', String(id))
        .single();
      if (!error && data) {
        return { data: normalizeProduct(data), error: null };
      }
    } catch (err) {}

    // 2. Fallback to API
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
      if (!res.ok) return { data: null, error: 'Mahsulot topilmadi' };
      const json = await res.json();
      return { data: normalizeProduct(json.data), error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Get single product by slug
   */
  async getProductBySlug(slug) {
    if (!slug) return { data: null, error: 'Slug required' };

    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return { data: normalizeProduct(data), error: null };
      }
    } catch (err) {}

    // 2. Fallback to API
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
      if (!res.ok) return { data: null, error: 'Mahsulot topilmadi' };
      const json = await res.json();
      return { data: normalizeProduct(json.data), error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async getFeaturedProducts(limit = 8) {
    return this.getProducts({ sort: 'popular', limit });
  },

  async getRelatedProducts(category, currentId, limit = 4) {
    const { data } = await this.getProducts({ category, limit: limit + 1 });
    const filtered = (data || []).filter((p) => String(p.id) !== String(currentId)).slice(0, limit);
    return { data: filtered, error: null };
  },

  /**
   * Supabase Storage Image Upload
   */
  async uploadProductImage(file) {
    if (!file) throw new Error('Fayl tanlanmadi');
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `products/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        return publicUrl;
      }
    } catch (err) {
      console.warn('Supabase storage upload error:', err);
    }

    // Local Base64 preview fallback if storage bucket not yet applied
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  },

  /**
   * Create Product (Supabase first, then local API)
   */
  async createProduct(productData) {
    const prodId = productData.id || `prod-${Date.now()}`;
    const payload = {
      id: prodId,
      slug: productData.slug || `prod-${Date.now()}`,
      category: productData.category,
      brand: productData.brand,
      name_uz: productData.nameUz || productData.name_uz,
      name_ru: productData.nameRu || productData.name_ru,
      desc_uz: productData.descUz || productData.desc_uz || '',
      desc_ru: productData.descRu || productData.desc_ru || '',
      price: Number(productData.price) || 0,
      old_price: productData.oldPrice ? Number(productData.oldPrice) : null,
      stock: Number(productData.stock) || 0,
      warranty_months: Number(productData.warrantyMonths) || 12,
      badge: productData.badge || null,
      rating: Number(productData.rating) || 5.0,
      reviews_count: Number(productData.reviewsCount) || 0,
      is_featured: Boolean(productData.isFeatured),
      is_active: productData.isActive !== undefined ? Boolean(productData.isActive) : true,
      compatible_models: productData.compatibleModels || [],
      images: productData.images || [],
      variants: productData.variants || [],
      specs: productData.specs || {}
    };

    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();
      if (!error && data) {
        return { data: normalizeProduct(data), error: null };
      }
    } catch (err) {
      console.warn('Supabase createProduct fallback:', err);
    }

    // 2. Fallback to API
    const token = adminAuthService.getToken();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: json.error || 'Mahsulot yaratib bo‘lmadi' } };
      }
      return { data: normalizeProduct(json.data), error: null };
    } catch (err) {
      return { data: null, error: { message: 'Serverga ulanib bo‘lmadi' } };
    }
  },

  /**
   * Update Product
   */
  async updateProduct(id, productData) {
    const payload = {};
    if (productData.nameUz || productData.name_uz) payload.name_uz = productData.nameUz || productData.name_uz;
    if (productData.nameRu || productData.name_ru) payload.name_ru = productData.nameRu || productData.name_ru;
    if (productData.descUz !== undefined) payload.desc_uz = productData.descUz;
    if (productData.descRu !== undefined) payload.desc_ru = productData.descRu;
    if (productData.price !== undefined) payload.price = Number(productData.price);
    if (productData.oldPrice !== undefined) payload.old_price = productData.oldPrice ? Number(productData.oldPrice) : null;
    if (productData.stock !== undefined) payload.stock = Number(productData.stock);
    if (productData.category) payload.category = productData.category;
    if (productData.brand) payload.brand = productData.brand;
    if (productData.isFeatured !== undefined) payload.is_featured = Boolean(productData.isFeatured);
    if (productData.badge !== undefined) payload.badge = productData.badge;
    if (productData.images) payload.images = productData.images;
    if (productData.variants) payload.variants = productData.variants;
    if (productData.specs) payload.specs = productData.specs;
    payload.updated_at = new Date().toISOString();

    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', String(id))
        .select()
        .single();
      if (!error && data) {
        return { data: normalizeProduct(data), error: null };
      }
    } catch (err) {
      console.warn('Supabase updateProduct fallback:', err);
    }

    // 2. Fallback to API
    const token = adminAuthService.getToken();
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      const json = await res.json();
      if (!res.ok) {
        return { data: null, error: { message: json.error || 'Mahsulot yangilab bo‘lmadi' } };
      }
      return { data: normalizeProduct(json.data), error: null };
    } catch (err) {
      return { data: null, error: { message: 'Serverga ulanib bo‘lmadi' } };
    }
  },

  /**
   * Delete Product
   */
  async deleteProduct(id) {
    // 1. Try Supabase
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', String(id));
      if (!error) {
        return { success: true, error: null };
      }
    } catch (err) {
      console.warn('Supabase deleteProduct fallback:', err);
    }

    // 2. Fallback to API
    const token = adminAuthService.getToken();
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: { message: json.error || 'O‘chirib bo‘lmadi' } };
      }
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: { message: 'Serverga ulanib bo‘lmadi' } };
    }
  }
};
