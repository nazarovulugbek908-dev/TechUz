import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { orderService } from '../../services/orderService';
import { formatUzbekCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatters';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/feedback/EmptyState';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { Package, ArrowLeft, Calendar, MapPin, CreditCard, ShoppingBag } from 'lucide-react';

export function AccountOrdersPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const { data } = await orderService.getOrders(user?.id);
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">{t('order.status_pending')}</Badge>;
      case 'confirmed':
        return <Badge variant="info">{t('order.status_confirmed')}</Badge>;
      case 'processing':
        return <Badge variant="info">{t('order.status_processing')}</Badge>;
      case 'shipped':
        return <Badge variant="primary">{t('order.status_shipped')}</Badge>;
      case 'delivered':
        return <Badge variant="success">{t('order.status_delivered')}</Badge>;
      case 'completed':
        return <Badge variant="success">{t('order.status_completed')}</Badge>;
      case 'cancelled':
        return <Badge variant="error">{t('order.status_cancelled')}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          {t('nav.home')}
        </Link>
        <span>/</span>
        <Link to="/account" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          {t('account.profile_title')}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-bold">
          {t('account.my_orders')}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-[#FF7A00]" />
            {t('account.my_orders')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('account.orders_subtitle')}
          </p>
        </div>
        <Link to="/account">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            {t('account.back_to_profile')}
          </Button>
        </Link>
      </div>

      {/* Order List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-8 border-slate-200/80 dark:border-slate-800">
          <EmptyState
            title={t('account.orders_empty_title')}
            description={t('account.orders_empty_desc')}
            icon={ShoppingBag}
            actionLabel={t('account.start_shopping_btn')}
            actionHref="/shop"
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card
              key={order.id || order.orderNumber}
              className="p-6 sm:p-7 border-slate-200/80 dark:border-slate-800 space-y-6 hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                      #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(order.createdAt, language)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      {order.paymentMethod === 'cash' ? t('checkout.payment_cash') : order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-[11px] text-slate-400 block">{t('cart.total')}</span>
                  <span className="text-lg font-black text-[#FF7A00] font-heading">
                    {formatUzbekCurrency(order.total, language)}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 p-1 border border-slate-200/70 dark:border-slate-700/60 shrink-0 overflow-hidden">
                        <img
                          src={item.image || 'https://placehold.co/100x100?text=Product'}
                          alt={language === 'ru' ? item.name_ru : item.name_uz}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                          {language === 'ru' ? item.name_ru : item.name_uz}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {item.color && <span>{item.color} • </span>}
                          {item.quantity} {t('common.piece_short')} × {formatUzbekCurrency(item.price, language)}
                        </p>
                      </div>
                    </div>

                    <div className="font-bold text-xs text-slate-900 dark:text-white whitespace-nowrap">
                      {formatUzbekCurrency(item.price * item.quantity, language)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address Details */}
              {order.customer?.streetAddress && (
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2 pt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {order.customer.region}, {order.customer.cityDistrict ? `${order.customer.cityDistrict}, ` : ''}{order.customer.streetAddress}
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
