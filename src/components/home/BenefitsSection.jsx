import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Truck, ShieldCheck, RotateCcw, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BenefitsSection({ className = '' }) {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Truck,
      title: t('benefits.delivery_title'),
      desc: t('benefits.delivery_desc')
    },
    {
      icon: ShieldCheck,
      title: t('benefits.warranty_title'),
      desc: t('benefits.warranty_desc')
    },
    {
      icon: RotateCcw,
      title: t('benefits.returns_title'),
      desc: t('benefits.returns_desc')
    },
    {
      icon: Clock,
      title: t('benefits.support_title'),
      desc: t('benefits.support_desc')
    }
  ];

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {benefits.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B] rounded-xl p-4 flex items-start gap-3 shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-[#EEEEFF] dark:bg-[#5B5BD6]/15 text-[#5B5BD6] flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-semibold text-[#17191F] dark:text-[#F4F7FC]">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#737985] dark:text-[#9CA3AF] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
