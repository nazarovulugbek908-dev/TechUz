import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Truck, ShieldCheck, RotateCcw, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BenefitsSection({ className = '' }) {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Truck,
      title: t('benefits.delivery_title'),
      desc: t('benefits.delivery_desc'),
      accentColor: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40'
    },
    {
      icon: ShieldCheck,
      title: t('benefits.warranty_title'),
      desc: t('benefits.warranty_desc'),
      accentColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
    },
    {
      icon: RotateCcw,
      title: t('benefits.returns_title'),
      desc: t('benefits.returns_desc'),
      accentColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40'
    },
    {
      icon: Clock,
      title: t('benefits.support_title'),
      desc: t('benefits.support_desc'),
      accentColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40'
    }
  ];

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 flex items-start gap-4 transition-all duration-200 hover:shadow-md"
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs',
                  item.accentColor
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
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
