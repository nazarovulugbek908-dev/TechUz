import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { usePhoneModel } from '../../context/PhoneModelContext';
import { productService } from '../../services/productService';
import { ProductCard } from '../product/ProductCard';
import { SkeletonCard } from '../feedback/LoadingSpinner';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ProductCarouselSection({
  title,
  subtitle,
  category = null,
  showTabs = true,
  viewAllLink = '/shop',
  onQuickView,
  className = ''
}) {
  const { t } = useLanguage();
  const { selectedModelId, selectedModel, hasSelectedModel } = usePhoneModel();

  const [activeFilter, setActiveFilter] = useState('popular'); // popular | newest | price_asc | in_stock
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const isPriceAsc = activeFilter === 'price_asc';
      const isNewest = activeFilter === 'newest';
      const isInStock = activeFilter === 'in_stock';

      const { data } = await productService.getProducts({
        category: category !== 'all' ? category : null,
        phoneModel: selectedModelId,
        sort: isPriceAsc ? 'price_asc' : isNewest ? 'newest' : 'popular',
        inStockOnly: isInStock,
        limit: 10
      });

      setProducts(data || []);
      setLoading(false);
    }

    fetchProducts();
  }, [category, activeFilter, selectedModelId]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const tabs = [
    { id: 'popular', label: t('home.tab_popular') },
    { id: 'newest', label: t('home.tab_new') },
    { id: 'price_asc', label: t('home.tab_low_price') },
    { id: 'in_stock', label: t('home.tab_in_stock') }
  ];

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6 space-y-5', className)}>
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading text-slate-900 dark:text-white">
              {title}
            </h2>
            {category && category !== 'smartphones' && hasSelectedModel && (
              <span className="hidden sm:inline-flex items-center text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF7A00]">
                {selectedModel.name}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Tabs & View All & Carousel Controls */}
        <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
          {showTabs && (
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
                    activeFilter === tab.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Link
              to={viewAllLink}
              className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>{t('home.view_all')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Carousel Arrow Buttons */}
            <div className="hidden sm:flex items-center gap-1 ml-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Oldingi mahsulotlar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Keyingi mahsulotlar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x snap-mandatory"
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="w-[220px] sm:w-[260px] shrink-0 snap-start">
              <SkeletonCard />
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="w-full py-8 text-center text-xs text-slate-400">
            {t('catalog.no_products')}
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="w-[220px] sm:w-[260px] lg:w-[280px] shrink-0 snap-start flex flex-col"
            >
              <ProductCard
                product={product}
                onQuickView={onQuickView}
                className="h-full"
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
