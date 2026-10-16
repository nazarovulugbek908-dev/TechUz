import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
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
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <NavLink
              key={cat.id}
              to={cat.to}
              className={({ isActive }) =>
                cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border cursor-pointer select-none',
                  isActive && cat.id !== 'all'
                    ? 'bg-[#5B5BD6] text-white border-[#5B5BD6] shadow-xs'
                    : 'bg-white dark:bg-[#1D2028] border-[#E6E8EE] dark:border-[#2A2E3B] text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-[#F4F7FC] hover:border-[#D1D5DB]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-3.5 h-3.5 shrink-0',
                      isActive && cat.id !== 'all' ? 'text-white' : 'text-[#737985] dark:text-[#9CA3AF]'
                    )}
                  />
                  <span>{cat.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
