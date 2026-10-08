import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { productService } from '../../services/productService';
import { ProductCard } from '../product/ProductCard';
import { SkeletonCard } from '../feedback/LoadingSpinner';
import { Percent, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function DealsSection({ onQuickView, className = '' }) {
  const { t } = useLanguage();
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    async function loadDeals() {
      setLoading(true);
      const { data } = await productService.getProducts({
        onSaleOnly: true,
        limit: 8
      });
      setDealProducts(data || []);
      setLoading(false);
    }
    loadDeals();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6', className)}>
      <div className="bg-linear-to-r from-orange-500/10 via-amber-500/5 to-transparent p-5 sm:p-7 rounded-3xl border border-orange-200/80 dark:border-orange-950/50 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
              <Percent className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
                {t('home.deals_title')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('home.deals_subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/shop?onSale=true"
              className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>{t('home.view_all')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="hidden sm:flex items-center gap-1 ml-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Oldingi chegirmalar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Keyingi chegirmalar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel List */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="w-[220px] sm:w-[260px] shrink-0 snap-start">
                <SkeletonCard />
              </div>
            ))
          ) : dealProducts.length === 0 ? (
            <div className="w-full py-6 text-center text-xs text-slate-400">
              {t('catalog.no_products')}
            </div>
          ) : (
            dealProducts.map((product) => (
              <div
                key={product.id}
                className="w-[220px] sm:w-[260px] lg:w-[280px] shrink-0 snap-start flex flex-col"
              >
                <ProductCard
                  product={product}
                  onQuickView={onQuickView}
                  className="h-full bg-white dark:bg-slate-900"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
