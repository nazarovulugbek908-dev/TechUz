import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { Smartphone, Shield, Zap, Headphones, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PromoBentoGrid({ className = '' }) {
  const { t } = useLanguage();

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Tile 1: Flagships */}
        <Link
          to="/shop?category=smartphones"
          className="lg:col-span-6 group relative rounded-xl p-6 bg-white dark:bg-[#1D2028] text-[#17191F] dark:text-[#F4F7FC] overflow-hidden border border-[#E6E8EE] dark:border-[#2A2E3B] hover:border-[#5B5BD6]/50 shadow-xs transition-colors flex flex-col justify-between min-h-[190px]"
        >
          <div className="space-y-1.5 z-10 max-w-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5B5BD6] block">
              Flagship Series
            </span>
            <h3 className="text-lg sm:text-xl font-bold leading-snug">
              {t('home.promo_tiles.tile1_title')}
            </h3>
            <p className="text-xs text-[#737985] dark:text-[#9CA3AF]">
              {t('home.promo_tiles.tile1_desc')}
            </p>
          </div>

          <div className="flex items-center text-xs font-semibold text-[#5B5BD6] z-10 pt-3 group-hover:translate-x-1 transition-transform">
            <span>{t('home.shop_now')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>

          <div className="absolute right-4 bottom-2 opacity-5 dark:opacity-10 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Smartphone className="w-28 h-28 text-[#17191F] dark:text-white" />
          </div>
        </Link>

        {/* Tile 2: Protection & Cases */}
        <Link
          to="/shop?category=cases"
          className="lg:col-span-6 group relative rounded-xl p-6 bg-white dark:bg-[#1D2028] text-[#17191F] dark:text-[#F4F7FC] overflow-hidden border border-[#E6E8EE] dark:border-[#2A2E3B] hover:border-[#5B5BD6]/50 shadow-xs transition-colors flex flex-col justify-between min-h-[190px]"
        >
          <div className="space-y-1.5 z-10 max-w-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5B5BD6] block">
              Protection & Cases
            </span>
            <h3 className="text-lg sm:text-xl font-bold leading-snug">
              {t('home.promo_tiles.tile2_title')}
            </h3>
            <p className="text-xs text-[#737985] dark:text-[#9CA3AF]">
              {t('home.promo_tiles.tile2_desc')}
            </p>
          </div>

          <div className="flex items-center text-xs font-semibold text-[#5B5BD6] z-10 pt-3 group-hover:translate-x-1 transition-transform">
            <span>{t('home.shop_now')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>

          <div className="absolute right-4 bottom-2 opacity-5 dark:opacity-10 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Shield className="w-28 h-28 text-[#17191F] dark:text-white" />
          </div>
        </Link>

        {/* Sub-tile 3: Fast Chargers */}
        <Link
          to="/shop?category=chargers"
          className="lg:col-span-6 group relative rounded-xl p-5 bg-white dark:bg-[#1D2028] text-[#17191F] dark:text-[#F4F7FC] overflow-hidden border border-[#E6E8EE] dark:border-[#2A2E3B] hover:border-[#5B5BD6]/50 shadow-xs transition-colors flex items-center justify-between"
        >
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5B5BD6]">
              GaN Fast Charging
            </span>
            <h4 className="text-base font-bold">
              {t('home.promo_tiles.tile3_title')}
            </h4>
            <div className="flex items-center text-xs font-semibold text-[#5B5BD6] pt-1 group-hover:translate-x-1 transition-transform">
              <span>{t('home.shop_now')}</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
          <Zap className="w-10 h-10 text-[#5B5BD6]/20" />
        </Link>

        {/* Sub-tile 4: Audio & Earbuds */}
        <Link
          to="/shop?category=headphones"
          className="lg:col-span-6 group relative rounded-xl p-5 bg-white dark:bg-[#1D2028] text-[#17191F] dark:text-[#F4F7FC] overflow-hidden border border-[#E6E8EE] dark:border-[#2A2E3B] hover:border-[#5B5BD6]/50 shadow-xs transition-colors flex items-center justify-between"
        >
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5B5BD6]">
              Studio Audio
            </span>
            <h4 className="text-base font-bold">
              {t('home.promo_tiles.tile4_title')}
            </h4>
            <div className="flex items-center text-xs font-semibold text-[#5B5BD6] pt-1 group-hover:translate-x-1 transition-transform">
              <span>{t('home.shop_now')}</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
          <Headphones className="w-10 h-10 text-[#5B5BD6]/20" />
        </Link>
      </div>
    </section>
  );
}
