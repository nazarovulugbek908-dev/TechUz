import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useFavorites } from '../context/FavoritesContext';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/common/Button';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';

export function FavoritesPage() {
  const { t, isUz } = useLanguage();
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            {t('nav.home') || 'Bosh sahifa'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">
            {t('favorites.title')}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E6E8EE] dark:border-slate-800">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17191F] dark:text-white flex items-center gap-3">
              <span>{t('favorites.title')}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                {favorites.length}
              </span>
            </h1>
            <p className="text-sm text-[#737985] dark:text-slate-400">
              {t('favorites.subtitle')}
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                icon={Trash2}
                onClick={clearFavorites}
                className="text-rose-600 hover:text-rose-700 hover:border-rose-300 dark:text-rose-400 cursor-pointer"
              >
                {t('favorites.clear_list')}
              </Button>
              <Link to="/shop">
                <Button variant="primary" size="sm" icon={ShoppingBag} className="cursor-pointer">
                  {t('favorites.continue_shopping')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-[#E6E8EE] dark:border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-xs space-y-5">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-[#17191F] dark:text-white">
              {t('favorites.empty_title')}
            </h2>
            <p className="text-sm text-[#737985] dark:text-slate-400">
              {t('favorites.empty_desc')}
            </p>
          </div>
          <div className="pt-2">
            <Link to="/shop">
              <Button variant="primary" size="md" icon={ShoppingBag} className="cursor-pointer">
                {t('favorites.go_to_catalog')}
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
