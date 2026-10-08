import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { usePhoneModel } from '../../context/PhoneModelContext';
import { formatUzbekCurrency } from '../../utils/currency';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { RatingStars } from '../common/RatingStars';
import { QuantityCounter } from '../common/QuantityCounter';
import { ShoppingBag, Eye, Check, X, Bell, CheckCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ProductCard({
  product,
  onQuickView,
  className = ''
}) {
  const { t, isUz, language } = useLanguage();
  const { addToCart } = useCart();
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
        'group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-300 dark:hover:border-orange-900/60 hover:-translate-y-1',
        isOutOfStock && 'opacity-90',
        className
      )}
    >
      <div>
        {/* 1. Badges & Quick View Hover Trigger */}
        <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-800/60 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center">
          {/* Top Badges (Sale, New, Premium, Compatibility) */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start max-w-[85%] pointer-events-none">
            {/* Phone model compatibility badge */}
            {hasSelectedModel && isChecked && product.category !== 'smartphones' && (
              isCompatible ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50/95 dark:bg-emerald-950/90 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-300/80 shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>{t('phone_model.compatible_match')}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-700 bg-rose-50/95 dark:bg-rose-950/90 dark:text-rose-300 px-2 py-0.5 rounded-md border border-rose-300/80 shadow-xs">
                  <X className="w-3 h-3 stroke-[3]" />
                  <span>{t('phone_model.not_compatible')}</span>
                </span>
              )
            )}

            {/* Standard Badges */}
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

          {/* Out of stock top-right label */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/80 text-white dark:bg-slate-800 backdrop-blur-xs">
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

          {/* Desktop Quick View Overlay Button */}
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="hidden lg:inline-flex items-center gap-1.5 absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white text-xs font-bold shadow-md hover:bg-[#FF7A00] hover:text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 cursor-pointer z-10"
              aria-label={t('product.quick_view')}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('product.quick_view')}</span>
            </button>
          )}
        </div>

        {/* 2. Color Swatches */}
        {variants.length > 1 && (
          <div className="flex items-center gap-1.5 mb-2 px-0.5">
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
                  'w-4 h-4 rounded-full border transition-all cursor-pointer p-0.5',
                  selectedVariantIndex === idx
                    ? 'ring-2 ring-[#FF7A00] ring-offset-1 border-white scale-110'
                    : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                )}
                style={{ backgroundColor: v.color }}
                title={isUz ? v.colorNameUz : v.colorNameRu}
                aria-label={isUz ? v.colorNameUz : v.colorNameRu}
              />
            ))}
          </div>
        )}

        {/* 3. Rating & Brand */}
        <div className="flex items-center justify-between gap-2 mb-1 px-0.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {product.brand}
          </span>
          <RatingStars rating={product.rating || 5} reviewsCount={product.reviewsCount} size="sm" />
        </div>

        {/* 4. Product Title (Clamped to 2 lines) */}
        <Link
          to={`/product/${product.slug}`}
          className="block font-semibold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-[#FF7A00] transition-colors leading-snug mb-3 px-0.5 min-h-[38px]"
          title={productName}
        >
          {productName}
        </Link>
      </div>

      {/* 5. Pricing & Action Controls */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        {/* Prices */}
        <div className="flex items-baseline gap-2 px-0.5 flex-wrap">
          <span className="text-sm sm:text-base font-black font-heading text-slate-900 dark:text-white tracking-tight">
            {formatUzbekCurrency(currentPrice, language)}
          </span>
          {currentOldPrice && currentOldPrice > currentPrice && (
            <span className="text-xs text-slate-400 line-through tabular-nums">
              {formatUzbekCurrency(currentOldPrice, language)}
            </span>
          )}
        </div>

        {/* In-Stock vs Out-of-Stock Actions */}
        {!isOutOfStock ? (
          <div className="flex items-center gap-2">
            {/* Compact stepper */}
            <QuantityCounter
              size="sm"
              quantity={quantity}
              onIncrement={() => setQuantity((q) => Math.min(99, q + 1))}
              onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-22 shrink-0"
            />

            {/* Orange Add To Cart CTA Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={cn(
                'flex-1 h-8 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs',
                isAddedAnim
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FF7A00] hover:bg-[#E66E00] text-white active:scale-95'
              )}
              aria-label={t('product.add_to_cart')}
            >
              {isAddedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{t('product.added_to_cart')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('product.add_to_cart')}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Out of stock Notify Button */
          <button
            type="button"
            onClick={handleNotifyMe}
            disabled={isNotified}
            className={cn(
              'w-full h-8 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border',
              isNotified
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            )}
          >
            {isNotified ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('product.notify_success')}</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('product.notify_me')}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
