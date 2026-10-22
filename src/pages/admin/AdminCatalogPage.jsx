import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import { phoneModelService } from '../../services/phoneModelService';
import { productService } from '../../services/productService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/feedback/Alert';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import {
  FolderTree,
  Building2,
  Smartphone,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';

export function AdminCatalogPage() {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab: 'categories' | 'brands' | 'models'
  const activeTab = searchParams.get('tab') || 'categories';
  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  // Data states
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Search & Filter for Models tab
  const [modelSearch, setModelSearch] = useState('');
  const [modelSelectedBrand, setModelSelectedBrand] = useState('all');

  // Search filter for Categories & Brands
  const [categorySearch, setCategorySearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catNameUz, setCatNameUz] = useState('');
  const [catNameRu, setCatNameRu] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Brand Modal State
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [brandSlug, setBrandSlug] = useState('');
  const [brandToDelete, setBrandToDelete] = useState(null);

  // Phone Model Modal State
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [modelBrand, setModelBrand] = useState('Apple');
  const [modelName, setModelName] = useState('');
  const [modelSlugVal, setModelSlugVal] = useState('');
  const [modelReleaseYear, setModelReleaseYear] = useState('2024');
  const [modelPopular, setModelPopular] = useState(true);
  const [modelToDelete, setModelToDelete] = useState(null);

  // Load all catalog data
  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: cats }, { data: brs }, { data: mods }, { data: prods }] = await Promise.all([
        categoryService.getCategories(),
        brandService.getBrands(),
        phoneModelService.getPhoneModels(),
        productService.getProducts()
      ]);
      setCategories(cats || []);
      setBrands(brs || []);
      setModels(mods || []);
      setProducts(prods || []);
    } catch (err) {
      console.error('Failed to load catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  /* ================= CATEGORY HANDLERS ================= */
  const openCreateCategory = () => {
    setEditingCategory(null);
    setCatNameUz('');
    setCatNameRu('');
    setCatSlug('');
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (cat) => {
    setEditingCategory(cat);
    setCatNameUz(cat.name_uz || cat.nameUz || '');
    setCatNameRu(cat.name_ru || cat.nameRu || '');
    setCatSlug(cat.slug || cat.id || '');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catNameUz.trim() || !catNameRu.trim()) return;
    setSaving(true);
    const slug = catSlug.trim() || catNameUz.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      await categoryService.updateCategory(editingCategory.id || editingCategory.slug, {
        name_uz: catNameUz,
        name_ru: catNameRu,
        slug
      });
      showFeedback(t('admin.category_updated_success'));
    } else {
      await categoryService.createCategory({
        name_uz: catNameUz,
        name_ru: catNameRu,
        slug
      });
      showFeedback(t('admin.category_created_success'));
    }

    setSaving(false);
    setIsCategoryModalOpen(false);
    await loadData();
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!categoryToDelete) return;
    await categoryService.deleteCategory(categoryToDelete.id || categoryToDelete.slug);
    setCategoryToDelete(null);
    showFeedback(t('admin.category_deleted_success'));
    await loadData();
  };

  const getCategoryProductCount = (slugVal) => {
    return products.filter((p) => p.category?.toLowerCase() === slugVal?.toLowerCase()).length;
  };

  /* ================= BRAND HANDLERS ================= */
  const openCreateBrand = () => {
    setEditingBrand(null);
    setBrandName('');
    setBrandSlug('');
    setIsBrandModalOpen(true);
  };

  const openEditBrand = (b) => {
    setEditingBrand(b);
    setBrandName(b.name);
    setBrandSlug(b.slug || b.id || '');
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    setSaving(true);
    const slug = brandSlug.trim() || brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingBrand) {
      await brandService.updateBrand(editingBrand.id || editingBrand.slug, {
        name: brandName,
        slug
      });
      showFeedback(t('admin.brand_updated_success'));
    } else {
      await brandService.createBrand({
        name: brandName,
        slug
      });
      showFeedback(t('admin.brand_created_success'));
    }

    setSaving(false);
    setIsBrandModalOpen(false);
    await loadData();
  };

  const handleDeleteBrandConfirm = async () => {
    if (!brandToDelete) return;
    await brandService.deleteBrand(brandToDelete.id || brandToDelete.slug);
    setBrandToDelete(null);
    showFeedback(t('admin.brand_deleted_success'));
    await loadData();
  };

  const getBrandProductCount = (nameVal) => {
    return products.filter((p) => p.brand?.toLowerCase() === nameVal?.toLowerCase()).length;
  };

  /* ================= PHONE MODEL HANDLERS ================= */
  const openCreateModel = () => {
    setEditingModel(null);
    setModelBrand(brands[0]?.name || 'Apple');
    setModelName('');
    setModelSlugVal('');
    setModelReleaseYear(String(new Date().getFullYear()));
    setModelPopular(true);
    setIsModelModalOpen(true);
  };

  const openEditModel = (m) => {
    setEditingModel(m);
    setModelBrand(m.brand || 'Apple');
    setModelName(m.name);
    setModelSlugVal(m.id || m.slug || '');
    setModelReleaseYear(String(m.releaseYear || new Date().getFullYear()));
    setModelPopular(!!m.popular);
    setIsModelModalOpen(true);
  };

  const handleSaveModel = async (e) => {
    e.preventDefault();
    if (!modelName.trim()) return;
    setSaving(true);
    const slug = modelSlugVal.trim() || modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingModel) {
      await phoneModelService.updatePhoneModel(editingModel.id, {
        brand: modelBrand,
        name: modelName,
        slug,
        releaseYear: Number(modelReleaseYear),
        popular: modelPopular
      });
      showFeedback(t('admin.model_updated_success'));
    } else {
      await phoneModelService.createPhoneModel({
        brand: modelBrand,
        name: modelName,
        slug,
        releaseYear: Number(modelReleaseYear),
        popular: modelPopular
      });
      showFeedback(t('admin.model_created_success'));
    }

    setSaving(false);
    setIsModelModalOpen(false);
    await loadData();
  };

  const handleDeleteModelConfirm = async () => {
    if (!modelToDelete) return;
    await phoneModelService.deletePhoneModel(modelToDelete.id);
    setModelToDelete(null);
    showFeedback(t('admin.model_deleted_success'));
    await loadData();
  };

  /* ================= FILTERED LISTS ================= */
  const filteredCategories = categories.filter((c) => {
    if (!categorySearch.trim()) return true;
    const q = categorySearch.toLowerCase();
    return (
      (c.name_uz || c.nameUz || '').toLowerCase().includes(q) ||
      (c.name_ru || c.nameRu || '').toLowerCase().includes(q) ||
      (c.slug || '').toLowerCase().includes(q)
    );
  });

  const filteredBrands = brands.filter((b) => {
    if (!brandSearch.trim()) return true;
    const q = brandSearch.toLowerCase();
    return (b.name || '').toLowerCase().includes(q) || (b.slug || '').toLowerCase().includes(q);
  });

  const filteredModels = models.filter((m) => {
    if (modelSearch.trim()) {
      const q = modelSearch.toLowerCase();
      if (!m.name?.toLowerCase().includes(q) && !m.brand?.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (modelSelectedBrand !== 'all' && m.brand?.toLowerCase() !== modelSelectedBrand.toLowerCase()) {
      return false;
    }
    return true;
  });

  const tabsConfig = [
    {
      id: 'categories',
      label: t('admin.tab_categories') || t('admin.nav_categories'),
      count: categories.length,
      icon: FolderTree,
      badgeColor: 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
    },
    {
      id: 'brands',
      label: t('admin.tab_brands') || t('admin.nav_brands'),
      count: brands.length,
      icon: Building2,
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    },
    {
      id: 'models',
      label: t('admin.tab_phone_models') || t('admin.nav_phone_models'),
      count: models.length,
      icon: Smartphone,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    }
  ];

  return (
    <div className="space-y-6 pt-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E8EE] dark:border-[#2A2E3B]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859] flex items-center justify-center shadow-2xs">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#17191F] dark:text-white tracking-tight">
                {t('admin.catalog_title')}
              </h1>
              <p className="text-xs text-[#737985] dark:text-[#9CA3AF] mt-0.5">
                {t('admin.catalog_subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button depends on active tab */}
        <div>
          {activeTab === 'categories' && (
            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
              onClick={openCreateCategory}
              className="font-bold shadow-xs"
            >
              {t('admin.add_category_btn')}
            </Button>
          )}
          {activeTab === 'brands' && (
            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
              onClick={openCreateBrand}
              className="font-bold shadow-xs"
            >
              {t('admin.add_brand_btn')}
            </Button>
          )}
          {activeTab === 'models' && (
            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
              onClick={openCreateModel}
              className="font-bold shadow-xs"
            >
              {t('admin.add_model_btn')}
            </Button>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <Alert variant="success" title={t('common.success')}>
          {feedbackMsg}
        </Alert>
      )}

      {/* Modern Segmented Pill Tabs Navigation */}
      <div className="inline-flex items-center gap-1.5 p-1.5 bg-[#F4F6F8] dark:bg-[#1A1D24] border border-[#E6E8EE] dark:border-[#2A2E3B] rounded-2xl overflow-x-auto max-w-full">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap select-none',
                isActive
                  ? 'bg-white dark:bg-[#15171D] text-[#17191F] dark:text-white shadow-xs font-bold border border-gray-200/60 dark:border-[#2A2E3B]'
                  : 'text-[#737985] hover:text-[#17191F] dark:hover:text-white hover:bg-white/50'
              )}
            >
              <Icon className={clsx('w-4 h-4', isActive ? 'text-[#00A859]' : 'text-[#737985]')} />
              <span>{tab.label}</span>
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors',
                  isActive
                    ? 'bg-[#E6F7EF] dark:bg-[#00A859]/20 text-[#00A859]'
                    : 'bg-gray-200/70 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* ================= TAB 1: CATEGORIES ================= */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              {/* Category Search Filter */}
              {categories.length > 0 && (
                <div className="max-w-md">
                  <Input
                    placeholder={t('admin.search_categories_placeholder')}
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    icon={Search}
                  />
                </div>
              )}

              <Card className="p-0 border-gray-150 dark:border-[#2A2E3B] rounded-2xl overflow-hidden shadow-2xs">
                {categories.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859] flex items-center justify-center shadow-xs">
                      <FolderTree className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {language === 'ru' ? 'Категории еще не добавлены' : 'Kategoriyalar hali qo‘shilmagan'}
                      </h3>
                      <p className="text-xs text-gray-500 max-w-sm">
                        {language === 'ru'
                          ? 'Создайте первую категорию товаров, чтобы начать наполнение каталога магазина'
                          : 'Mahsulotlar katalogini shakllantirish uchun birinchi kategoriyani qo‘shing'}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={PlusCircle}
                      onClick={openCreateCategory}
                      className="font-bold shadow-xs mt-2"
                    >
                      {t('admin.add_category_btn')}
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8F9FA] dark:bg-[#15171D] text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b border-gray-150 dark:border-[#2A2E3B]">
                        <tr>
                          <th className="py-3 px-4">{t('admin.category_name_col') || t('admin.category_col')}</th>
                          <th className="py-3 px-4">{t('admin.slug_label')}</th>
                          <th className="py-3 px-4">{t('admin.products_count_col')}</th>
                          <th className="py-3 px-4 text-right">{t('admin.actions_col')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-[#2A2E3B] font-medium">
                        {filteredCategories.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-gray-400">
                              {t('admin.categories_not_found')}
                            </td>
                          </tr>
                        ) : (
                          filteredCategories.map((cat) => {
                            const count = getCategoryProductCount(cat.slug || cat.id);
                            return (
                              <tr
                                key={cat.id || cat.slug}
                                className="hover:bg-emerald-50/30 dark:hover:bg-[#1E212B] transition-colors"
                              >
                                <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                                  {language === 'ru' ? (cat.name_ru || cat.nameRu) : (cat.name_uz || cat.nameUz)}
                                </td>
                                <td className="py-3 px-4 font-mono text-[11px] text-gray-400">
                                  {cat.slug || cat.id}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#E6F7EF] dark:bg-[#00A859]/20 text-[#00A859] font-bold text-[11px] border border-[#00A859]/20">
                                    {count} {t('common.items_short')}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => openEditCategory(cat)}
                                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#E6F7EF] text-gray-600 hover:text-[#00A859] flex items-center justify-center transition-colors cursor-pointer"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setCategoryToDelete(cat)}
                                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ================= TAB 2: BRANDS ================= */}
          {activeTab === 'brands' && (
            <div className="space-y-4">
              {/* Brand Search Filter */}
              {brands.length > 0 && (
                <div className="max-w-md">
                  <Input
                    placeholder={t('admin.search_brands_placeholder')}
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    icon={Search}
                  />
                </div>
              )}

              <Card className="p-0 border-gray-150 dark:border-[#2A2E3B] rounded-2xl overflow-hidden shadow-2xs">
                {brands.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859] flex items-center justify-center shadow-xs">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {language === 'ru' ? 'Бренды еще не добавлены' : 'Brendlar hali qo‘shilmagan'}
                      </h3>
                      <p className="text-xs text-gray-500 max-w-sm">
                        {language === 'ru'
                          ? 'Добавьте бренды производителей для удобной фильтрации товаров'
                          : 'Mahsulotlar filtratsiyasi uchun birinchi brendni qo‘shing'}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={PlusCircle}
                      onClick={openCreateBrand}
                      className="font-bold shadow-xs mt-2"
                    >
                      {t('admin.add_brand_btn')}
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8F9FA] dark:bg-[#15171D] text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b border-gray-150 dark:border-[#2A2E3B]">
                        <tr>
                          <th className="py-3 px-4">{t('admin.brand_name_col')}</th>
                          <th className="py-3 px-4">{t('admin.slug_label')}</th>
                          <th className="py-3 px-4">{t('admin.products_count_col')}</th>
                          <th className="py-3 px-4 text-right">{t('admin.actions_col')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-[#2A2E3B] font-medium">
                        {filteredBrands.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-gray-400">
                              {t('admin.brands_not_found')}
                            </td>
                          </tr>
                        ) : (
                          filteredBrands.map((b) => {
                            const count = getBrandProductCount(b.name);
                            return (
                              <tr
                                key={b.id || b.slug || b.name}
                                className="hover:bg-emerald-50/30 dark:hover:bg-[#1E212B] transition-colors"
                              >
                                <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                                  {b.name}
                                </td>
                                <td className="py-3 px-4 font-mono text-[11px] text-gray-400">
                                  {b.slug || b.id}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-[11px] border border-blue-200 dark:border-blue-900">
                                    {count} {t('common.items_short')}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => openEditBrand(b)}
                                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#E6F7EF] text-gray-600 hover:text-[#00A859] flex items-center justify-center transition-colors cursor-pointer"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setBrandToDelete(b)}
                                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ================= TAB 3: PHONE MODELS ================= */}
          {activeTab === 'models' && (
            <div className="space-y-4">
              {/* Models Search & Filter */}
              {models.length > 0 && (
                <Card className="p-4 border-gray-150 dark:border-[#2A2E3B] rounded-2xl shadow-2xs space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder={t('admin.search_models_placeholder')}
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      icon={Search}
                    />

                    <Select
                      value={modelSelectedBrand}
                      onChange={(e) => setModelSelectedBrand(e.target.value)}
                      options={[
                        { value: 'all', label: t('admin.all_brands_filter') },
                        ...brands.map((b) => ({ value: b.name, label: b.name }))
                      ]}
                    />
                  </div>
                </Card>
              )}

              <Card className="p-0 border-gray-150 dark:border-[#2A2E3B] rounded-2xl overflow-hidden shadow-2xs">
                {models.length === 0 ? (
                  <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859] flex items-center justify-center shadow-xs">
                      <Smartphone className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {language === 'ru' ? 'Модели телефонов еще не добавлены' : 'Telefon modellari hali qo‘shilmagan'}
                      </h3>
                      <p className="text-xs text-gray-500 max-w-sm">
                        {language === 'ru'
                          ? 'Добавьте поддерживаемые модели телефонов для фильтрации совместимости чехлов и стекол'
                          : 'G‘ilof va oynalar mosligini tekshirish uchun telefon modellarini qo‘shing'}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={PlusCircle}
                      onClick={openCreateModel}
                      className="font-bold shadow-xs mt-2"
                    >
                      {t('admin.add_model_btn')}
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8F9FA] dark:bg-[#15171D] text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b border-gray-150 dark:border-[#2A2E3B]">
                        <tr>
                          <th className="py-3 px-4">{t('admin.brand_col')}</th>
                          <th className="py-3 px-4">{t('admin.model_name_col')}</th>
                          <th className="py-3 px-4">{t('admin.slug_label')}</th>
                          <th className="py-3 px-4">{t('admin.release_year_col')}</th>
                          <th className="py-3 px-4">{t('admin.badges_col')}</th>
                          <th className="py-3 px-4 text-right">{t('admin.actions_col')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-[#2A2E3B] font-medium">
                        {filteredModels.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="py-8 text-center text-gray-400">
                              {t('admin.models_not_found')}
                            </td>
                          </tr>
                        ) : (
                          filteredModels.map((m) => (
                            <tr
                              key={m.id}
                              className="hover:bg-emerald-50/30 dark:hover:bg-[#1E212B] transition-colors"
                            >
                              <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                                {m.brand}
                              </td>
                              <td className="py-3 px-4 font-bold text-gray-800 dark:text-gray-200">
                                {m.name}
                              </td>
                              <td className="py-3 px-4 font-mono text-[11px] text-gray-400">
                                {m.id}
                              </td>
                              <td className="py-3 px-4 text-gray-500">
                                {m.releaseYear || m.release_year || '—'}
                              </td>
                              <td className="py-3 px-4">
                                {Boolean(m.popular) && (
                                  <span className="px-2 py-0.5 rounded-md bg-[#E6F7EF] dark:bg-[#00A859]/20 text-[#00A859] font-bold text-[10px]">
                                    {t('admin.popular_badge')}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditModel(m)}
                                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-[#E6F7EF] text-gray-600 hover:text-[#00A859] flex items-center justify-center transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setModelToDelete(m)}
                                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )}
        </>
      )}

      {/* ================= MODALS ================= */}

      {/* Category Create/Edit Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? t('admin.edit_category_title') : t('admin.new_category_title')}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
          {language === 'ru' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('admin.category_name_ru_col')} *
                </label>
                <Input
                  value={catNameRu}
                  onChange={(e) => {
                    setCatNameRu(e.target.value);
                    if (!editingCategory && !catSlug) {
                      setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder={t('admin.sample_category_covers_ru')}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('admin.category_name_uz_col')} *
                </label>
                <Input
                  value={catNameUz}
                  onChange={(e) => setCatNameUz(e.target.value)}
                  placeholder="G'iloflar va Chexollar"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('admin.category_name_uz_col')} *
                </label>
                <Input
                  value={catNameUz}
                  onChange={(e) => {
                    setCatNameUz(e.target.value);
                    if (!editingCategory && !catSlug) {
                      setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="G'iloflar"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('admin.category_name_ru_col')} *
                </label>
                <Input
                  value={catNameRu}
                  onChange={(e) => setCatNameRu(e.target.value)}
                  placeholder={t('admin.sample_category_cases_ru')}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.slug_label')}
            </label>
            <Input
              value={catSlug}
              onChange={(e) => setCatSlug(e.target.value)}
              placeholder="cases"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsCategoryModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={saving}>
              {saving ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Category Delete Confirm Modal */}
      <Modal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        title={t('admin.confirm_delete_title')}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            {t('admin.confirm_delete_category_msg')}{' '}
            <strong>
              {categoryToDelete && (language === 'ru' ? categoryToDelete.name_ru : categoryToDelete.name_uz)}
            </strong>?
          </p>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setCategoryToDelete(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeleteCategoryConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t('admin.delete_btn')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Brand Create/Edit Modal */}
      <Modal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        title={editingBrand ? t('admin.edit_brand_title') : t('admin.new_brand_title')}
      >
        <form onSubmit={handleSaveBrand} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.brand_name_col')} *
            </label>
            <Input
              value={brandName}
              onChange={(e) => {
                setBrandName(e.target.value);
                if (!editingBrand && !brandSlug) {
                  setBrandSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }
              }}
              placeholder="Apple"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.slug_label')}
            </label>
            <Input
              value={brandSlug}
              onChange={(e) => setBrandSlug(e.target.value)}
              placeholder="apple"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsBrandModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={saving}>
              {saving ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Brand Delete Confirm Modal */}
      <Modal
        isOpen={!!brandToDelete}
        onClose={() => setBrandToDelete(null)}
        title={t('admin.confirm_delete_title')}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            {t('admin.confirm_delete_brand_msg')} <strong>{brandToDelete?.name}</strong>?
          </p>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setBrandToDelete(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeleteBrandConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t('admin.delete_btn')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Model Create/Edit Modal */}
      <Modal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        title={editingModel ? t('admin.edit_model_title') : t('admin.new_model_title')}
      >
        <form onSubmit={handleSaveModel} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.brand_col')} *
            </label>
            <Select
              value={modelBrand}
              onChange={(e) => setModelBrand(e.target.value)}
              options={brands.map((b) => ({ value: b.name, label: b.name }))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.model_name_col')} *
            </label>
            <Input
              value={modelName}
              onChange={(e) => {
                setModelName(e.target.value);
                if (!editingModel && !modelSlugVal) {
                  setModelSlugVal(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }
              }}
              placeholder="iPhone 16 Pro"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.slug_label')}
            </label>
            <Input
              value={modelSlugVal}
              onChange={(e) => setModelSlugVal(e.target.value)}
              placeholder="iphone-16-pro"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('admin.release_year_col')}
              </label>
              <Input
                type="number"
                value={modelReleaseYear}
                onChange={(e) => setModelReleaseYear(e.target.value)}
                placeholder="2024"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modelPopular}
                  onChange={(e) => setModelPopular(e.target.checked)}
                  className="rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {t('admin.popular_flag')}
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModelModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={saving}>
              {saving ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Model Delete Confirm Modal */}
      <Modal
        isOpen={!!modelToDelete}
        onClose={() => setModelToDelete(null)}
        title={t('admin.confirm_delete_title')}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            {t('admin.confirm_delete_model_msg')} <strong>{modelToDelete?.name}</strong>?
          </p>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setModelToDelete(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeleteModelConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t('admin.delete_btn')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
