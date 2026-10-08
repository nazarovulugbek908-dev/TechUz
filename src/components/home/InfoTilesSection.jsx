import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, HelpCircle, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function InfoTilesSection({ className = '' }) {
  const { t } = useLanguage();

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tile 1: Blog & Knowledge Base */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-md border border-slate-800">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-[#FF7A00] flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black font-heading">
              {t('home.blog_tile_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {t('home.blog_tile_desc')}
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7A00] hover:text-orange-400 transition-colors"
          >
            <span>{t('home.blog_tile_btn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tile 2: Help Center & FAQ */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black font-heading">
              {t('home.help_tile_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              {t('home.help_tile_desc')}
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#FF7A00] hover:text-orange-600 transition-colors"
          >
            <span>{t('home.help_tile_btn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
