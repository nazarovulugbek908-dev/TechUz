import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export function AboutSection({ className = '' }) {
  const { t } = useLanguage();

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6', className)}>
      <div className="bg-white dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B] rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#5B5BD6] text-white flex items-center justify-center font-bold text-xs">
                T
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#17191F] dark:text-[#F4F7FC]">
                {t('home.about_title')}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#737985] dark:text-[#9CA3AF] leading-relaxed">
              {t('home.about_desc_1')}
            </p>

            <p className="text-xs sm:text-sm text-[#737985] dark:text-[#9CA3AF] leading-relaxed">
              {t('home.about_desc_2')}
            </p>
          </div>

          <div className="lg:col-span-4 bg-[#F7F8FA] dark:bg-[#15171D] p-4.5 rounded-lg border border-[#E6E8EE] dark:border-[#2A2E3B] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#17191F] dark:text-[#F4F7FC]">
              <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0" />
              <span>{t('benefits.delivery_title')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#17191F] dark:text-[#F4F7FC]">
              <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0" />
              <span>{t('benefits.warranty_title')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#17191F] dark:text-[#F4F7FC]">
              <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0" />
              <span>{t('benefits.returns_title')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#17191F] dark:text-[#F4F7FC]">
              <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0" />
              <span>{t('benefits.support_title')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
