import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { usePhoneModel } from '../context/PhoneModelContext';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { Button } from '../components/common/Button';
import { Drawer } from '../components/common/Drawer';
import { EmptyState } from '../components/feedback/EmptyState';
import { SkeletonCard } from '../components/feedback/LoadingSpinner';
import {
  SlidersHorizontal,
  X,
  Search,
  Grid,
  List,
  Smartphone,
  Shield,
  Zap,
  Headphones,
  Sparkles,
  Layers,
  ShoppingBag,
  Plus,
  Check,
  ChevronDown,
  ChevronRight
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
  const sortParam = searchParams.get('sort') || 'newest';
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

  const handleResetFilters = () => {
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

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'smartphones':
        return <Smartphone className="w-4 h-4" />;
      case 'cases':
        return <Shield className="w-4 h-4" />;
      case 'chargers':
        return <Zap className="w-4 h-4" />;
      case 'headphones':
        return <Headphones className="w-4 h-4" />;
      case 'screen_protectors':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  // Sidebar Categories Component (matches Image 1)
  const CategorySidebar = (
    <div className="space-y-6">
      {/* Product Categories Card */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          {language === 'ru' ? 'Категории товаров' : 'Mahsulot toifalari'}
        </h2>

        <div className="bg-white dark:bg-[#1D2028] rounded-2xl border border-gray-150 dark:border-[#2A2E3B] p-2 shadow-2xs divide-y divide-gray-100 dark:divide-[#2A2E3B]/60">
          {/* All Categories Option */}
          <button
            type="button"
            onClick={() => updateFilter('category', 'all')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-xl transition-all cursor-pointer group',
              categoryParam === 'all'
                ? 'bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859]'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15171D]'
            )}
          >
            <div className="flex items-center gap-2.5">
              <Layers className={cn('w-4 h-4', categoryParam === 'all' ? 'text-[#00A859]' : 'text-gray-400 group-hover:text-gray-600')} />
              <span>{language === 'ru' ? 'Все категории' : 'Barcha toifalar'}</span>
            </div>
            <span className={cn('w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs', categoryParam === 'all' ? 'text-[#00A859]' : 'text-[#00A859]/70 group-hover:text-[#00A859]')}>
              +
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const isSelected = categoryParam === (cat.slug || cat.id);
            const label = language === 'ru' ? cat.name_ru : cat.name_uz;
            return (
              <button
                type="button"
                key={cat.id || cat.slug}
                onClick={() => updateFilter('category', isSelected ? 'all' : (cat.slug || cat.id))}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-xl transition-all cursor-pointer group',
                  isSelected
                    ? 'bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#15171D]'
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={cn('shrink-0', isSelected ? 'text-[#00A859]' : 'text-gray-400 group-hover:text-gray-600')}>
                    {getCategoryIcon(cat.slug)}
                  </span>
                  <span className="truncate">{label}</span>
                </div>
                <span className={cn('w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0', isSelected ? 'text-[#00A859]' : 'text-[#00A859]/70 group-hover:text-[#00A859]')}>
                  +
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
        <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          {language === 'ru' ? 'Главная' : 'Bosh sahifa'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 dark:text-white font-semibold">
          {language === 'ru' ? 'Каталог' : "Do'kon"}
        </span>
      </div>

      {/* 2. Page Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17191F] dark:text-white tracking-tight">
          {language === 'ru' ? 'Каталог товаров' : 'Mahsulotlar katalogi'}
        </h1>
      </div>

      {/* 3. Main Content: Left Categories Sidebar + Right Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Column (Desktop Categories Sidebar) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          {CategorySidebar}
        </div>

        {/* Right Column (Controls Bar + Product Cards) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-4">
              {/* Grid / List View Toggle */}
              <div className="flex items-center gap-1 text-gray-500">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1.5 rounded-lg border transition-colors cursor-pointer',
                    viewMode === 'grid'
                      ? 'border-[#00A859] text-[#00A859] bg-[#E6F7EF]'
                      : 'border-gray-200 dark:border-[#2A2E3B] hover:text-gray-900'
                  )}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 rounded-lg border transition-colors cursor-pointer',
                    viewMode === 'list'
                      ? 'border-[#00A859] text-[#00A859] bg-[#E6F7EF]'
                      : 'border-gray-200 dark:border-[#2A2E3B] hover:text-gray-900'
                  )}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Results Counter */}
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {products.length > 0 ? (
                  <span>
                    {language === 'ru'
                      ? `Показано 1-${products.length} из ${products.length} товаров`
                      : `1-${products.length} dan ${products.length} ta mahsulot`}
                  </span>
                ) : (
                  <span>
                    {language === 'ru' ? '0 товаров' : '0 ta mahsulot'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Trigger Button */}
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  icon={SlidersHorizontal}
                  onClick={() => setMobileFilterOpen(true)}
                  className="font-semibold text-xs rounded-full"
                >
                  {t('catalog.filter_by')} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
              </div>

              {/* Sort Pill Dropdown */}
              <div className="relative">
                <select
                  value={sortParam}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="appearance-none bg-white dark:bg-[#1D2028] border border-gray-200 dark:border-[#2A2E3B] rounded-full px-4 py-2 pr-8 text-xs font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#00A859] cursor-pointer shadow-2xs"
                >
                  <option value="newest">{language === 'ru' ? 'Сначала новые' : 'Avval yangilar'}</option>
                  <option value="popular">{language === 'ru' ? 'Сначала популярные' : 'Avval ommabop'}</option>
                  <option value="price_asc">{language === 'ru' ? 'Сначала дешевле' : 'Avval arzonlari'}</option>
                  <option value="price_desc">{language === 'ru' ? 'Сначала дороже' : 'Avval qimmatlari'}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid / List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 bg-white dark:bg-[#1D2028] rounded-2xl border border-gray-150 dark:border-[#2A2E3B]">
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
            <div className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'space-y-4'
            )}>
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

      {/* Mobile Drawer Filter */}
      <Drawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title={language === 'ru' ? 'Фильтры' : 'Filtrlar'}
      >
        <div className="p-4">
          {CategorySidebar}
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
