import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { PhoneModelSelector } from '../common/PhoneModelSelector';
import { Menu, Search, ShoppingBag, Zap, X } from 'lucide-react';

export function MobileHeader({ onOpenDrawer, onOpenCart }) {
  const { t } = useLanguage();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-40">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label={t('nav.menu')}
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FF7A00] flex items-center justify-center text-white shadow-xs">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="text-xl font-black font-heading text-slate-900 dark:text-white">
              Tech<span className="text-[#FF7A00]">Uz</span>
            </span>
          </Link>
        </div>

        {/* Center/Right: Quick search toggle & Cart button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label={t('catalog.title')}
          >
            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label={t('nav.cart')}
          >
            <ShoppingBag className="w-5 h-5 text-[#FF7A00]" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FF7A00] text-white text-[10px] font-black flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {searchOpen && (
        <div className="px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.search_placeholder')}
              className="w-full pl-10 pr-12 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:border-[#FF7A00]"
            />
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 px-2.5 py-1 bg-[#FF7A00] text-white text-xs font-bold rounded-lg"
            >
              OK
            </button>
          </form>
        </div>
      )}

      {/* Quick "My phone model" strip on mobile */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500">{t('nav.my_device')}</span>
        <PhoneModelSelector variant="badge" />
      </div>
    </header>
  );
}
