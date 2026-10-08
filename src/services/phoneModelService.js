import { mockPhoneModels } from '../data/mockPhoneModels';
import { storage } from '../utils/storage';

const PHONE_MODELS_STORAGE_KEY = 'techuz_mock_phone_models';

function getStoredPhoneModels() {
  const models = storage.get(PHONE_MODELS_STORAGE_KEY, null);
  if (!models || !Array.isArray(models) || models.length === 0) {
    storage.set(PHONE_MODELS_STORAGE_KEY, mockPhoneModels);
    return mockPhoneModels;
  }
  return models;
}

export const phoneModelService = {
  /**
   * Get all phone models, optionally grouped by brand or filtered by search
   */
  async getPhoneModels({ search = '', brand = null } = {}) {
    let models = [...getStoredPhoneModels()];

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

    return {
      data: models,
      error: null
    };
  },

  /**
   * Get unique brands list
   */
  async getBrands() {
    const list = getStoredPhoneModels();
    const brands = Array.from(new Set(list.map((m) => m.brand)));
    return {
      data: brands,
      error: null
    };
  },

  /**
   * Get single model by ID
   */
  async getPhoneModelById(id) {
    const list = getStoredPhoneModels();
    const model = list.find((m) => m.id === id);
    if (!model) {
      return { data: null, error: { message: 'Phone model not found' } };
    }
    return { data: model, error: null };
  },

  /**
   * Create new phone model (Admin CRUD)
   */
  async createPhoneModel(modelData) {
    const list = getStoredPhoneModels();
    const newModel = {
      id: modelData.slug || modelData.id || modelData.name.toLowerCase().replace(/\s+/g, '-'),
      name: modelData.name,
      brand: modelData.brand || 'Apple',
      releaseYear: Number(modelData.releaseYear) || new Date().getFullYear(),
      popular: !!modelData.popular,
      active: modelData.active !== undefined ? modelData.active : true
    };
    const updated = [newModel, ...list];
    storage.set(PHONE_MODELS_STORAGE_KEY, updated);
    return { data: newModel, error: null };
  },

  /**
   * Update phone model (Admin CRUD)
   */
  async updatePhoneModel(id, updates) {
    const list = getStoredPhoneModels();
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) return { data: null, error: { message: 'Phone model not found' } };

    list[idx] = { ...list[idx], ...updates };
    storage.set(PHONE_MODELS_STORAGE_KEY, list);
    return { data: list[idx], error: null };
  },

  /**
   * Delete phone model (Admin CRUD)
   */
  async deletePhoneModel(id) {
    const list = getStoredPhoneModels();
    const updated = list.filter((m) => m.id !== id);
    storage.set(PHONE_MODELS_STORAGE_KEY, updated);
    return { error: null };
  }
};
