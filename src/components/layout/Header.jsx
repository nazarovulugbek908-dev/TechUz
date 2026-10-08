import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { PhoneModelSelector } from '../common/PhoneModelSelector';
import { formatUzbekCurrency } from '../../utils/currency';
import {
  Search,
  ShoppingBag,
  User,
  Zap,
  ChevronDown,
  Layers
} from 'lucide-react';

export function Header({ onOpenCart }) {
  const { t, language } = useLanguage();
  const { totalCount, subtotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <header className="hidden lg:block bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4 xl:gap-6">
          {/* 1. Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-[#FF7A00] flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black font-heading tracking-tight text-slate-900 dark:text-white leading-none">
                Tech<span className="text-[#FF7A00]">Uz</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                Store
              </span>
            </div>
          </Link>

          {/* 2. "My Phone Model" Selector (Integrated in Header) */}
          <div className="shrink-0">
            <PhoneModelSelector variant="header" />
          </div>

          {/* 3. Search Bar with Category Dropdown & Orange Button */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-lg xl:max-w-xl relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:border-[#FF7A00] focus-within:ring-2 focus-within:ring-orange-500/20 transition-all"
          >
            {/* Category selection inside search */}
            <div className="relative flex items-center border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent pl-3 pr-7 py-2.5 outline-none cursor-pointer"
                aria-label={t('nav.all_categories')}
              >
                <option value="all">{t('nav.all_categories')}</option>
                <option value="smartphones">{t('nav.smartphones')}</option>
                <option value="cases">{t('nav.cases')}</option>
                <option value="chargers">{t('nav.chargers')}</option>
                <option value="headphones">{t('nav.headphones')}</option>
                <option value="screen_protectors">{t('nav.screen_protectors')}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2 pointer-events-none text-slate-400" />
            </div>

            {/* Input field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.search_placeholder')}
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
            />

            {/* Orange Search Action Button */}
            <button
              type="submit"
              className="w-11 h-10 bg-[#FF7A00] hover:bg-[#E66E00] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label={t('catalog.title')}
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* 4. Auth & Cart Actions */}
          <div className="flex items-center gap-3 xl:gap-4 shrink-0">
            {/* User Account */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left text-xs leading-tight">
                <span className="text-[10px] text-slate-400">
                  {isAuthenticated ? t('nav.welcome') : t('nav.account')}
                </span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[100px]">
                  {isAuthenticated ? user.fullName : t('nav.login')}
                </span>
              </div>
            </Link>

            {/* Cart Button with Count Badge & Total */}
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2.5 xl:gap-3 pl-3 pr-3.5 xl:pr-4 py-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white transition-all cursor-pointer shadow-sm hover:shadow-md"
              aria-label={t('nav.cart')}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#FF7A00]" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#FF7A00] text-white text-[11px] font-bold flex items-center justify-center border-2 border-zinc-900">
                    {totalCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                  {t('nav.cart')}
                </span>
                <span className="text-xs font-black text-white">
                  {formatUzbekCurrency(subtotal, language)}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
