import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Menu,
  Smartphone,
  Shield,
  Zap,
  Headphones,
  SmartphoneNfc,
  Percent
} from 'lucide-react';
import { cn } from '../../utils/cn';

export function CategoryNav() {
  const { t } = useLanguage();

  const navItems = [
    { to: '/shop?category=smartphones', label: t('nav.smartphones'), icon: Smartphone },
    { to: '/shop?category=cases', label: t('nav.cases'), icon: Shield },
    { to: '/shop?category=chargers', label: t('nav.chargers'), icon: Zap },
    { to: '/shop?category=headphones', label: t('nav.headphones'), icon: Headphones },
    { to: '/shop?category=screen_protectors', label: t('nav.screen_protectors'), icon: SmartphoneNfc },
    {
      to: '/shop?onSale=true',
      label: t('nav.sales_deals'),
      icon: Percent,
      highlight: true
    }
  ];

  return (
    <nav className="hidden lg:block bg-white dark:bg-[#15171D] border-b border-[#E6E8EE] dark:border-[#2A2E3B] transition-colors relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 py-2">
            {/* All Categories Button */}
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors select-none cursor-pointer border',
                  isActive
                    ? 'bg-[#5B5BD6] text-white border-[#5B5BD6]'
                    : 'bg-[#F7F8FA] dark:bg-[#1D2028] text-[#17191F] dark:text-[#F4F7FC] border-[#E6E8EE] dark:border-[#2A2E3B] hover:border-[#D1D5DB]'
                )
              }
            >
              <Menu className="w-3.5 h-3.5" />
              <span>{t('nav.all_categories')}</span>
            </NavLink>

            <div className="h-4 w-px bg-[#E6E8EE] dark:bg-[#2A2E3B] mx-2" />

            {/* Category Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors select-none cursor-pointer',
                        item.highlight
                          ? 'text-[#D64545] hover:bg-[#FDF2F2] dark:hover:bg-[#D64545]/10 font-semibold'
                          : isActive
                          ? 'text-[#5B5BD6] bg-[#EEEEFF] dark:bg-[#5B5BD6]/15 font-semibold'
                          : 'text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-[#F4F7FC] hover:bg-[#F7F8FA] dark:hover:bg-[#1D2028]'
                      )
                    }
                  >
                    <Icon className="w-3.5 h-3.5 opacity-80" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
