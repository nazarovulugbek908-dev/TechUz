import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from '../common/Drawer';
import { Button } from '../common/Button';
import { EmptyState } from '../feedback/EmptyState';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatUzbekCurrency } from '../../utils/currency';
import { ShoppingBag, Trash2, Truck, Check, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export function CartDrawer({
  isOpen,
  onClose
}) {
  const { t, isUz, language } = useLanguage();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    total
  } = useCart();

  const FREE_DELIVERY_THRESHOLD = 500000;
  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={t('cart.title')}
      maxWidth="max-w-md"
    >
      {cartItems.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={t('cart.empty_title')}
          description={t('cart.empty_desc')}
          actionLabel={t('cart.start_shopping')}
          onAction={onClose}
        />
      ) : (
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* 1. Free Delivery Progress Bar */}
            <div className="p-3.5 bg-orange-50/80 dark:bg-orange-950/30 rounded-2xl border border-orange-200/80 dark:border-orange-900/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <Truck className="w-4 h-4 text-[#FF7A00]" />
                  <span>
                    {remainingForFreeDelivery === 0
                      ? t('cart.free_delivery_achieved')
                      : t('cart.delivery_threshold_msg')}
                  </span>
                </div>
                {remainingForFreeDelivery > 0 && (
                  <span className="text-[#FF7A00] font-black">
                    {formatUzbekCurrency(remainingForFreeDelivery, language)}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-orange-400 to-[#FF7A00] rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryPercent}%` }}
                />
              </div>
            </div>

            {/* 2. Items List */}
            <div className="space-y-3">
              {cartItems.map((item) => {
                const name = isUz ? (item.nameUz || item.name_uz) : (item.nameRu || item.name_ru);
                const image = item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';

                return (
                  <div
                    key={`${item.id}-${item.selectedColor || ''}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80"
                  >
                    <img
                      src={image}
                      alt={name}
                      className="w-16 h-16 object-contain rounded-xl bg-white dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-700 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={name}>
                        {name}
                      </h4>

                      {/* Variant badge if any */}
                      {item.selectedColor && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/10"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                        </div>
                      )}

                      <span className="text-xs font-extrabold text-[#FF7A00] block mt-1">
                        {formatUzbekCurrency(item.price, language)}
                      </span>

                      {/* Quantity counter & Remove */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-300 cursor-pointer font-bold"
                          >
                            -
                          </button>
                          <span className="px-2.5 text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-300 cursor-pointer font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.selectedColor)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          aria-label={t('cart.remove_item')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Summary Footer */}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex justify-between text-xs text-slate-500">
              <span>{t('cart.subtotal')}:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatUzbekCurrency(subtotal, language)}
              </span>
            </div>

            <div className="flex justify-between text-xs text-slate-500">
              <span>{t('cart.delivery')}:</span>
              <span className="font-bold text-emerald-600">
                {deliveryFee === 0 ? t('cart.delivery_free') : formatUzbekCurrency(deliveryFee, language)}
              </span>
            </div>

            <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>{t('cart.total')}:</span>
              <span className="text-[#FF7A00] font-black text-base">
                {formatUzbekCurrency(total, language)}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <Link to="/checkout" onClick={onClose} className="block w-full">
                <Button variant="primary" className="w-full">
                  {t('cart.checkout_button')}
                </Button>
              </Link>

              <button
                type="button"
                onClick={clearCart}
                className="w-full text-center text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors py-1 cursor-pointer"
              >
                {t('cart.clear_cart')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
