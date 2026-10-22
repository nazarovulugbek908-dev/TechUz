import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { cn } from '../../utils/cn';

export function CategoryNav() {
  const { t, language } = useLanguage();

  const navItems = [
    { to: '/', label: t('nav.home') || 'Home' },
    { to: '/shop', label: t('nav.shop') || 'Shop' },
    { to: '/shop?category=smartphones', label: t('nav.smartphones') || 'Smartphones' },
    { to: '/shop?category=cases', label: t('nav.cases') || 'Cases' },
    { to: '/shop?category=chargers', label: t('nav.chargers') || 'Chargers' },
    { to: '/shop?category=headphones', label: t('nav.headphones') || 'Headphones' },
    { to: '/shop?category=screen_protectors', label: t('nav.screen_protectors') || 'Screen Protectors' },
    { to: '/shop?onSale=true', label: t('nav.sales_deals') || 'Deals' }
  ];

  const rightItems = [
    { to: '/#about', label: language === 'ru' ? 'О нас' : 'Biz haqimizda' },
    { to: '/#help', label: language === 'ru' ? 'Блог' : 'Blog' },
    { to: 'tel:+998945876472', label: language === 'ru' ? 'Контакты' : 'Bog‘lanish', isExternal: true }
  ];

  return (
    <nav className="hidden lg:block bg-[#00A859] text-white shadow-xs relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-11">
          {/* Left Category & Main Links */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer select-none',
                    isActive
                      ? 'bg-black/15 text-white shadow-inner font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right Secondary Links (Blog, About, Contact) */}
          <div className="flex items-center gap-1 shrink-0 pl-4 border-l border-white/20">
            {rightItems.map((item) => (
              item.isExternal ? (
                <a
                  key={item.label}
                  href={item.to}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/90 hover:text-white hover:bg-white/15 transition-all whitespace-nowrap"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/90 hover:text-white hover:bg-white/15 transition-all whitespace-nowrap"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
