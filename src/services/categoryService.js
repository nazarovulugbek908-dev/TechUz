import { mockCategories } from '../data/mockCategories';
import { storage } from '../utils/storage';

const CATEGORIES_STORAGE_KEY = 'techuz_mock_categories';

function getStoredCategories() {
  const categories = storage.get(CATEGORIES_STORAGE_KEY, null);
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    storage.set(CATEGORIES_STORAGE_KEY, mockCategories);
    return mockCategories;
  }
  return categories;
}

export const categoryService = {
  async getCategories() {
    const list = getStoredCategories();
    return { data: list, error: null };
  },

  async createCategory(catData) {
    const list = getStoredCategories();
    const newCategory = {
      id: catData.slug || `cat-${Date.now()}`,
      slug: catData.slug || `cat-${Date.now()}`,
      name_uz: catData.name_uz || catData.nameUz,
      name_ru: catData.name_ru || catData.nameRu,
      icon: catData.icon || 'Folder',
      count: 0,
      badge: catData.badge || null,
      active: catData.active !== undefined ? catData.active : true
    };
    const updated = [...list, newCategory];
    storage.set(CATEGORIES_STORAGE_KEY, updated);
    return { data: newCategory, error: null };
  },

  async updateCategory(id, updates) {
    const list = getStoredCategories();
    const idx = list.findIndex((c) => c.id === id || c.slug === id);
    if (idx === -1) return { data: null, error: { message: 'Category not found' } };

    list[idx] = { ...list[idx], ...updates };
    storage.set(CATEGORIES_STORAGE_KEY, list);
    return { data: list[idx], error: null };
  },

  async deleteCategory(id) {
    const list = getStoredCategories();
    const updated = list.filter((c) => c.id !== id && c.slug !== id);
    storage.set(CATEGORIES_STORAGE_KEY, updated);
    return { error: null };
  }
};
