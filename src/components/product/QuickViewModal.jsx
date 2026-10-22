import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { RatingStars } from '../common/RatingStars';
import { QuantityCounter } from '../common/QuantityCounter';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../context/CartContext';
import { usePhoneModel } from '../../context/PhoneModelContext';
import { formatUzbekCurrency } from '../../utils/currency';
import { ShoppingBag, Check, X, ExternalLink } from 'lucide-react';
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
      maxWidth="max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Left: Gallery */}
        <div className="space-y-2.5">
          <div className="w-full aspect-square bg-[#F7F8FA] dark:bg-[#15171D] rounded-lg overflow-hidden border border-[#E6E8EE] dark:border-[#2A2E3B] flex items-center justify-center p-3 relative">
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
              <div className="absolute top-2.5 left-2.5">
                {isCompatible ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#16845B] bg-[#EAF6F0] px-2 py-0.5 rounded border border-[#CFEBDD]">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    <span>{t('phone_model.compatible_match')}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#D64545] bg-[#FDF2F2] px-2 py-0.5 rounded border border-[#FCDADA]">
                    <X className="w-3 h-3 stroke-[2.5]" />
                    <span>{t('phone_model.not_compatible')}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={cn(
                    'w-14 h-14 rounded-md border p-1 bg-white dark:bg-[#1D2028] shrink-0 cursor-pointer transition-colors',
                    selectedImageIndex === idx
                      ? 'border-[#00A859] ring-1 ring-[#00A859]'
                      : 'border-[#E6E8EE] dark:border-[#2A2E3B] opacity-60 hover:opacity-100'
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
        <div className="flex flex-col justify-between space-y-3.5">
          <div className="space-y-2.5">
            {/* Brand & Stock */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#00A859] uppercase tracking-wider">
                {product.brand}
              </span>
              <span
                className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded',
                  !isOutOfStock
                    ? 'bg-[#EAF6F0] text-[#16845B] border border-[#CFEBDD]'
                    : 'bg-[#FDF2F2] text-[#D64545] border border-[#FCDADA]'
                )}
              >
                {!isOutOfStock ? t('product.in_stock') : t('product.out_of_stock')}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-[#17191F] dark:text-[#F4F7FC] leading-snug">
              {productName}
            </h3>

            {/* Rating */}
            {product.rating && (
              <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="sm" />
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2.5 pt-0.5">
              <span className="text-xl font-bold text-[#17191F] dark:text-white">
                {formatUzbekCurrency(currentPrice, language)}
              </span>
              {currentOldPrice && currentOldPrice > currentPrice && (
                <span className="text-xs text-[#737985] line-through tabular-nums">
                  {formatUzbekCurrency(currentOldPrice, language)}
                </span>
              )}
            </div>

            {/* Description snippet */}
            {productDesc && (
              <p className="text-xs text-[#737985] dark:text-[#9CA3AF] leading-relaxed line-clamp-3">
                {productDesc}
              </p>
            )}

            {/* Color variants if any */}
            {variants.length > 1 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-medium text-[#737985] dark:text-[#9CA3AF]">
                  {t('product.colors')}:{' '}
                  <strong className="text-[#17191F] dark:text-white">
                    {isUz ? activeVariant?.colorNameUz : activeVariant?.colorNameRu}
                  </strong>
                </span>
                <div className="flex items-center gap-2">
                  {variants.map((v, idx) => (
                    <button
                      key={v.id || idx}
                      type="button"
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={cn(
                        'w-6 h-6 rounded-full border transition-all cursor-pointer',
                        selectedVariantIndex === idx
                          ? 'ring-2 ring-[#00A859] ring-offset-2 border-white'
                          : 'border-[#D1D5DB] dark:border-[#3B4254]'
                      )}
                      style={{ backgroundColor: v.color }}
                      title={isUz ? v.colorNameUz : v.colorNameRu}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-3 border-t border-[#E6E8EE] dark:border-[#2A2E3B]">
            {!isOutOfStock ? (
              <div className="flex items-center gap-2">
                <QuantityCounter
                  quantity={quantity}
                  onIncrement={() => setQuantity((q) => Math.min(99, q + 1))}
                  onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-24 shrink-0"
                />

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={cn(
                    'flex-1 h-9 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs',
                    isAdded
                      ? 'bg-[#16845B] text-white'
                      : 'bg-[#00A859] hover:bg-[#00924C] text-white active:bg-[#007D40]'
                  )}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{t('product.added_to_cart')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t('product.add_to_cart')}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-[#FDF2F2] border border-[#FCDADA] text-[#D64545] text-xs font-semibold text-center">
                {t('product.out_of_stock')}
              </div>
            )}

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#00A859] hover:text-[#00924C] transition-colors py-1"
            >
              <span>{t('product.view_full_details')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
