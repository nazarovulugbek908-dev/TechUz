import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { usePhoneModel } from '../../context/PhoneModelContext';
import { formatUzbekCurrency } from '../../utils/currency';
import { Badge } from '../common/Badge';
import { RatingStars } from '../common/RatingStars';
import { QuantityCounter } from '../common/QuantityCounter';
import { ShoppingBag, Eye, Check, X, Bell, CheckCheck, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ProductCard({
  product,
  onQuickView,
  className = ''
}) {
  const { t, isUz, language } = useLanguage();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { checkCompatibility, hasSelectedModel } = usePhoneModel();

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

  // Compatibility with user's selected phone model
  const { isChecked, isCompatible } = checkCompatibility(product);

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
        'group relative bg-white dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B] rounded-xl p-3 sm:p-3.5 flex flex-col justify-between transition-all duration-150 hover:border-[#5B5BD6]/50 hover:shadow-xs',
        isOutOfStock && 'opacity-85',
        className
      )}
    >
      <div>
        {/* 1. Image Container */}
        <div className="relative w-full aspect-square bg-[#F7F8FA] dark:bg-[#15171D] rounded-lg overflow-hidden mb-3 flex items-center justify-center border border-[#E6E8EE] dark:border-[#2A2E3B]">
          {/* Top Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start max-w-[80%] pointer-events-none">
            {hasSelectedModel && isChecked && product.category !== 'smartphones' && (
              isCompatible ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#16845B] bg-[#EAF6F0] px-1.5 py-0.5 rounded border border-[#CFEBDD]">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  <span>{t('phone_model.compatible_match')}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#D64545] bg-[#FDF2F2] px-1.5 py-0.5 rounded border border-[#FCDADA]">
                  <X className="w-3 h-3 stroke-[2.5]" />
                  <span>{t('phone_model.not_compatible')}</span>
                </span>
              )
            )}

            {product.badge === 'sale' && (
              <Badge variant="sale">{t('common.sale')}</Badge>
            )}
            {product.badge === 'new' && (
              <Badge variant="new">{t('common.new')}</Badge>
            )}
            {product.badge === 'premium' && (
              <Badge variant="premium">{t('common.premium')}</Badge>
            )}
          </div>

          {/* Top-Right Favorite button & Out-of-Stock Pill */}
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
            {isOutOfStock && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#17191F]/80 text-white">
                {t('product.out_of_stock')}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(product);
              }}
              className={cn(
                'w-7 h-7 rounded-md flex items-center justify-center transition-colors cursor-pointer border',
                isFavorite(product.id)
                  ? 'bg-[#FDF2F2] text-[#D64545] border-[#FCDADA]'
                  : 'bg-white/90 dark:bg-[#15171D]/90 text-[#737985] border-[#E6E8EE] dark:border-[#2A2E3B] hover:text-[#D64545] hover:bg-white'
              )}
              aria-label={t('favorites.add_to_favorites')}
            >
              <Heart className={cn('w-3.5 h-3.5', isFavorite(product.id) && 'fill-current')} />
            </button>
          </div>

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
              className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-200 select-none"
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
              className="hidden lg:inline-flex items-center gap-1 absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-white dark:bg-[#15171D] border border-[#E6E8EE] dark:border-[#2A2E3B] text-[#17191F] dark:text-[#F4F7FC] text-xs font-medium shadow-xs hover:bg-[#F7F8FA] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
              aria-label={t('product.quick_view')}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('product.quick_view')}</span>
            </button>
          )}
        </div>

        {/* 2. Color Swatches */}
        {variants.length > 1 && (
          <div className="flex items-center gap-1.5 mb-1.5 px-0.5">
            {variants.map((v, idx) => (
              <button
                key={v.id || idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariantIndex(idx);
                }}
                className={cn(
                  'w-3.5 h-3.5 rounded-full border transition-all cursor-pointer',
                  selectedVariantIndex === idx
                    ? 'ring-2 ring-[#5B5BD6] ring-offset-1 border-white'
                    : 'border-[#D1D5DB] dark:border-[#3B4254]'
                )}
                style={{ backgroundColor: v.color }}
                title={isUz ? v.colorNameUz : v.colorNameRu}
                aria-label={isUz ? v.colorNameUz : v.colorNameRu}
              />
            ))}
          </div>
        )}

        {/* 3. Brand & Rating */}
        <div className="flex items-center justify-between gap-2 mb-1 px-0.5">
          <span className="text-[11px] font-medium text-[#737985] dark:text-[#9CA3AF] uppercase tracking-wider">
            {product.brand}
          </span>
          {product.rating && (
            <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
          )}
        </div>

        {/* 4. Product Title */}
        <Link
          to={`/product/${product.slug}`}
          className="block font-medium text-xs sm:text-sm text-[#17191F] dark:text-[#F4F7FC] line-clamp-2 hover:text-[#5B5BD6] transition-colors leading-snug mb-2.5 px-0.5 min-h-[36px]"
          title={productName}
        >
          {productName}
        </Link>
      </div>

      {/* 5. Pricing & Actions */}
      <div className="pt-2 border-t border-[#E6E8EE] dark:border-[#2A2E3B] space-y-2">
        <div className="flex items-baseline gap-2 px-0.5 flex-wrap">
          <span className="text-sm sm:text-base font-bold text-[#17191F] dark:text-white tracking-tight">
            {formatUzbekCurrency(currentPrice, language)}
          </span>
          {currentOldPrice && currentOldPrice > currentPrice && (
            <span className="text-xs text-[#737985] line-through tabular-nums">
              {formatUzbekCurrency(currentOldPrice, language)}
            </span>
          )}
        </div>

        {!isOutOfStock ? (
          <div className="flex items-center gap-1.5">
            <QuantityCounter
              size="sm"
              quantity={quantity}
              onIncrement={() => setQuantity((q) => Math.min(99, q + 1))}
              onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-20 shrink-0"
            />

            <button
              type="button"
              onClick={handleAddToCart}
              className={cn(
                'flex-1 h-7.5 px-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap overflow-hidden',
                isAddedAnim
                  ? 'bg-[#16845B] text-white'
                  : 'bg-[#5B5BD6] hover:bg-[#4949BC] text-white active:bg-[#3C3CA8]'
              )}
              aria-label={t('product.add_to_cart')}
            >
              {isAddedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                  <span className="truncate">{t('product.added_to_cart')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{t('product.add_to_cart')}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleNotifyMe}
            disabled={isNotified}
            className={cn(
              'w-full h-7.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border',
              isNotified
                ? 'bg-[#EAF6F0] text-[#16845B] border-[#CFEBDD]'
                : 'bg-[#F7F8FA] dark:bg-[#15171D] text-[#737985] border-[#E6E8EE] dark:border-[#2A2E3B] hover:text-[#17191F]'
            )}
          >
            {isNotified ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 text-[#16845B]" />
                <span>{t('product.notify_success')}</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" />
                <span>{t('product.notify_me')}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
