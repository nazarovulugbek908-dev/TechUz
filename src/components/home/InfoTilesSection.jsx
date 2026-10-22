import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { BookOpen, HelpCircle, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function InfoTilesSection({ className = '' }) {
  const { t } = useLanguage();

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tile 1: Blog & Knowledge Base */}
        <div className="bg-white dark:bg-[#1D2028] text-[#17191F] dark:text-[#F4F7FC] rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-xs border border-[#E6E8EE] dark:border-[#2A2E3B]">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight">
              {t('home.blog_tile_title')}
            </h3>
            <p className="text-xs sm:text-sm text-[#737985] dark:text-[#9CA3AF] max-w-sm leading-relaxed">
              {t('home.blog_tile_desc')}
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A859] hover:text-[#00924C] transition-colors pt-2"
          >
            <span>{t('home.blog_tile_btn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tile 2: Help Center & FAQ */}
        <div className="bg-white dark:bg-[#1D2028] text-[#17191F] dark:text-[#F4F7FC] rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-xs border border-[#E6E8EE] dark:border-[#2A2E3B]">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-[#F7F8FA] dark:bg-[#15171D] text-[#737985] dark:text-[#9CA3AF] flex items-center justify-center border border-[#E6E8EE] dark:border-[#2A2E3B]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight">
              {t('home.help_tile_title')}
            </h3>
            <p className="text-xs sm:text-sm text-[#737985] dark:text-[#9CA3AF] max-w-sm leading-relaxed">
              {t('home.help_tile_desc')}
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A859] hover:text-[#00924C] transition-colors pt-2"
          >
            <span>{t('home.help_tile_btn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
