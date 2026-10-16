import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#15171D] border-t border-[#E6E8EE] dark:border-[#2A2E3B] pb-[env(safe-area-inset-bottom,0px)] shadow-xs">
      <div className="grid grid-cols-5 h-14 max-w-lg mx-auto">
        {/* 1. Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer',
              isActive
                ? 'text-[#5B5BD6] font-semibold'
                : 'text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white'
            )
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] leading-none">{t('nav.home')}</span>
        </NavLink>

        {/* 2. Shop / Catalog */}
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer',
              isActive
                ? 'text-[#5B5BD6] font-semibold'
                : 'text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white'
            )
          }
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] leading-none">{t('nav.shop')}</span>
        </NavLink>

        {/* 3. My Phone Model */}
        <button
          type="button"
          onClick={onOpenModelSelector}
          className="flex flex-col items-center justify-center gap-1 text-[#737985] dark:text-[#9CA3AF] hover:text-[#5B5BD6] transition-colors cursor-pointer relative"
        >
          <div
            className={cn(
              'w-7 h-7 rounded-md flex items-center justify-center transition-all',
              hasSelectedModel
                ? 'bg-[#5B5BD6] text-white shadow-xs'
                : 'bg-[#F7F8FA] dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B] text-[#737985] dark:text-[#9CA3AF]'
            )}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <span className="text-[9px] font-medium leading-none">{t('nav.my_model')}</span>
        </button>

        {/* 4. Cart */}
        <button
          type="button"
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center gap-1 text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white transition-colors cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-[#5B5BD6] text-white text-[9px] font-bold flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-none">{t('nav.cart')}</span>
        </button>

        {/* 5. Account */}
        <NavLink
          to={isAuthenticated ? '/account' : '/login'}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer',
              isActive
                ? 'text-[#5B5BD6] font-semibold'
                : 'text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white'
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
