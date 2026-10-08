import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatUzbekCurrency } from '../utils/currency';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/feedback/EmptyState';
import {
  ShoppingBag,
  Trash2,
  Truck,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export function CartPage() {
  const { t, language, isUz } = useLanguage();
  const navigate = useNavigate();
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

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon={ShoppingBag}
          title={t('cart.empty_title')}
          description={t('cart.empty_desc')}
          actionLabel={t('cart.start_shopping')}
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6">
        <Link to="/" className="hover:text-slate-600 dark:hover:text-slate-200">
          {t('nav.home')}
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300">{t('cart.title')}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('cart.title')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {cartItems.length} {t('common.products_count_suffix') || 'ta mahsulot'}
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t('cart.clear_cart')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Delivery Banner */}
          <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Truck className="w-5 h-5 text-[#FF7A00]" />
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

            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-orange-400 to-[#FF7A00] rounded-full transition-all duration-300"
                style={{ width: `${freeDeliveryPercent}%` }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            {cartItems.map((item) => {
              const name = isUz ? (item.nameUz || item.name_uz || item.name) : (item.nameRu || item.name_ru || item.name);
              const image = item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';

              return (
                <Card
                  key={`${item.id}-${item.selectedColor || ''}`}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                    <img
                      src={image}
                      alt={name}
                      className="w-20 h-20 object-contain rounded-xl bg-slate-50 dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${item.slug || item.id}`}
                        className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-[#FF7A00] transition-colors line-clamp-2"
                      >
                        {name}
                      </Link>

                      {item.selectedColor && (
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                          <span>Rang:</span>
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                        </div>
                      )}

                      <div className="text-sm font-black text-[#FF7A00] mt-1.5 sm:hidden">
                        {formatUzbekCurrency(item.price, language)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 font-black cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 font-black cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right hidden sm:block min-w-32">
                      <div className="text-base font-black text-slate-900 dark:text-white">
                        {formatUzbekCurrency(item.price * item.quantity, language)}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-xs text-slate-400">
                          {formatUzbekCurrency(item.price, language)} / ta
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id, item.selectedColor)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                      title={t('cart.remove_item')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#FF7A00] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('cart.continue_shopping')}</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {t('cart.order_summary')}
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t('cart.subtotal')}:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatUzbekCurrency(subtotal, language)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t('cart.delivery')}:</span>
                <span className="font-bold text-emerald-600">
                  {deliveryFee === 0 ? t('cart.delivery_free') : formatUzbekCurrency(deliveryFee, language)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {t('cart.total')}:
                </span>
                <span className="text-xl font-black text-[#FF7A00]">
                  {formatUzbekCurrency(total, language)}
                </span>
              </div>
            </div>

            <Link to="/checkout" className="block w-full pt-2">
              <Button variant="primary" size="lg" className="w-full justify-center">
                <span>{t('cart.checkout_button')}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          {/* Value props */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t('home.feature_warranty_desc')}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <RotateCcw className="w-4 h-4 text-sky-500 shrink-0" />
              <span>14 kun ichida almashtirish kafolati</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
