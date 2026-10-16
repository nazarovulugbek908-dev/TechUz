import { supabase } from '../lib/supabase';
import { adminAuthService } from './adminAuthService';

function normalizeCategory(c) {
  if (!c) return null;
  return {
    id: c.id,
    slug: c.slug || c.id,
    name_uz: c.name_uz || c.nameUz || '',
    name_ru: c.name_ru || c.nameRu || '',
    nameUz: c.name_uz || c.nameUz || '',
    nameRu: c.name_ru || c.nameRu || '',
    icon: c.icon || 'Package',
    badge: c.badge || null,
    displayOrder: c.display_order ?? 0,
    isActive: c.is_active !== undefined ? Boolean(c.is_active) : true
  };
}

export const categoryService = {
  async getCategories() {
    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        return { data: data.map(normalizeCategory), error: null };
      }
    } catch (err) {
      console.warn('Supabase getCategories fallback:', err);
    }

    // 2. Fallback to API
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to load categories');
      const json = await res.json();
      return { data: (json.data || []).map(normalizeCategory), error: null };
    } catch (err) {
      console.error('Fetch categories error:', err);
      return { data: [], error: err };
    }
  },

  async createCategory(catData) {
    const slug = catData.slug || (catData.name_uz || catData.nameUz || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = catData.id || slug;
    const payload = {
      id,
      slug,
      name_uz: catData.name_uz || catData.nameUz,
      name_ru: catData.name_ru || catData.nameRu,
      icon: catData.icon || 'Package',
      badge: catData.badge || null
    };

    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([payload])
        .select()
        .single();
      if (!error && data) {
        return { data: normalizeCategory(data), error: null };
      }
    } catch (err) {
      console.warn('Supabase createCategory fallback:', err);
    }

    // 2. Fallback to API
    const token = adminAuthService.getToken();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nameUz: catData.name_uz || catData.nameUz,
          nameRu: catData.name_ru || catData.nameRu,
          icon: catData.icon,
          badge: catData.badge
        })
      });
      const json = await res.json();
      if (!res.ok) return { data: null, error: { message: json.error } };
      return { data: normalizeCategory(json.data), error: null };
    } catch (err) {
      return { data: null, error: { message: 'Serverga ulanib bo‘lmadi' } };
    }
  },

  async updateCategory(id, updates) {
    const payload = {};
    if (updates.name_uz || updates.nameUz) payload.name_uz = updates.name_uz || updates.nameUz;
    if (updates.name_ru || updates.nameRu) payload.name_ru = updates.name_ru || updates.nameRu;
    if (updates.icon) payload.icon = updates.icon;
    if (updates.badge !== undefined) payload.badge = updates.badge;

    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return { data: normalizeCategory(data), error: null };
      }
    } catch (err) {
      console.warn('Supabase updateCategory fallback:', err);
    }

    // 2. Fallback to API
    const token = adminAuthService.getToken();
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nameUz: updates.name_uz || updates.nameUz,
          nameRu: updates.name_ru || updates.nameRu,
          icon: updates.icon,
          badge: updates.badge
        })
      });
      const json = await res.json();
      if (!res.ok) return { data: null, error: { message: json.error } };
      return { data: updates, error: null };
    } catch (err) {
      return { data: null, error: { message: 'Serverga ulanib bo‘lmadi' } };
    }
  },

  async deleteCategory(id) {
    // 1. Try Supabase
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      if (!error) return { error: null };
    } catch (err) {
      console.warn('Supabase deleteCategory fallback:', err);
    }

    // 2. Fallback to API
    const token = adminAuthService.getToken();
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return { error: { message: 'Kategoriyani o‘chirib bo‘lmadi' } };
      return { error: null };
    } catch (err) {
      return { error: { message: 'Serverga ulanib bo‘lmadi' } };
    }
  }
};
