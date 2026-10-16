import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { authService } from '../../services/authService';
import { orderService } from '../../services/orderService';
import { formatUzbekCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatters';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  CreditCard,
  Calendar,
  ExternalLink,
  UserCheck,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

export function AdminCustomersPage() {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState(() => {
    return searchParams.get('search') || searchParams.get('q') || '';
  });
  const [cityFilter, setCityFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q') || '';
    setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [{ data: userList }, { data: orderList }] = await Promise.all([
          authService.getUsers(),
          orderService.getOrders()
        ]);

        const rawUsers = userList || [];
        const rawOrders = orderList || [];

        // Build customer stats map
        const userStats = rawUsers.map((u) => {
          const userOrders = rawOrders.filter(
            (o) => o.userId === u.id || o.customer?.phone === u.phone || o.customer?.fullName === u.fullName
          );
          const totalSpent = userOrders
            .filter((o) => o.status !== 'cancelled')
            .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

          return {
            ...u,
            ordersCount: userOrders.length,
            totalSpent,
            orders: userOrders
          };
        });

        setCustomers(userStats);
        setOrders(rawOrders);
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const cities = Array.from(new Set(customers.map((c) => c.city).filter(Boolean)));

  const filteredCustomers = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        c.fullName?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (cityFilter !== 'all' && c.city !== cityFilter) {
      return false;
    }
    return true;
  });

  const totalSpentAll = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            {t('admin.customers_title')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {t('admin.customers_total_prefix')} {customers.length} {t('admin.customers_nafar')}
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#15171D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400">
                {t('admin.customers_total_card')}
              </p>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-white font-heading mt-0.5">
                {customers.length}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#15171D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400">
                {t('admin.customers_active_card')}
              </p>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-white font-heading mt-0.5">
                {customers.filter((c) => c.ordersCount > 0).length}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#15171D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#10A66A] flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-400">
                {t('admin.customers_spent_card')}
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-[#10A66A] font-heading mt-0.5">
                {formatUzbekCurrency(totalSpentAll, language)}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 sm:p-5 border-neutral-200/80 dark:border-neutral-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              placeholder={t('admin.customers_search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>
          <div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">
                {t('admin.customers_all_regions')}
              </option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <Card className="p-0 border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">{t('admin.customers_col_name')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.customers_col_contacts')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.customers_col_city')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.customers_col_orders')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.customers_col_spent')}</th>
                  <th className="py-3.5 px-4 font-bold text-right">{t('admin.customers_col_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      {t('admin.customers_not_found')}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => {
                    const initials = (c.fullName || 'Mijoz')
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();

                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCustomer(c)}
                        className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-xs shrink-0 border border-brand-200 dark:border-brand-900">
                              {initials}
                            </div>
                            <div>
                              <p className="font-bold text-neutral-900 dark:text-white leading-tight">
                                {c.fullName}
                              </p>
                              <p className="text-[11px] text-neutral-400 mt-0.5">
                                ID: {c.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <p className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-brand-600 dark:text-brand-400" />
                              {c.phone}
                            </p>
                            <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-neutral-400" />
                              {c.email}
                            </p>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate max-w-[180px]">{c.city || 'Quvasoy'}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-[11px] border border-blue-200 dark:border-blue-900">
                            <ShoppingBag className="w-3 h-3" />
                            {c.ordersCount} {t('admin.orders_count_suffix')}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                          {formatUzbekCurrency(c.totalSpent, language)}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(c);
                            }}
                            className="font-bold text-brand-600 hover:text-brand-700 dark:hover:text-brand-400"
                          >
                            {t('admin.customer_profile_btn')}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Customer Detail Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={t('admin.customer_modal_title')}
      >
        {selectedCustomer && (
          <div className="space-y-5 text-xs">
            {/* Top Info Header */}
            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-extrabold text-base flex items-center justify-center shrink-0 border border-brand-200 dark:border-brand-900">
                {(selectedCustomer.fullName || 'M')
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-extrabold text-neutral-900 dark:text-white leading-tight">
                  {selectedCustomer.fullName}
                </h4>
                <p className="text-neutral-400 text-xs mt-0.5">
                  {selectedCustomer.email} • {selectedCustomer.phone}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-neutral-400" />
                  {selectedCustomer.streetAddress || selectedCustomer.city}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-brand-50/60 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-900/50">
                <span className="text-neutral-500 text-[11px] block">
                  {t('admin.customer_total_orders')}
                </span>
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {selectedCustomer.ordersCount} ta
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/50">
                <span className="text-neutral-500 text-[11px] block">
                  {t('admin.customer_total_spent')}
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {formatUzbekCurrency(selectedCustomer.totalSpent, language)}
                </span>
              </div>
            </div>

            {/* Order History */}
            <div>
              <h5 className="font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                {t('admin.order_history_title')}
              </h5>
              {selectedCustomer.orders.length === 0 ? (
                <p className="text-neutral-400 py-3 text-center">
                  {t('admin.no_orders_yet')}
                </p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {selectedCustomer.orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white font-mono">
                          #{ord.orderNumber || ord.id}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {formatDate(ord.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-neutral-900 dark:text-white">
                          {formatUzbekCurrency(ord.total, language)}
                        </p>
                        <span className="text-[10px] uppercase font-bold text-neutral-500">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedCustomer(null)}>
                {t('common.close')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
