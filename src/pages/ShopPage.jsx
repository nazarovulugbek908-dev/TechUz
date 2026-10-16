import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { usePhoneModel } from '../context/PhoneModelContext';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Drawer } from '../components/common/Drawer';
import { EmptyState } from '../components/feedback/EmptyState';
import { SkeletonCard } from '../components/feedback/LoadingSpinner';
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
  ShoppingBag
} from 'lucide-react';
import { cn } from '../utils/cn';

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

  // Local state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Local price input state
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

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'search' || key === 'q') {
      newParams.delete('q');
      newParams.delete('search');
    }
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

  const currentCategoryName = useMemo(() => {
    if (categoryParam === 'all') return t('nav.shop');
    const matched = categories.find((c) => c.slug === categoryParam || c.id === categoryParam);
    if (matched) return language === 'ru' ? matched.name_ru : matched.name_uz;
    return categoryParam;
  }, [categoryParam, categories, language, t]);

  const FilterContent = (
    <div className="space-y-5 text-xs">
      {/* Search Input inside filter */}
      <div>
        <label className="block text-xs font-semibold text-[#17191F] dark:text-[#F4F7FC] mb-1.5">
          {t('catalog.filter_by')}
        </label>
        <Input
          placeholder={t('nav.search_placeholder')}
          value={searchParam}
          onChange={(e) => updateFilter('search', e.target.value)}
          icon={Search}
        />
      </div>

      {/* Phone model compatibility filter */}
      {hasSelectedModel && (
        <div className="p-3 rounded-lg bg-[#F7F8FA] dark:bg-[#15171D] border border-[#E6E8EE] dark:border-[#2A2E3B] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#5B5BD6]" />
              <span className="font-semibold text-[#17191F] dark:text-white">
                {selectedModel?.name}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#16845B] bg-[#EAF6F0] px-1.5 py-0.5 rounded border border-[#CFEBDD]">
              {t('phone_model.compatible_match')}
            </span>
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={compatibleOnlyParam}
              onChange={(e) => updateFilter('compatibleOnly', e.target.checked)}
              className="rounded border-[#E6E8EE] text-[#5B5BD6] focus:ring-[#5B5BD6]"
            />
            <span className="font-medium text-[#17191F] dark:text-[#9CA3AF]">
              {t('phone_model.compatible_only')}
            </span>
          </label>
        </div>
      )}

      {/* Categories Filter */}
      <div className="space-y-2">
        <h3 className="font-semibold text-xs text-[#17191F] dark:text-[#F4F7FC] uppercase tracking-wider">
          {t('catalog.category')}
        </h3>
        <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => updateFilter('category', 'all')}
            className={cn(
              'w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors text-xs cursor-pointer',
              categoryParam === 'all'
                ? 'bg-[#5B5BD6] text-white font-semibold'
                : 'text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white hover:bg-[#F7F8FA] dark:hover:bg-[#15171D]'
            )}
          >
            <span>{t('placeholder.all_categories_label')}</span>
            {categoryParam === 'all' && <Check className="w-3.5 h-3.5 text-white" />}
          </button>

          {categories.map((cat) => {
            const isSelected = categoryParam === (cat.slug || cat.id);
            const label = language === 'ru' ? cat.name_ru : cat.name_uz;
            return (
              <button
                type="button"
                key={cat.id || cat.slug}
                onClick={() => updateFilter('category', cat.slug || cat.id)}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors text-xs cursor-pointer',
                  isSelected
                    ? 'bg-[#5B5BD6] text-white font-semibold'
                    : 'text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white hover:bg-[#F7F8FA] dark:hover:bg-[#15171D]'
                )}
              >
                <span>{label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="space-y-2 pt-2 border-t border-[#E6E8EE] dark:border-[#2A2E3B]">
        <h3 className="font-semibold text-xs text-[#17191F] dark:text-[#F4F7FC] uppercase tracking-wider">
          {t('catalog.brand')}
        </h3>
        <div className="space-y-0.5 max-h-44 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => updateFilter('brand', 'all')}
            className={cn(
              'w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors text-xs cursor-pointer',
              brandParam === 'all'
                ? 'bg-[#5B5BD6] text-white font-semibold'
                : 'text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white hover:bg-[#F7F8FA] dark:hover:bg-[#15171D]'
            )}
          >
            <span>{t('admin.all_brands_filter')}</span>
            {brandParam === 'all' && <Check className="w-3.5 h-3.5 text-white" />}
          </button>

          {brands.map((b) => {
            const isSelected = brandParam.toLowerCase() === b.name.toLowerCase();
            return (
              <button
                type="button"
                key={b.id || b.name}
                onClick={() => updateFilter('brand', isSelected ? 'all' : b.name)}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors text-xs cursor-pointer',
                  isSelected
                    ? 'bg-[#5B5BD6] text-white font-semibold'
                    : 'text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white hover:bg-[#F7F8FA] dark:hover:bg-[#15171D]'
                )}
              >
                <span>{b.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5 pt-2 border-t border-[#E6E8EE] dark:border-[#2A2E3B]">
        <h3 className="font-semibold text-xs text-[#17191F] dark:text-[#F4F7FC] uppercase tracking-wider">
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
          size="sm"
          onClick={handleApplyPrice}
          className="w-full text-xs font-semibold"
        >
          {t('common.save')}
        </Button>
      </div>

      {/* Toggles (In Stock & On Sale) */}
      <div className="space-y-2 pt-2 border-t border-[#E6E8EE] dark:border-[#2A2E3B]">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockParam}
            onChange={(e) => updateFilter('inStock', e.target.checked)}
            className="rounded border-[#E6E8EE] text-[#5B5BD6] focus:ring-[#5B5BD6]"
          />
          <span className="font-medium text-[#17191F] dark:text-[#9CA3AF]">
            {t('catalog.in_stock')}
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onSaleParam}
            onChange={(e) => updateFilter('onSale', e.target.checked)}
            className="rounded border-[#E6E8EE] text-[#5B5BD6] focus:ring-[#5B5BD6]"
          />
          <span className="font-medium text-[#17191F] dark:text-[#9CA3AF]">
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
            className="w-full text-[#737985] hover:text-[#5B5BD6]"
          >
            {t('catalog.clear_filters')} ({activeFiltersCount})
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7 space-y-5">
      {/* Breadcrumb & Header Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#737985] dark:text-[#9CA3AF]">
          <Link to="/" className="hover:text-[#17191F] dark:hover:text-[#F4F7FC] transition-colors">
            {t('nav.home')}
          </Link>
          <span>/</span>
          {searchParam ? (
            <>
              <Link to="/shop" className="hover:text-[#17191F] dark:hover:text-[#F4F7FC] transition-colors">
                {t('nav.shop')}
              </Link>
              <span>/</span>
              <span className="text-[#17191F] dark:text-[#F4F7FC] font-semibold truncate max-w-xs">
                "{searchParam}"
              </span>
            </>
          ) : (
            <span className="text-[#17191F] dark:text-[#F4F7FC] font-semibold">
              {currentCategoryName}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17191F] dark:text-[#F4F7FC]">
              {searchParam ? (
                <>
                  {t('catalog.search_results_title')}: <span className="text-[#5B5BD6]">"{searchParam}"</span>
                </>
              ) : (
                currentCategoryName
              )}
            </h1>
            <p className="text-xs text-[#737985] dark:text-[#9CA3AF] mt-0.5">
              <span>{products.length}</span> {t('catalog.products_found')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="sm"
                icon={Filter}
                onClick={() => setMobileFilterOpen(true)}
                className="font-semibold text-xs"
              >
                {t('catalog.filter_by')} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>

            {/* Sort Select */}
            <Select
              value={sortParam}
              onChange={(e) => updateFilter('sort', e.target.value)}
              options={[
                { value: 'popular', label: t('catalog.sort_popular') },
                { value: 'newest', label: t('catalog.sort_newest') },
                { value: 'price_asc', label: t('catalog.sort_price_asc') },
                { value: 'price_desc', label: t('catalog.sort_price_desc') }
              ]}
              className="text-xs font-semibold py-1.5"
            />
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[#737985] font-medium">{t('catalog.filter_by')}:</span>
          {categoryParam !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEEEFF] text-[#5B5BD6] border border-[#DCDCFB] font-semibold">
              {currentCategoryName}
              <button
                type="button"
                onClick={() => updateFilter('category', 'all')}
                className="hover:text-[#3C3CA8] cursor-pointer"
                aria-label="Remove category"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {brandParam !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEEEFF] text-[#5B5BD6] border border-[#DCDCFB] font-semibold">
              {brandParam}
              <button
                type="button"
                onClick={() => updateFilter('brand', 'all')}
                className="hover:text-[#3C3CA8] cursor-pointer"
                aria-label="Remove brand"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchParam && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEEEFF] text-[#5B5BD6] border border-[#DCDCFB] font-semibold">
              "{searchParam}"
              <button
                type="button"
                onClick={() => updateFilter('search', '')}
                className="hover:text-[#3C3CA8] cursor-pointer"
                aria-label="Remove search"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {inStockParam && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEEEFF] text-[#5B5BD6] border border-[#DCDCFB] font-semibold">
              {t('catalog.in_stock')}
              <button
                type="button"
                onClick={() => updateFilter('inStock', false)}
                className="hover:text-[#3C3CA8] cursor-pointer"
                aria-label="Remove inStock"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {onSaleParam && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEEEFF] text-[#5B5BD6] border border-[#DCDCFB] font-semibold">
              {t('nav.sales_deals')}
              <button
                type="button"
                onClick={() => updateFilter('onSale', false)}
                className="hover:text-[#3C3CA8] cursor-pointer"
                aria-label="Remove onSale"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-[#737985] hover:text-[#5B5BD6] font-semibold ml-1 cursor-pointer transition-colors"
          >
            {t('catalog.clear_filters')}
          </button>
        </div>
      )}

      {/* Main Grid Layout (Sidebar + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="p-4 bg-white dark:bg-[#1D2028] border-[#E6E8EE] dark:border-[#2A2E3B] sticky top-20 rounded-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E6E8EE] dark:border-[#2A2E3B]">
              <h2 className="text-sm font-semibold text-[#17191F] dark:text-[#F4F7FC] flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#5B5BD6]" />
                {t('catalog.filter_by')}
              </h2>
              {activeFiltersCount > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-[#5B5BD6] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {FilterContent}
          </Card>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={ShoppingBag}
                title={searchParam ? t('catalog.no_search_results') : t('catalog.no_products')}
                description={
                  searchParam
                    ? `"${searchParam}" ${t('catalog.no_search_results_desc')}`
                    : t('catalog.no_products_desc')
                }
                actionLabel={t('catalog.clear_filters')}
                onAction={handleResetFilters}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
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
      >
        <div className="py-2">
          {FilterContent}
        </div>
      </Drawer>

      {/* Global Quick View Modal */}
      <QuickViewModal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </div>
  );
}
