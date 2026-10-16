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
    <header className="hidden lg:block bg-white dark:bg-[#15171D] border-b border-[#E6E8EE] dark:border-[#2A2E3B] sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* 1. Brand Logo: Clear, Premium TechUz Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-[#5B5BD6] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              T
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#17191F] dark:text-[#F4F7FC] leading-none">
                Tech<span className="text-[#5B5BD6]">Uz</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-[#737985] dark:text-[#9CA3AF] mt-0.5">
                Electronics
              </span>
            </div>
          </Link>

          {/* 2. Functional, Usable Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl relative flex items-center bg-[#F7F8FA] dark:bg-[#1D2028] rounded-lg border border-[#E6E8EE] dark:border-[#2A2E3B] focus-within:border-[#5B5BD6] focus-within:ring-2 focus-within:ring-[#5B5BD6]/15 transition-all h-10"
          >
            <div className="pl-3.5 pr-1 text-[#737985] dark:text-[#9CA3AF] flex items-center pointer-events-none">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.search_placeholder')}
              className="flex-1 bg-transparent px-2.5 py-1.5 text-sm text-[#17191F] dark:text-[#F4F7FC] placeholder:text-[#737985]/70 dark:placeholder:text-[#9CA3AF]/60 outline-none"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-[#737985] hover:text-[#17191F] dark:hover:text-white transition-colors cursor-pointer mr-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              className="h-8 px-3.5 mr-1 bg-[#5B5BD6] hover:bg-[#4949BC] active:bg-[#3C3CA8] text-white text-xs font-semibold rounded-md flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              {t('catalog.search_button')}
            </button>
          </form>

          {/* 3. Account, Favorites, Cart */}
          <div className="flex items-center gap-2 shrink-0">
            {/* User Account with Dropdown Menu */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#F7F8FA] dark:hover:bg-[#1D2028] border border-transparent dark:hover:border-[#2A2E3B] transition-colors text-[#17191F] dark:text-[#F4F7FC] cursor-pointer"
                aria-label={isAuthenticated ? t('nav.account') : t('nav.login')}
                aria-expanded={accountMenuOpen}
              >
                <div className="w-8 h-8 rounded-lg bg-[#F7F8FA] dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B] flex items-center justify-center text-[#737985] dark:text-[#9CA3AF]">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left text-xs leading-tight">
                  <span className="text-[10px] text-[#737985] dark:text-[#9CA3AF]">
                    {isAuthenticated ? t('nav.welcome') : t('nav.account')}
                  </span>
                  <span className="font-semibold text-[#17191F] dark:text-[#F4F7FC] truncate max-w-[110px]">
                    {isAuthenticated ? user.fullName : t('nav.login')}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#737985] dark:text-[#9CA3AF] opacity-70" />
              </button>

              {/* Account Dropdown */}
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1D2028] rounded-xl border border-[#E6E8EE] dark:border-[#2A2E3B] shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-[#E6E8EE] dark:border-[#2A2E3B]">
                        <p className="text-xs font-bold text-[#17191F] dark:text-[#F4F7FC] truncate">
                          {user.fullName}
                        </p>
                        <p className="text-[11px] text-[#737985] dark:text-[#9CA3AF] truncate mt-0.5">
                          {user.email || user.phone}
                        </p>
                      </div>

                      <div className="p-1 space-y-0.5">
                        <Link
                          to="/account"
                          onClick={() => setAccountMenuOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#17191F] dark:text-[#F4F7FC] hover:bg-[#F7F8FA] dark:hover:bg-[#252830] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#5B5BD6]" />
                          <span>{t('nav.profile_info')}</span>
                        </Link>

                        <Link
                          to="/account/orders"
                          onClick={() => setAccountMenuOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#17191F] dark:text-[#F4F7FC] hover:bg-[#F7F8FA] dark:hover:bg-[#252830] transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#5B5BD6]" />
                          <span>{t('nav.my_orders')}</span>
                        </Link>

                        <Link
                          to="/favorites"
                          onClick={() => setAccountMenuOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#17191F] dark:text-[#F4F7FC] hover:bg-[#F7F8FA] dark:hover:bg-[#252830] transition-colors"
                        >
                          <Heart className="w-4 h-4 text-[#D64545]" />
                          <span>{t('nav.favorites')}</span>
                        </Link>
                      </div>

                      <div className="p-1 border-t border-[#E6E8EE] dark:border-[#2A2E3B]">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#D64545] hover:bg-[#FDF2F2] dark:hover:bg-[#D64545]/10 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t('nav.logout')}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-1 space-y-1">
                      <Link
                        to="/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-[#5B5BD6] bg-[#EEEEFF] dark:bg-[#5B5BD6]/15 hover:bg-[#E0E0FF] dark:hover:bg-[#5B5BD6]/25 transition-colors"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>{t('nav.sign_in')}</span>
                      </Link>

                      <Link
                        to="/register"
                        onClick={() => setAccountMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#17191F] dark:text-[#F4F7FC] hover:bg-[#F7F8FA] dark:hover:bg-[#252830] transition-colors"
                      >
                        <UserPlus className="w-4 h-4 text-[#737985]" />
                        <span>{t('nav.create_account')}</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative p-2 rounded-lg hover:bg-[#F7F8FA] dark:hover:bg-[#1D2028] text-[#737985] dark:text-[#9CA3AF] hover:text-[#D64545] transition-colors"
              aria-label={t('nav.favorites')}
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D64545] text-white text-[9px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart Button with dynamic quantity and subtotal */}
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1D2028] hover:bg-[#F7F8FA] dark:hover:bg-[#252830] border border-[#E6E8EE] dark:border-[#2A2E3B] hover:border-[#D1D5DB] text-[#17191F] dark:text-white transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              aria-label={t('nav.cart')}
            >
              <div className="relative text-[#5B5BD6]">
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#5B5BD6] text-white text-[9px] font-bold flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-[#737985] dark:text-[#9CA3AF] uppercase font-semibold">
                  {t('nav.cart')}
                </span>
                <span className="text-xs font-bold text-[#17191F] dark:text-[#F4F7FC]">
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
