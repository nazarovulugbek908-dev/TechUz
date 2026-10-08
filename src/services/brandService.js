import { mockBrands } from '../data/mockBrands';
import { storage } from '../utils/storage';

const BRANDS_STORAGE_KEY = 'techuz_mock_brands';

function getStoredBrands() {
  const brands = storage.get(BRANDS_STORAGE_KEY, null);
  if (!brands || !Array.isArray(brands) || brands.length === 0) {
    storage.set(BRANDS_STORAGE_KEY, mockBrands);
    return mockBrands;
  }
  return brands;
}

export const brandService = {
  async getBrands() {
    const list = getStoredBrands();
    return { data: list, error: null };
  },

  async createBrand(brandData) {
    const list = getStoredBrands();
    const newBrand = {
      id: brandData.slug || brandData.name.toLowerCase().replace(/\s+/g, '-'),
      name: brandData.name,
      slug: brandData.slug || brandData.name.toLowerCase().replace(/\s+/g, '-'),
      active: brandData.active !== undefined ? brandData.active : true
    };
    const updated = [...list, newBrand];
    storage.set(BRANDS_STORAGE_KEY, updated);
    return { data: newBrand, error: null };
  },

  async updateBrand(id, updates) {
    const list = getStoredBrands();
    const idx = list.findIndex((b) => b.id === id || b.slug === id);
    if (idx === -1) return { data: null, error: { message: 'Brand not found' } };

    list[idx] = { ...list[idx], ...updates };
    storage.set(BRANDS_STORAGE_KEY, list);
    return { data: list[idx], error: null };
  },

  async deleteBrand(id) {
    const list = getStoredBrands();
    const updated = list.filter((b) => b.id !== id && b.slug !== id);
    storage.set(BRANDS_STORAGE_KEY, updated);
    return { error: null };
  }
};
