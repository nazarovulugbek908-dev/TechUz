import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../context/CartContext';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';

export function MobileHeader({ onOpenDrawer, onOpenCart }) {
  const { t } = useLanguage();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="lg:hidden bg-white dark:bg-[#15171D] border-b border-[#E6E8EE] dark:border-[#2A2E3B] sticky top-0 z-40">
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Menu & Brand */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="p-1.5 rounded-lg bg-[#F7F8FA] dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B] text-[#17191F] dark:text-white transition-colors cursor-pointer"
            aria-label={t('nav.menu')}
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#5B5BD6] text-white flex items-center justify-center font-bold text-xs">
              T
            </div>
            <span className="text-lg font-bold tracking-tight text-[#17191F] dark:text-white">
              Tech<span className="text-[#5B5BD6]">Uz</span>
            </span>
          </Link>
        </div>

        {/* Right: Quick search toggle & Cart button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="p-2 rounded-lg bg-[#F7F8FA] dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B] text-[#737985] dark:text-[#9CA3AF] transition-colors cursor-pointer"
            aria-label={t('catalog.title')}
          >
            {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2 rounded-lg bg-[#F7F8FA] dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B] text-[#17191F] dark:text-white transition-colors cursor-pointer"
            aria-label={t('nav.cart')}
          >
            <ShoppingBag className="w-4 h-4 text-[#5B5BD6]" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#5B5BD6] text-white text-[9px] font-bold flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Input for Mobile */}
      {searchOpen && (
        <form
          onSubmit={handleSearchSubmit}
          className="px-4 pb-3 pt-1 flex items-center gap-2 border-t border-[#E6E8EE] dark:border-[#2A2E3B] bg-[#F7F8FA] dark:bg-[#1D2028]"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('nav.search_placeholder')}
            autoFocus
            className="flex-1 bg-white dark:bg-[#15171D] border border-[#E6E8EE] dark:border-[#2A2E3B] rounded-lg px-3 py-1.5 text-sm text-[#17191F] dark:text-white placeholder:text-[#737985]/70 outline-none focus:border-[#5B5BD6]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[#5B5BD6] text-white text-xs font-semibold cursor-pointer shrink-0"
          >
            {t('catalog.search_button')}
          </button>
        </form>
      )}
    </header>
  );
}
