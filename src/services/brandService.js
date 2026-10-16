import { supabase } from '../lib/supabase';

export const brandService = {
  async getBrands() {
    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        return { data, error: null };
      }
    } catch (err) {
      console.warn('Supabase getBrands fallback:', err);
    }

    // 2. Fallback to API
    try {
      const res = await fetch('/api/categories/meta/brands');
      if (!res.ok) throw new Error('Failed to load brands');
      const json = await res.json();
      return { data: json.data || [], error: null };
    } catch (err) {
      console.error('Fetch brands error:', err);
      return { data: [], error: err };
    }
  }
};
