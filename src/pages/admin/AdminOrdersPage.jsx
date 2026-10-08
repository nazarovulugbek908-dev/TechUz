import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { orderService } from '../../services/orderService';
import { formatUzbekCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatters';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AdminOrderDetailModal } from '../../components/admin/AdminOrderDetailModal';
import { ShoppingCart, Search, Eye, Calendar, CreditCard } from 'lucide-react';

export function AdminOrdersPage() {
  const { t, language } = useLanguage();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderService.getOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

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

  const filteredOrders = orders.filter((ord) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = (ord.orderNumber || '').toLowerCase().includes(q);
      const matchName = (ord.customer?.fullName || '').toLowerCase().includes(q);
      const matchPhone = (ord.customer?.phone || '').toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }

    if (statusFilter !== 'all' && ord.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-[#FF7A00]" />
            {t('admin.orders_title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('admin.orders_subtitle')} ({filteredOrders.length})
          </p>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="p-4 sm:p-5 border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder={t('admin.search_orders_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: t('admin.all_orders_status_filter') },
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
      </Card>

      {/* Orders Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <Card className="p-0 border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">{t('order.order_id')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.customer_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.date_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.items_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('cart.total')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.status_col')}</th>
                  <th className="py-3.5 px-4 font-bold text-right">{t('admin.actions_col')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      {t('admin.no_orders_found')}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr
                      key={ord.id || ord.orderNumber}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                      onClick={() => setSelectedOrder(ord)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        #{ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {ord.customer?.fullName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {ord.customer?.phone}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(ord.createdAt, language)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {ord.items?.reduce((sum, item) => sum + item.quantity, 0)} {t('common.piece_short')}
                      </td>
                      <td className="py-3.5 px-4 font-black text-[#FF7A00]">
                        {formatUzbekCurrency(ord.total, language)}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(ord.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          icon={Eye}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(ord);
                          }}
                          className="text-slate-600 hover:text-[#FF7A00]"
                        >
                          {t('admin.view_btn')}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Order Details & Status Modal */}
      {selectedOrder && (
        <AdminOrderDetailModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={async () => {
            await loadOrders();
            const { data } = await orderService.getOrderByNumber(selectedOrder.orderNumber);
            if (data) setSelectedOrder(data);
          }}
        />
      )}
    </div>
  );
}
