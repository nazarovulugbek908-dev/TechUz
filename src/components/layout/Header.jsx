import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { formatUzbekCurrency } from '../../utils/currency';
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  X,
  LogIn,
  UserPlus,
  Package,
  LogOut,
  ChevronDown
} from 'lucide-react';

export function Header({ onOpenCart }) {
  const { t, language } = useLanguage();
  const { totalCount, subtotal } = useCart();
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get('q') || searchParams.get('search') || ''
  );
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountRef = useRef(null);

  // Sync search input when URL search query changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || searchParams.get('search') || '';
    setSearchQuery(urlQuery);
  }, [searchParams]);

  // Close account dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
    // If query is empty, do nothing - do not redirect to catalog
  };

  const handleLogout = async () => {
    setAccountMenuOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="hidden lg:block bg-white dark:bg-[#15171D] border-b border-gray-100 dark:border-[#2A2E3B] sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-8">
          {/* 1. Brand Logo: Styled like Medxpress in screenshot */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859] flex items-center justify-center font-bold text-lg tracking-tight border border-[#00A859]/20 shadow-xs group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M4 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1h4V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1h-4v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm4 3H6v9h2V9zm12 0h-2v9h2V9zm-4-1h-4v8h4V8z"/>
              </svg>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold tracking-tight text-[#17191F] dark:text-[#F4F7FC]">
                Tech<span className="text-[#00A859]">Uz</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A859]" />
            </div>
          </Link>

          {/* 2. Centered Pill Search Bar with Green Button */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl relative flex items-center bg-[#F9FAFB] dark:bg-[#1D2028] rounded-full border border-gray-200 dark:border-[#2A2E3B] focus-within:border-[#00A859] focus-within:ring-2 focus-within:ring-[#00A859]/20 transition-all pl-4 pr-1 py-1 h-11"
          >
            <div className="text-gray-400 dark:text-gray-500 flex items-center pointer-events-none mr-2">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.search_placeholder')}
              className="flex-1 bg-transparent text-sm text-[#17191F] dark:text-[#F4F7FC] placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer mr-1.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              className="h-9 px-6 bg-[#00A859] hover:bg-[#00924C] active:bg-[#007D40] text-white text-xs font-semibold rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
            >
              {t('catalog.search_button')}
            </button>
          </form>

          {/* 3. Account, Favorites, Cart */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Favorites Icon */}
            <Link
              to="/favorites"
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1D2028] text-gray-600 dark:text-gray-300 hover:text-[#D64545] transition-colors"
              aria-label={t('nav.favorites')}
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D64545] text-white text-[9px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart with Green Badge */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1D2028] text-gray-700 dark:text-gray-200 transition-colors cursor-pointer group"
              aria-label={t('nav.cart')}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-gray-700 dark:text-gray-200 group-hover:text-[#00A859] transition-colors" />
                <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#00A859] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {totalCount > 0 ? `+${totalCount}` : '0'}
                </span>
              </div>
            </button>

            {/* User Account / Log In Button */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1D2028] transition-colors text-gray-800 dark:text-gray-100 text-xs font-semibold cursor-pointer"
                aria-label={isAuthenticated ? t('nav.account') : t('nav.login')}
                aria-expanded={accountMenuOpen}
              >
                <span>{isAuthenticated ? user.fullName : t('nav.login')}</span>
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {/* Account Dropdown */}
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1D2028] rounded-2xl border border-gray-100 dark:border-[#2A2E3B] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-[#2A2E3B]">
                        <p className="text-xs font-bold text-[#17191F] dark:text-[#F4F7FC] truncate">
                          {user.fullName}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {user.email || user.phone}
                        </p>
                      </div>

                      <div className="p-1 space-y-0.5">
                        <Link
                          to="/account"
                          onClick={() => setAccountMenuOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-[#E6F7EF] hover:text-[#00A859] dark:hover:bg-[#00A859]/15 transition-colors"
                        >
                          <User className="w-4 h-4 text-[#00A859]" />
                          <span>{t('nav.profile_info')}</span>
                        </Link>

                        <Link
                          to="/account/orders"
                          onClick={() => setAccountMenuOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-[#E6F7EF] hover:text-[#00A859] dark:hover:bg-[#00A859]/15 transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#00A859]" />
                          <span>{t('nav.my_orders')}</span>
                        </Link>

                        <Link
                          to="/favorites"
                          onClick={() => setAccountMenuOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-red-500" />
                          <span>{t('nav.favorites')}</span>
                        </Link>
                      </div>

                      <div className="p-1 border-t border-gray-100 dark:border-[#2A2E3B]">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#D64545] hover:bg-[#FDF2F2] dark:hover:bg-[#D64545]/10 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t('nav.logout')}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2 space-y-1.5">
                      <Link
                        to="/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#00A859] hover:bg-[#00924C] transition-colors shadow-xs"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>{t('nav.sign_in')}</span>
                      </Link>

                      <Link
                        to="/register"
                        onClick={() => setAccountMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-[#15171D] hover:bg-gray-100 transition-colors"
                      >
                        <UserPlus className="w-4 h-4 text-gray-500" />
                        <span>{t('nav.create_account')}</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
