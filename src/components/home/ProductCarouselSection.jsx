import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
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

  const [activeFilter, setActiveFilter] = useState('popular');
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
      const offset = direction === 'left' ? -300 : 300;
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
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6 space-y-4', className)}>
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17191F] dark:text-[#F4F7FC]">
              {title}
            </h2>
            {category && category !== 'smartphones' && hasSelectedModel && (
              <span className="hidden sm:inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EEEEFF] dark:bg-[#5B5BD6]/15 text-[#5B5BD6] dark:text-[#A5A5F5]">
                {selectedModel.name}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#737985] dark:text-[#9CA3AF] mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Tabs & View All & Carousel Controls */}
        <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
          {showTabs && (
            <div className="flex items-center gap-1 p-0.5 bg-[#F7F8FA] dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B] rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer select-none',
                    activeFilter === tab.id
                      ? 'bg-white dark:bg-[#15171D] text-[#17191F] dark:text-white shadow-xs'
                      : 'text-[#737985] hover:text-[#17191F] dark:text-[#9CA3AF] dark:hover:text-white'
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
              className="text-xs font-semibold text-[#5B5BD6] hover:text-[#4949BC] flex items-center gap-1 shrink-0"
            >
              <span>{t('home.view_all')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Carousel Arrow Buttons */}
            <div className="hidden sm:flex items-center gap-1 ml-1">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-7 h-7 rounded-md border border-[#E6E8EE] dark:border-[#2A2E3B] bg-white dark:bg-[#1D2028] flex items-center justify-center text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white hover:bg-[#F7F8FA] transition-colors cursor-pointer"
                aria-label="Oldingi"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-7 h-7 rounded-md border border-[#E6E8EE] dark:border-[#2A2E3B] bg-white dark:bg-[#1D2028] flex items-center justify-center text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white hover:bg-[#F7F8FA] transition-colors cursor-pointer"
                aria-label="Keyingi"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x snap-mandatory"
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="w-[210px] sm:w-[240px] shrink-0 snap-start">
              <SkeletonCard />
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="w-full py-8 text-center text-xs text-[#737985]">
            {t('catalog.no_products')}
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="w-[210px] sm:w-[240px] lg:w-[260px] shrink-0 snap-start flex flex-col"
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
