import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  Smartphone,
  Shield,
  Zap,
  Headphones,
  SmartphoneNfc,
  BatteryCharging,
  Cable,
  Grid
} from 'lucide-react';
import { cn } from '../../utils/cn';

export function CategoryPillsBar({ className = '' }) {
  const { t } = useLanguage();

  const categories = [
    { id: 'all', to: '/shop', label: t('placeholder.all_categories_label'), icon: Grid },
    { id: 'smartphones', to: '/shop?category=smartphones', label: t('nav.smartphones'), icon: Smartphone },
    { id: 'cases', to: '/shop?category=cases', label: t('nav.cases'), icon: Shield },
    { id: 'chargers', to: '/shop?category=chargers', label: t('nav.chargers'), icon: Zap },
    { id: 'headphones', to: '/shop?category=headphones', label: t('nav.headphones'), icon: Headphones },
    { id: 'screen_protectors', to: '/shop?category=screen_protectors', label: t('nav.screen_protectors'), icon: SmartphoneNfc },
    { id: 'power_banks', to: '/shop?category=power_banks', label: t('nav.power_banks'), icon: BatteryCharging },
    { id: 'cables', to: '/shop?category=cables', label: t('nav.cables'), icon: Cable }
  ];

  return (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6', className)}>
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <NavLink
              key={cat.id}
              to={cat.to}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer select-none',
                  isActive && cat.id !== 'all'
                    ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-sm shadow-orange-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-slate-800'
                )
              }
            >
              <Icon className="w-4 h-4 text-[#FF7A00] shrink-0" />
              <span>{cat.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
