import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { orderService } from '../../services/orderService';
import { formatUzbekCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { User, Phone, MapPin, CreditCard, Calendar, Package, FileText, CheckCircle2 } from 'lucide-react';

export function AdminOrderDetailModal({ order, isOpen, onClose, onStatusUpdated }) {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState(order?.status || 'pending');
  const [updating, setUpdating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!order) return null;

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setUpdating(true);
    await orderService.updateOrderStatus(order.id || order.orderNumber, newStatus);
    setUpdating(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    if (onStatusUpdated) onStatusUpdated();
  };

  const getStatusBadge = (s) => {
    switch (s) {
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
        return <Badge variant="neutral">{s}</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('order.order_id')} #${order.orderNumber}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-xs">
        {/* Top Summary Header */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">{t('admin.status_col')}:</span>
              {getStatusBadge(status)}
              {savedSuccess && (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('common.saved')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(order.createdAt, language)}
            </p>
          </div>

          <div className="w-48">
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              {t('admin.change_status_label')}
            </label>
            <Select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              options={[
                { value: 'pending', label: t('order.status_pending') },
                { value: 'confirmed', label: t('order.status_confirmed') },
                { value: 'processing', label: t('order.status_processing') },
                { value: 'shipped', label: t('order.status_shipped') },
                { value: 'delivered', label: t('order.status_delivered') },
                { value: 'completed', label: t('order.status_completed') },
                { value: 'cancelled', label: t('order.status_cancelled') }
              ]}
            />
          </div>
        </div>

        {/* Customer Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <h3 className="font-bold font-heading text-slate-900 dark:text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#FF7A00]" />
              {t('admin.customer_info_title')}
            </h3>
            <p className="font-bold text-slate-800 dark:text-slate-200">{order.customer?.fullName}</p>
            <p className="text-slate-500 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              {order.customer?.phone}
            </p>
            <p className="text-[11px] text-slate-400">
              {order.isGuest ? t('checkout.guest_order') : t('checkout.registered_customer')}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold font-heading text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF7A00]" />
              {t('admin.delivery_address_title')}
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              {order.customer?.region}, {order.customer?.cityDistrict ? `${order.customer?.cityDistrict}, ` : ''}{order.customer?.streetAddress}
            </p>
            {order.customer?.notes && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                "{order.customer.notes}"
              </p>
            )}
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="space-y-3">
          <h3 className="font-bold font-heading text-slate-900 dark:text-white flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-[#FF7A00]" />
            {t('cart.items_title')} ({order.items?.length || 0})
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
            {order.items?.map((item, idx) => (
              <div key={idx} className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || 'https://placehold.co/80x80?text=Prod'}
                    alt=""
                    className="w-10 h-10 rounded-lg object-contain bg-slate-50 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {language === 'ru' ? item.name_ru : item.name_uz}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {item.color && <span>{item.color} • </span>}
                      {item.quantity} {t('common.piece_short')} × {formatUzbekCurrency(item.price, language)}
                    </p>
                  </div>
                </div>

                <div className="font-bold text-slate-900 dark:text-white">
                  {formatUzbekCurrency(item.price * item.quantity, language)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Totals */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
          <div className="flex justify-between text-slate-500">
            <span>{t('cart.subtotal')}:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {formatUzbekCurrency(order.subtotal, language)}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>{t('cart.delivery')}:</span>
            <span className="font-bold text-emerald-600">
              {order.deliveryFee === 0 ? t('cart.free_delivery') : formatUzbekCurrency(order.deliveryFee, language)}
            </span>
          </div>
          <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
            <span>{t('cart.total')}:</span>
            <span className="text-[#FF7A00] font-heading">
              {formatUzbekCurrency(order.total, language)}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
