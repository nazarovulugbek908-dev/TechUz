import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../context/CartContext';
import { formatUzbekCurrency } from '../../utils/currency';
import { ShoppingBag, Eye, Check, Bell, CheckCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ProductCard({
  product,
  onQuickView,
  className = ''
}) {
  const { t, isUz, language } = useLanguage();
  const { addToCart } = useCart();

  // Selected variant state
  const variants = product.variants || [];
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isNotified, setIsNotified] = useState(false);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const activeVariant = variants[selectedVariantIndex] || null;
  const currentPrice = activeVariant?.price || product.price;
  const currentOldPrice = activeVariant?.oldPrice || product.oldPrice;
  const currentStock = activeVariant?.stock !== undefined ? activeVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const productName = isUz ? (product.nameUz || product.name_uz) : (product.nameRu || product.name_ru);
  const productImage = product.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product, quantity, activeVariant?.color || null);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1200);
  };

  const handleNotifyMe = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNotified(true);
  };

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-[#1D2028] border border-gray-100 dark:border-[#2A2E3B] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 hover:border-gray-200 hover:shadow-md',
        isOutOfStock && 'opacity-85',
        className
      )}
    >
      <div>
        {/* 1. Image Container */}
        <div className="relative w-full aspect-square bg-[#F8F9FA] dark:bg-[#15171D] rounded-xl overflow-hidden mb-3 flex items-center justify-center border border-gray-100/80 dark:border-[#2A2E3B]/60">
          {/* Out-of-Stock Pill if applicable */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 z-10">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#17191F]/80 text-white">
                {t('product.out_of_stock')}
              </span>
            </div>
          )}

          {/* Product Image */}
          <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center p-3">
            <img
              src={productImage}
              alt={productName}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 select-none"
            />
          </Link>

          {/* Quick View Button */}
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="hidden lg:inline-flex items-center gap-1 absolute bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white dark:bg-[#15171D] border border-gray-200 dark:border-[#2A2E3B] text-gray-800 dark:text-gray-100 text-xs font-medium shadow-xs hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
              aria-label={t('product.quick_view')}
            >
              <Eye className="w-3.5 h-3.5 text-[#00A859]" />
              <span>{t('product.quick_view')}</span>
            </button>
          )}
        </div>

        {/* 3. Rating Stars (5 amber stars matching screenshot) */}
        <div className="flex items-center gap-1 mb-1 px-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          {product.reviewsCount > 0 && (
            <span className="text-[10px] text-gray-400 ml-1">({product.reviewsCount})</span>
          )}
        </div>

        {/* 4. Product Title */}
        <Link
          to={`/product/${product.slug}`}
          className="block font-medium text-xs sm:text-sm text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-[#00A859] transition-colors leading-snug mb-2 px-0.5 min-h-[36px]"
          title={productName}
        >
          {productName}
        </Link>
      </div>

      {/* 5. Pricing & Circular Add to Cart Button (Screenshot Style) */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-gray-100 dark:border-[#2A2E3B]/70 mt-1">
        <div className="flex flex-col">
          {currentOldPrice && currentOldPrice > currentPrice && (
            <span className="text-xs text-gray-400 line-through tabular-nums leading-none mb-0.5">
              {formatUzbekCurrency(currentOldPrice, language)}
            </span>
          )}
          <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
            {formatUzbekCurrency(currentPrice, language)}
          </span>
        </div>

        {/* Circular Green Cart Button or Notify Button */}
        {!isOutOfStock ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              'w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95 shrink-0',
              isAddedAnim
                ? 'bg-emerald-600'
                : 'bg-[#00A859] hover:bg-[#00924C] active:bg-[#007D40]'
            )}
            aria-label={t('product.add_to_cart')}
            title={t('product.add_to_cart')}
          >
            {isAddedAnim ? (
              <Check className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <ShoppingBag className="w-4.5 h-4.5" />
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNotifyMe}
            disabled={isNotified}
            className={cn(
              'h-8 px-2.5 rounded-full font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer border',
              isNotified
                ? 'bg-[#E6F7EF] text-[#00A859] border-[#00A859]/30'
                : 'bg-gray-50 dark:bg-[#15171D] text-gray-500 border-gray-200 dark:border-[#2A2E3B] hover:text-gray-900'
            )}
            title={t('product.notify_me')}
          >
            {isNotified ? (
              <CheckCheck className="w-3.5 h-3.5 text-[#00A859]" />
            ) : (
              <Bell className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
