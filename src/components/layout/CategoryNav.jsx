import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  Menu,
  Smartphone,
  Shield,
  Zap,
  Headphones,
  SmartphoneNfc,
  Percent,
  Sparkles
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
    <nav className="hidden lg:block bg-white dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* All Categories Pill Button */}
          <div className="flex items-center gap-1 py-2">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
                  isActive
                    ? 'bg-[#FF7A00] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200/80'
                )
              }
            >
              <Menu className="w-4 h-4" />
              <span>{t('nav.all_categories')}</span>
            </NavLink>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

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
                        'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all',
                        item.highlight
                          ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200/60 dark:border-rose-900/40'
                          : isActive
                          ? 'bg-orange-50 text-[#FF7A00] dark:bg-orange-950/40'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      )
                    }
                  >
                    <Icon className={cn('w-3.5 h-3.5', item.highlight ? 'text-rose-500' : 'text-slate-400')} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Quick Right Perks */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span className="hidden xl:inline">{t('home.weekly_new')}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
