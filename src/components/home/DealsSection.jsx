import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
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
      const offset = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!loading && dealProducts.length === 0) {
    return null; // Only show if genuine deal products exist
  }

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6', className)}>
      <div className="bg-white dark:bg-[#1D2028] p-5 sm:p-6 rounded-xl border border-[#E6E8EE] dark:border-[#2A2E3B] space-y-4 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FDF2F2] dark:bg-[#D64545]/15 text-[#D64545] flex items-center justify-center shrink-0">
              <Percent className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#17191F] dark:text-[#F4F7FC]">
                {t('home.deals_title')}
              </h2>
              <p className="text-xs text-[#737985] dark:text-[#9CA3AF]">
                {t('home.deals_subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/shop?onSale=true"
              className="text-xs font-semibold text-[#5B5BD6] hover:text-[#4949BC] flex items-center gap-1 shrink-0"
            >
              <span>{t('home.view_all')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="hidden sm:flex items-center gap-1 ml-1">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-7 h-7 rounded-md border border-[#E6E8EE] dark:border-[#2A2E3B] bg-[#F7F8FA] dark:bg-[#15171D] flex items-center justify-center text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Oldingi"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-7 h-7 rounded-md border border-[#E6E8EE] dark:border-[#2A2E3B] bg-[#F7F8FA] dark:bg-[#15171D] flex items-center justify-center text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Keyingi"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar snap-x snap-mandatory"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="w-[210px] sm:w-[240px] shrink-0 snap-start">
                <SkeletonCard />
              </div>
            ))
          ) : (
            dealProducts.map((product) => (
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
      </div>
    </section>
  );
}
