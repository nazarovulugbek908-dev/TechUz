import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePhoneModel } from '../context/PhoneModelContext';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';
import { formatUzbekCurrency } from '../utils/currency';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { Drawer } from '../components/common/Drawer';
import { EmptyState } from '../components/feedback/EmptyState';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Grid,
  List,
  Smartphone,
  Check,
  RefreshCw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import clsx from 'clsx';

export function ShopPage() {
  const { t, language, isUz } = useLanguage();
  const { selectedModel, hasSelectedModel, selectedModelId } = usePhoneModel();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Params
  const categoryParam = searchParams.get('category') || 'all';
  const brandParam = searchParams.get('brand') || 'all';
  const searchParam = searchParams.get('search') || searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'popular';
  const inStockParam = searchParams.get('inStock') === 'true';
  const onSaleParam = searchParams.get('onSale') === 'true';
  const compatibleOnlyParam = searchParams.get('compatibleOnly') === 'true';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';

  // Local state for filter inputs
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Local price input state (debounced)
  const [minPriceInput, setMinPriceInput] = useState(minPriceParam);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam);

  // Load Categories & Brands
  useEffect(() => {
    async function loadMeta() {
      try {
        const [{ data: cats }, { data: brs }] = await Promise.all([
          categoryService.getCategories(),
          brandService.getBrands()
        ]);
        setCategories(cats || []);
        setBrands(brs || []);
      } catch (err) {
        console.error('Failed to load shop metadata:', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch Products matching filters
  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        const { data } = await productService.getProducts({
          category: categoryParam !== 'all' ? categoryParam : null,
          brand: brandParam !== 'all' ? brandParam : null,
          search: searchParam,
          sort: sortParam,
          inStockOnly: inStockParam,
          onSaleOnly: onSaleParam,
          minPrice: minPriceParam ? Number(minPriceParam) : null,
          maxPrice: maxPriceParam ? Number(maxPriceParam) : null,
          phoneModel: selectedModelId
        });

        let result = data || [];

        // If compatible only filter is toggled and a model is picked
        if (compatibleOnlyParam && selectedModelId) {
          result = result.filter(
            (p) =>
              p.category === 'smartphones' ||
              (Array.isArray(p.compatibleModels) && p.compatibleModels.includes(selectedModelId))
          );
        }

        setProducts(result);
      } catch (err) {
        console.error('Failed to fetch catalog:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalog();
  }, [
    categoryParam,
    brandParam,
    searchParam,
    sortParam,
    inStockParam,
    onSaleParam,
    compatibleOnlyParam,
    minPriceParam,
    maxPriceParam,
    selectedModelId
  ]);

  // Update query params helper
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'all' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    setSearchParams(newParams);
  };

  const handleApplyPrice = () => {
    const newParams = new URLSearchParams(searchParams);
    if (minPriceInput) newParams.set('minPrice', minPriceInput);
    else newParams.delete('minPrice');

    if (maxPriceInput) newParams.set('maxPrice', maxPriceInput);
    else newParams.delete('maxPrice');

    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams(new URLSearchParams());
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (categoryParam !== 'all') count++;
    if (brandParam !== 'all') count++;
    if (searchParam) count++;
    if (inStockParam) count++;
    if (onSaleParam) count++;
    if (compatibleOnlyParam) count++;
    if (minPriceParam || maxPriceParam) count++;
    return count;
  }, [
    categoryParam,
    brandParam,
    searchParam,
    inStockParam,
    onSaleParam,
    compatibleOnlyParam,
    minPriceParam,
    maxPriceParam
  ]);

  // Category counts
  const getCategoryCount = (slug) => {
    if (slug === 'all') return products.length;
    return categories.find((c) => c.slug === slug || c.id === slug)?.count || 0;
  };

  // Resolve Category Title
  const currentCategoryName = useMemo(() => {
    if (categoryParam === 'all') return t('nav.shop');
    const matched = categories.find((c) => c.slug === categoryParam || c.id === categoryParam);
    if (matched) return language === 'ru' ? matched.name_ru : matched.name_uz;
    return categoryParam;
  }, [categoryParam, categories, language, t]);

  // Sidebar Filter Content component (used in desktop and mobile drawer)
  const FilterContent = (
    <div className="space-y-6 text-xs">
      {/* Search Input inside filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          {t('catalog.filter_by')} / {t('placeholder.search_query')}
        </label>
        <Input
          placeholder={t('nav.search_placeholder')}
          value={searchParam}
          onChange={(e) => updateFilter('search', e.target.value)}
          icon={Search}
        />
      </div>

      {/* "My Phone Model" Compatibility Filter */}
      {hasSelectedModel && (
        <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#FF7A00]" />
              <span className="font-bold text-slate-900 dark:text-white">
                {selectedModel?.name}
              </span>
            </div>
            <Badge variant="primary" size="sm">
              {t('phone_model.compatible_match')}
            </Badge>
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={compatibleOnlyParam}
              onChange={(e) => updateFilter('compatibleOnly', e.target.checked)}
              className="rounded border-slate-300 text-[#FF7A00] focus:ring-[#FF7A00]"
            />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {t('phone_model.compatible_only')}
            </span>
          </label>
        </div>
      )}

      {/* Categories Filter */}
      <div className="space-y-2.5">
        <h3 className="font-bold font-heading text-sm text-slate-900 dark:text-white">
          {t('catalog.category')}
        </h3>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => updateFilter('category', 'all')}
            className={clsx(
              'w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors font-bold',
              categoryParam === 'all'
                ? 'bg-[#FF7A00] text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <span>{t('placeholder.all_categories_label')}</span>
            {categoryParam === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>

          {categories.map((cat) => {
            const isSelected = categoryParam === (cat.slug || cat.id);
            const label = language === 'ru' ? cat.name_ru : cat.name_uz;
            return (
              <button
                type="button"
                key={cat.id || cat.slug}
                onClick={() => updateFilter('category', cat.slug || cat.id)}
                className={clsx(
                  'w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors font-bold',
                  isSelected
                    ? 'bg-[#FF7A00] text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <span>{label}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h3 className="font-bold font-heading text-sm text-slate-900 dark:text-white">
          {t('catalog.brand')}
        </h3>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => updateFilter('brand', 'all')}
            className={clsx(
              'w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors font-bold',
              brandParam === 'all'
                ? 'bg-[#FF7A00] text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <span>{t('admin.all_brands_filter')}</span>
            {brandParam === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>

          {brands.map((b) => {
            const isSelected = brandParam.toLowerCase() === b.name.toLowerCase();
            return (
              <button
                type="button"
                key={b.id || b.name}
                onClick={() => updateFilter('brand', isSelected ? 'all' : b.name)}
                className={clsx(
                  'w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors font-bold',
                  isSelected
                    ? 'bg-[#FF7A00] text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <span>{b.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <h3 className="font-bold font-heading text-sm text-slate-900 dark:text-white">
          {t('catalog.price_range')} (UZS)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="xs"
          onClick={handleApplyPrice}
          className="w-full font-bold"
        >
          {t('common.save')}
        </Button>
      </div>

      {/* Toggles (In Stock & On Sale) */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockParam}
            onChange={(e) => updateFilter('inStock', e.target.checked)}
            className="rounded border-slate-300 text-[#FF7A00] focus:ring-[#FF7A00]"
          />
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {t('catalog.in_stock')}
          </span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={onSaleParam}
            onChange={(e) => updateFilter('onSale', e.target.checked)}
            className="rounded border-slate-300 text-[#FF7A00] focus:ring-[#FF7A00]"
          />
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {t('nav.sales_deals')}
          </span>
        </label>
      </div>

      {/* Reset button */}
      {activeFiltersCount > 0 && (
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            icon={RefreshCw}
            className="w-full text-slate-500 hover:text-[#FF7A00]"
          >
            {t('catalog.clear_filters')} ({activeFiltersCount})
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          {t('nav.home')}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-bold">
          {currentCategoryName}
        </span>
      </div>

      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-orange-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            {currentCategoryName}
          </h1>
          <p className="text-xs text-orange-100">
            {products.length} {t('catalog.products_found')}
          </p>
        </div>

        {/* Mobile Filter Trigger */}
        <div className="lg:hidden flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            icon={Filter}
            onClick={() => setMobileFilterOpen(true)}
            className="bg-white text-slate-900 font-bold hover:bg-slate-100 shadow-md"
          >
            {t('catalog.filter_by')} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-bold">{t('catalog.filter_by')}:</span>
          {categoryParam !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF7A00] border border-orange-200 dark:border-orange-900 font-bold">
              {currentCategoryName}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  updateFilter('category', 'all');
                }}
                className="hover:opacity-75 cursor-pointer"
                aria-label="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {brandParam !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF7A00] border border-orange-200 dark:border-orange-900 font-bold">
              {brandParam}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  updateFilter('brand', 'all');
                }}
                className="hover:opacity-75 cursor-pointer"
                aria-label="Remove brand filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF7A00] border border-orange-200 dark:border-orange-900 font-bold">
              "{searchParam}"
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  updateFilter('search', '');
                }}
                className="hover:opacity-75 cursor-pointer"
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {inStockParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF7A00] border border-orange-200 dark:border-orange-900 font-bold">
              {t('catalog.in_stock')}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  updateFilter('inStock', false);
                }}
                className="hover:opacity-75 cursor-pointer"
                aria-label="Remove inStock filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {onSaleParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF7A00] border border-orange-200 dark:border-orange-900 font-bold">
              {t('nav.sales_deals')}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  updateFilter('onSale', false);
                }}
                className="hover:opacity-75 cursor-pointer"
                aria-label="Remove onSale filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleResetFilters();
            }}
            className="text-xs text-slate-500 hover:text-[#FF7A00] underline font-bold ml-1 cursor-pointer"
          >
            {t('catalog.clear_filters')}
          </button>
        </div>
      )}

      {/* Main Content Layout (Sidebar + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Left Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF7A00]" />
                {t('catalog.filter_by')}
              </h2>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#FF7A00] text-white text-[11px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {FilterContent}
          </Card>
        </div>

        {/* Right Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Controls Toolbar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-500 font-bold">
              {products.length} {t('catalog.products_found')}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              {/* Sort Select */}
              <div className="flex items-center gap-2 text-xs flex-1 sm:flex-initial">
                <span className="text-slate-400 hidden md:inline">{t('catalog.sort_by')}:</span>
                <Select
                  value={sortParam}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  options={[
                    { value: 'popular', label: t('catalog.sort_popular') },
                    { value: 'newest', label: t('catalog.sort_newest') },
                    { value: 'price_asc', label: t('catalog.sort_price_asc') },
                    { value: 'price_desc', label: t('catalog.sort_price_desc') }
                  ]}
                  className="w-full sm:w-44 text-xs font-bold"
                />
              </div>

              {/* View Toggle (Grid / List) */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={clsx(
                    'p-1.5 rounded-lg transition-colors cursor-pointer',
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-[#FF7A00] shadow-xs'
                      : 'text-slate-400 hover:text-slate-600'
                  )}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={clsx(
                    'p-1.5 rounded-lg transition-colors cursor-pointer',
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-700 text-[#FF7A00] shadow-xs'
                      : 'text-slate-400 hover:text-slate-600'
                  )}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid / List Content */}
          {loading ? (
            <div className="py-24 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <Card className="p-12 border-slate-200/80 dark:border-slate-800 text-center">
              <EmptyState
                title={t('catalog.no_products')}
                description={t('catalog.no_products_desc')}
                icon={ShoppingBag}
                actionLabel={t('catalog.clear_filters')}
                onAction={handleResetFilters}
              />
            </Card>
          ) : (
            <div
              className={clsx(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                  : 'space-y-4'
              )}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title={t('catalog.filter_by')}
        position="left"
      >
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          {FilterContent}
        </div>
      </Drawer>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
