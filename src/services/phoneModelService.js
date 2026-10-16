import { supabase } from '../lib/supabase';

export const phoneModelService = {
  async getPhoneModels({ search = '', brand = null } = {}) {
    // 1. Try Supabase
    try {
      let query = supabase.from('phone_models').select('*');
      if (brand && brand !== 'all') {
        query = query.ilike('brand', brand);
      }
      if (search.trim()) {
        const s = search.trim();
        query = query.or(`name.ilike.%${s}%,brand.ilike.%${s}%`);
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return { data, error: null };
      }
    } catch (err) {
      console.warn('Supabase getPhoneModels fallback:', err);
    }

    // 2. Fallback to API
    try {
      const res = await fetch('/api/categories/meta/phone-models');
      if (!res.ok) throw new Error('Failed to load phone models');
      const json = await res.json();
      let models = json.data || [];

      if (brand && brand !== 'all') {
        models = models.filter((m) => m.brand?.toLowerCase() === brand.toLowerCase());
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        models = models.filter(
          (m) =>
            m.name?.toLowerCase().includes(q) ||
            m.brand?.toLowerCase().includes(q)
        );
      }

      return { data: models, error: null };
    } catch (err) {
      console.error('Fetch phone models error:', err);
      return { data: [], error: err };
    }
  },

  async getBrands() {
    const { data } = await this.getPhoneModels();
    const brands = Array.from(new Set((data || []).map((m) => m.brand))).filter(Boolean);
    return { data: brands, error: null };
  },

  async getPhoneModelById(id) {
    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('phone_models')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return { data, error: null };
    } catch (err) {}

    // 2. Fallback
    const { data } = await this.getPhoneModels();
    const model = (data || []).find((m) => m.id === id);
    if (!model) return { data: null, error: { message: 'Phone model not found' } };
    return { data: model, error: null };
  }
};
