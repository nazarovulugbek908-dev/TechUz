import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export function AboutSection({ className = '' }) {
  const { t } = useLanguage();

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6', className)}>
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF7A00] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
                {t('home.about_title')}
              </h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('home.about_desc_1')}
            </p>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('home.about_desc_2')}
            </p>
          </div>

          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t('benefits.delivery_title')}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t('benefits.warranty_title')}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t('benefits.returns_title')}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t('benefits.support_title')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
