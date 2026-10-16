import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { formatUzbekCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatters';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  CreditCard,
  Printer,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Package,
  Layers
} from 'lucide-react';
import clsx from 'clsx';

export function AdminReportsPage() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [period, setPeriod] = useState('30'); // '7' | '30' | '90' | 'all'

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [{ data: orderList }, { data: prodList }] = await Promise.all([
          orderService.getOrders(),
          productService.getProducts()
        ]);
        setOrders(orderList || []);
        setProducts(prodList || []);
      } catch (err) {
        console.error('Failed to load reports data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter orders by period
  const filteredOrders = useMemo(() => {
    if (period === 'all') return orders;
    const days = Number(period);
    const cutoff = Date.now() - days * 24 * 3600 * 1000;
    return orders.filter((o) => new Date(o.createdAt).getTime() >= cutoff);
  }, [orders, period]);

  // Aggregate stats
  const successfulOrders = filteredOrders.filter((o) => o.status !== 'cancelled');
  const cancelledOrders = filteredOrders.filter((o) => o.status === 'cancelled');

  const totalRevenue = successfulOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const avgOrderValue = successfulOrders.length > 0 ? Math.round(totalRevenue / successfulOrders.length) : 0;

  // Payment methods breakdown
  const paymentStats = useMemo(() => {
    const map = { cash: 0, payme: 0, click: 0 };
    filteredOrders.forEach((o) => {
      const pm = (o.paymentMethod || 'cash').toLowerCase();
      if (map[pm] !== undefined) map[pm] += Number(o.total) || 0;
      else map.cash += Number(o.total) || 0;
    });
    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    return {
      cash: { amount: map.cash, percent: Math.round((map.cash / total) * 100) },
      payme: { amount: map.payme, percent: Math.round((map.payme / total) * 100) },
      click: { amount: map.click, percent: Math.round((map.click / total) * 100) }
    };
  }, [filteredOrders]);

  // Top selling products by items
  const topProducts = useMemo(() => {
    const itemMap = new Map();
    filteredOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const key = item.id || item.slug || item.name_uz;
        const current = itemMap.get(key) || {
          name: language === 'ru' ? item.name_ru || item.name_uz : item.name_uz,
          qty: 0,
          revenue: 0,
          image: item.image || item.images?.[0]
        };
        current.qty += Number(item.quantity) || 1;
        current.revenue += (Number(item.price) || 0) * (Number(item.quantity) || 1);
        itemMap.set(key, current);
      });
    });

    return Array.from(itemMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [filteredOrders, language]);

  // Generate SVG sales trend points
  const trendData = useMemo(() => {
    const days = period === '7' ? 7 : period === '30' ? 30 : 14;
    const points = [];
    const now = Date.now();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now - i * 24 * 3600 * 1000);
      const dateStr = d.toISOString().slice(0, 10);
      const dayTotal = filteredOrders
        .filter((o) => o.createdAt && o.createdAt.startsWith(dateStr) && o.status !== 'cancelled')
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

      points.push({
        label: `${d.getDate()}-${d.getMonth() + 1}`,
        value: dayTotal
      });
    }
    return points;
  }, [filteredOrders, period]);

  const maxTrendVal = Math.max(...trendData.map((p) => p.value), 1000000);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-neutral-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            {t('admin.reports_title')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {t('admin.reports_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Period selector */}
          <div className="flex items-center bg-white dark:bg-neutral-900 p-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-xs font-bold shadow-xs">
            {[
              { id: '7', label: t('admin.filter_7_days') },
              { id: '30', label: t('admin.filter_30_days') },
              { id: '90', label: t('admin.filter_90_days') },
              { id: 'all', label: t('common.view_all') }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg transition-all',
                  period === p.id
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="md"
            icon={Printer}
            onClick={handlePrint}
            className="font-bold border-neutral-200 dark:border-neutral-800"
          >
            {t('admin.print_btn')}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#15171D]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400">
                  {t('admin.total_revenue')}
                </span>
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-brand-600 dark:text-brand-400 font-heading mt-2">
                {formatUzbekCurrency(totalRevenue, language)}
              </h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                +15.4%
              </p>
            </Card>

            <Card className="p-5 border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#15171D]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400">
                  {t('admin.avg_order_value')}
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading mt-2">
                {formatUzbekCurrency(avgOrderValue, language)}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {successfulOrders.length} {t('common.items_short')}
              </p>
            </Card>

            <Card className="p-5 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B1730]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  {t('admin.successful_orders_label')}
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-[#10A66A] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#10A66A] font-heading mt-2">
                {successfulOrders.length} ta
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {filteredOrders.length > 0
                  ? Math.round((successfulOrders.length / filteredOrders.length) * 100)
                  : 100}
                %
              </p>
            </Card>

            <Card className="p-5 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B1730]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">
                  {t('admin.cancelled_label')}
                </span>
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <XCircle className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-rose-500 font-heading mt-2">
                {cancelledOrders.length} ta
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {filteredOrders.length > 0
                  ? Math.round((cancelledOrders.length / filteredOrders.length) * 100)
                  : 0}
                %
              </p>
            </Card>
          </div>

          {/* Interactive Sales Chart Card */}
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B1730] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white font-heading">
                  {t('admin.sales_dynamics_title')}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('admin.daily_revenue_chart')}
                </p>
              </div>
            </div>

            {/* Custom SVG Area Chart */}
            <div className="pt-4">
              <div className="h-64 w-full flex items-end gap-2 sm:gap-3 px-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                {trendData.map((pt, idx) => {
                  const heightPercent = Math.max(Math.round((pt.value / maxTrendVal) * 100), 8);
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-md shadow-lg pointer-events-none whitespace-nowrap z-10">
                        {pt.label}: {formatUzbekCurrency(pt.value, language)}
                      </div>

                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-brand-600/60 to-brand-500 group-hover:from-brand-600 group-hover:to-brand-400 transition-all shadow-xs"
                      />
                      <span className="text-[10px] text-neutral-400 mt-2 truncate w-full text-center">
                        {pt.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Bottom Grid: Payment Methods & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Methods */}
            <Card className="p-6 border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#15171D] space-y-5">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white font-heading flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                {t('admin.payment_methods_title')}
              </h3>

              <div className="space-y-4 text-xs font-bold">
                <div>
                  <div className="flex justify-between text-neutral-700 dark:text-neutral-300 mb-1.5">
                    <span>Naqd pul / Kuryer orqali</span>
                    <span className="text-brand-600 dark:text-brand-400">
                      {formatUzbekCurrency(paymentStats.cash.amount, language)} ({paymentStats.cash.percent}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      style={{ width: `${paymentStats.cash.percent}%` }}
                      className="h-full bg-brand-600 rounded-full transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-700 dark:text-neutral-300 mb-1.5">
                    <span>Payme</span>
                    <span className="text-blue-500">
                      {formatUzbekCurrency(paymentStats.payme.amount, language)} ({paymentStats.payme.percent}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      style={{ width: `${paymentStats.payme.percent}%` }}
                      className="h-full bg-blue-500 rounded-full transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-700 dark:text-neutral-300 mb-1.5">
                    <span>Click</span>
                    <span className="text-emerald-500">
                      {formatUzbekCurrency(paymentStats.click.amount, language)} ({paymentStats.click.percent}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      style={{ width: `${paymentStats.click.percent}%` }}
                      className="h-full bg-emerald-500 rounded-full transition-all"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Top Selling Products */}
            <Card className="p-6 border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#15171D] space-y-4">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white font-heading flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                {t('admin.top_selling_title')}
              </h3>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {topProducts.length === 0 ? (
                  <p className="text-neutral-400 py-6 text-center text-xs">
                    {t('admin.no_report_data')}
                  </p>
                ) : (
                  topProducts.map((p, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </div>
                        <p className="font-bold text-neutral-900 dark:text-white truncate">
                          {p.name}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-neutral-900 dark:text-white block">
                          {p.qty} {t('common.piece_short')}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {formatUzbekCurrency(p.revenue, language)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
