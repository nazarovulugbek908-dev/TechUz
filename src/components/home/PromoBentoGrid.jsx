import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Smartphone, Shield, Zap, Headphones, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PromoBentoGrid({ className = '' }) {
  const { t } = useLanguage();

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Large Tile 1: Smartphones */}
        <Link
          to="/shop?category=smartphones"
          className="lg:col-span-6 group relative rounded-3xl p-6 sm:p-8 bg-linear-to-br from-zinc-900 via-zinc-850 to-slate-900 text-white overflow-hidden border border-zinc-800 shadow-md flex flex-col justify-between min-h-[220px]"
        >
          <div className="space-y-2 z-10 max-w-xs">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FF7A00] block">
              Flagship Series
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight">
              {t('home.promo_tiles.tile1_title')}
            </h3>
            <p className="text-xs text-slate-300">
              {t('home.promo_tiles.tile1_desc')}
            </p>
          </div>

          <div className="flex items-center text-xs font-bold text-[#FF7A00] z-10 pt-4 group-hover:translate-x-1 transition-transform">
            <span>{t('home.shop_now')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>

          <div className="absolute right-4 bottom-2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all pointer-events-none">
            <Smartphone className="w-36 h-36 text-white" />
          </div>
        </Link>

        {/* Tile 2: MagSafe Accessories */}
        <Link
          to="/shop?category=cases"
          className="lg:col-span-6 group relative rounded-3xl p-6 sm:p-8 bg-linear-to-br from-orange-600 via-orange-500 to-amber-600 text-white overflow-hidden shadow-md flex flex-col justify-between min-h-[220px]"
        >
          <div className="space-y-2 z-10 max-w-xs">
            <span className="text-[11px] font-black uppercase tracking-wider text-white/80 block">
              Protection & Style
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight">
              {t('home.promo_tiles.tile2_title')}
            </h3>
            <p className="text-xs text-white/90">
              {t('home.promo_tiles.tile2_desc')}
            </p>
          </div>

          <div className="flex items-center text-xs font-bold text-white z-10 pt-4 group-hover:translate-x-1 transition-transform">
            <span>{t('home.shop_now')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>

          <div className="absolute right-4 bottom-2 opacity-15 group-hover:opacity-25 group-hover:scale-110 transition-all pointer-events-none">
            <Shield className="w-36 h-36 text-white" />
          </div>
        </Link>

        {/* Tile 3: GaN Fast Chargers */}
        <Link
          to="/shop?category=chargers"
          className="lg:col-span-6 group relative rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[180px] hover:border-orange-300 transition-colors"
        >
          <div className="space-y-1.5 z-10">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FF7A00] block">
              High Power
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-heading">
              {t('home.promo_tiles.tile3_title')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('home.promo_tiles.tile3_desc')}
            </p>
          </div>

          <div className="flex items-center text-xs font-bold text-[#FF7A00] z-10 pt-3 group-hover:translate-x-1 transition-transform">
            <span>{t('home.shop_now')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>

          <div className="absolute right-4 bottom-2 opacity-5 dark:opacity-10 group-hover:scale-110 transition-all pointer-events-none">
            <Zap className="w-28 h-28 text-orange-500" />
          </div>
        </Link>

        {/* Tile 4: TWS Audio */}
        <Link
          to="/shop?category=headphones"
          className="lg:col-span-6 group relative rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[180px] hover:border-orange-300 transition-colors"
        >
          <div className="space-y-1.5 z-10">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FF7A00] block">
              Hi-Res Audio
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-heading">
              {t('home.promo_tiles.tile4_title')}
            </h3>
            <p className="text-xs text-slate-500">
              {t('home.promo_tiles.tile4_desc')}
            </p>
          </div>

          <div className="flex items-center text-xs font-bold text-[#FF7A00] z-10 pt-3 group-hover:translate-x-1 transition-transform">
            <span>{t('home.shop_now')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>

          <div className="absolute right-4 bottom-2 opacity-5 dark:opacity-10 group-hover:scale-110 transition-all pointer-events-none">
            <Headphones className="w-28 h-28 text-orange-500" />
          </div>
        </Link>
      </div>
    </section>
  );
}
