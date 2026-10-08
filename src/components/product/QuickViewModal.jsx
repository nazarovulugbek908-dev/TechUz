import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { RatingStars } from '../common/RatingStars';
import { QuantityCounter } from '../common/QuantityCounter';
import { Badge } from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { usePhoneModel } from '../../context/PhoneModelContext';
import { formatUzbekCurrency } from '../../utils/currency';
import { ShoppingBag, Check, ShieldCheck, ArrowRight, X, ExternalLink } from 'lucide-react';
import { cn } from '../../utils/cn';

export function QuickViewModal({
  isOpen,
  onClose,
  product
}) {
  const { t, isUz, language } = useLanguage();
  const { addToCart } = useCart();
  const { checkCompatibility, hasSelectedModel } = usePhoneModel();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setSelectedVariantIndex(0);
    setSelectedImageIndex(0);
    setQuantity(1);
    setIsAdded(false);
  }, [product]);

  if (!product) return null;

  const variants = product.variants || [];
  const activeVariant = variants[selectedVariantIndex] || null;
  const currentPrice = activeVariant?.price || product.price;
  const currentOldPrice = activeVariant?.oldPrice || product.oldPrice;
  const currentStock = activeVariant?.stock !== undefined ? activeVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const productName = isUz ? (product.nameUz || product.name_uz) : (product.nameRu || product.name_ru);
  const productDesc = isUz ? (product.descUz || product.description_uz) : (product.descRu || product.description_ru);
  const images = product.images || ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'];

  const { isChecked, isCompatible } = checkCompatibility(product);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, activeVariant?.color || null);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('product.quick_view')}
      maxWidth="max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Gallery */}
        <div className="space-y-3">
          <div className="w-full aspect-square bg-slate-50 dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center p-4 relative">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={productName}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-contain select-none"
            />

            {/* Compatibility Tag */}
            {hasSelectedModel && isChecked && product.category !== 'smartphones' && (
              <div className="absolute top-3 left-3">
                {isCompatible ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-300 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{t('phone_model.compatible_match')}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-lg border border-rose-300 shadow-xs">
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{t('phone_model.not_compatible')}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={cn(
                    'w-16 h-16 rounded-xl border p-1 bg-slate-50 dark:bg-slate-800 shrink-0 cursor-pointer transition-all',
                    selectedImageIndex === idx
                      ? 'border-[#FF7A00] ring-2 ring-orange-500/20'
                      : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                  )}
                >
                  <img
                    src={img}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Controls */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Brand & Stock */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider">
                {product.brand}
              </span>
              <span
                className={cn(
                  'text-xs font-bold px-2 py-0.5 rounded-md',
                  !isOutOfStock
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                )}
              >
                {!isOutOfStock ? t('product.in_stock') : t('product.out_of_stock')}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white leading-snug">
              {productName}
            </h3>

            {/* Rating */}
            <RatingStars rating={product.rating || 5} reviewsCount={product.reviewsCount} />

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-black font-heading text-[#FF7A00]">
                {formatUzbekCurrency(currentPrice, language)}
              </span>
              {currentOldPrice && currentOldPrice > currentPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatUzbekCurrency(currentOldPrice, language)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {productDesc}
            </p>

            {/* Variants Selector */}
            {variants.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {t('product.select_variant')}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, idx) => (
                    <button
                      key={v.id || idx}
                      type="button"
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer',
                        selectedVariantIndex === idx
                          ? 'border-[#FF7A00] bg-orange-50 text-[#FF7A00] dark:bg-orange-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      )}
                    >
                      {v.color && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: v.color }}
                        />
                      )}
                      <span>{isUz ? v.colorNameUz : v.colorNameRu}</span>
                      {v.storage && <span className="opacity-70">({v.storage})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty guarantee highlight */}
            {product.warrantyMonths && (
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  {product.warrantyMonths} {t('product.warranty_months')}
                </span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              {!isOutOfStock && (
                <QuantityCounter
                  quantity={quantity}
                  onIncrement={() => setQuantity((q) => Math.min(99, q + 1))}
                  onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-28 shrink-0"
                />
              )}

              <Button
                variant="primary"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1"
                icon={isAdded ? Check : ShoppingBag}
              >
                {isAdded
                  ? t('product.added_to_cart')
                  : isOutOfStock
                  ? t('product.out_of_stock')
                  : t('product.add_to_cart')}
              </Button>
            </div>

            {/* View Full Product Details Link */}
            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#FF7A00] transition-colors pt-1"
            >
              <span>{t('product.view_details')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
