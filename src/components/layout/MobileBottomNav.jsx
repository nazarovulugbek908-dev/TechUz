import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { usePhoneModel } from '../../context/PhoneModelContext';
import { Home, Grid, Smartphone, ShoppingBag, User } from 'lucide-react';
import { cn } from '../../utils/cn';

export function MobileBottomNav({ onOpenCart, onOpenModelSelector }) {
  const { t } = useLanguage();
  const { totalCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { hasSelectedModel } = usePhoneModel();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 safe-area-pb">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {/* 1. Home - Bosh sahifa */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer',
              isActive
                ? 'text-[#FF7A00] font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] leading-none">{t('nav.home')}</span>
        </NavLink>

        {/* 2. Shop / Catalog - Katalog */}
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer',
              isActive
                ? 'text-[#FF7A00] font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )
          }
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] leading-none">{t('nav.shop')}</span>
        </NavLink>

        {/* 3. My Phone Model - Modelim */}
        <button
          type="button"
          onClick={onOpenModelSelector}
          className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-[#FF7A00] dark:text-slate-400 transition-colors cursor-pointer relative"
        >
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all',
              hasSelectedModel
                ? 'bg-[#FF7A00] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            )}
          >
            <Smartphone className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold leading-none">{t('nav.my_model')}</span>
        </button>

        {/* 4. Cart - Savat */}
        <button
          type="button"
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-[#FF7A00] text-white text-[10px] font-black flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-none">{t('nav.cart')}</span>
        </button>

        {/* 5. Account - Profil */}
        <NavLink
          to={isAuthenticated ? '/account' : '/login'}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer',
              isActive
                ? 'text-[#FF7A00] font-bold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )
          }
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] leading-none">{t('nav.account')}</span>
        </NavLink>
      </div>
    </nav>
  );
}
