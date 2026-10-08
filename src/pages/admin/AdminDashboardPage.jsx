import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { authService } from '../../services/authService';
import { formatUzbekCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/formatters';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  FolderTree
} from 'lucide-react';

export function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrdersCount: 0,
    lowStockCount: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [{ data: products }, { data: orders }, customersCount] = await Promise.all([
          productService.getProducts(),
          orderService.getOrders(),
          authService.getUsersCount()
        ]);

        const prodList = products || [];
        const ordList = orders || [];

        const lowStock = prodList.filter((p) => Number(p.stock) < 5);
        const pending = ordList.filter((o) => o.status === 'pending');
        const revenue = ordList
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

        setStats({
          totalProducts: prodList.length,
          totalOrders: ordList.length,
          totalCustomers: customersCount || 1,
          totalRevenue: revenue,
          pendingOrdersCount: pending.length,
          lowStockCount: lowStock.length
        });

        setRecentOrders(ordList.slice(0, 5));
        setLowStockProducts(lowStock.slice(0, 4));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

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

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white">
            {t('admin.dashboard_title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('admin.dashboard_subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/admin/products/new">
            <Button variant="primary" size="sm" icon={PlusCircle}>
              {t('admin.add_product_btn')}
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="outline" size="sm" icon={ShoppingCart}>
              {t('admin.view_orders_btn')}
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <Card className="p-5 border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('admin.stats_total_products')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-[#FF7A00] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-heading text-slate-900 dark:text-white">
              {stats.totalProducts}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {t('admin.active_label')}
            </span>
          </div>
        </Card>

        {/* Total Orders */}
        <Card className="p-5 border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('admin.stats_total_orders')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-heading text-slate-900 dark:text-white">
              {stats.totalOrders}
            </span>
            {stats.pendingOrdersCount > 0 ? (
              <span className="text-[11px] text-amber-600 font-bold flex items-center gap-0.5">
                <Clock className="w-3.5 h-3.5" />
                {stats.pendingOrdersCount} {t('order.status_pending')}
              </span>
            ) : (
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('admin.all_processed')}
              </span>
            )}
          </div>
        </Card>

        {/* Total Customers */}
        <Card className="p-5 border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('admin.stats_total_customers')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-heading text-slate-900 dark:text-white">
              {stats.totalCustomers}
            </span>
            <span className="text-[11px] text-slate-400">
              {t('admin.registered_demo')}
            </span>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card className="p-5 border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {t('admin.stats_revenue')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black font-heading text-emerald-600 dark:text-emerald-400">
              {formatUzbekCurrency(stats.totalRevenue, language)}
            </span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Recent Orders (Left) & Low Stock + Quick Links (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Orders Table */}
        <Card className="lg:col-span-2 p-6 border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                {t('admin.recent_orders_title')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('admin.recent_orders_subtitle')}
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1"
            >
              {t('common.view_all')}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="pb-3 font-bold">{t('order.order_id')}</th>
                  <th className="pb-3 font-bold">{t('admin.customer_col')}</th>
                  <th className="pb-3 font-bold">{t('admin.date_col')}</th>
                  <th className="pb-3 font-bold">{t('cart.total')}</th>
                  <th className="pb-3 font-bold">{t('admin.status_col')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      {t('admin.no_orders_found')}
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord.id || ord.orderNumber} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                        #{ord.orderNumber}
                      </td>
                      <td className="py-3">
                        <p className="font-bold text-slate-900 dark:text-white">{ord.customer?.fullName}</p>
                        <p className="text-[10px] text-slate-400">{ord.customer?.phone}</p>
                      </td>
                      <td className="py-3 text-slate-500">
                        {formatDate(ord.createdAt, language)}
                      </td>
                      <td className="py-3 font-bold text-[#FF7A00]">
                        {formatUzbekCurrency(ord.total, language)}
                      </td>
                      <td className="py-3">
                        {getStatusBadge(ord.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right: Low Stock Alerts & Quick Navigation */}
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                  {t('admin.low_stock_title')}
                </h2>
              </div>
              <Badge variant="warning">{stats.lowStockCount}</Badge>
            </div>

            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold text-center">
                  {t('admin.all_stock_healthy')}
                </div>
              ) : (
                lowStockProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={prod.images?.[0] || 'https://placehold.co/80x80?text=Prod'}
                        alt=""
                        className="w-9 h-9 rounded-lg object-contain bg-white shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {language === 'ru' ? prod.name_ru : prod.name_uz}
                        </p>
                        <p className="text-[10px] text-red-500 font-bold">
                          {t('admin.stock_remaining')}: {prod.stock}
                        </p>
                      </div>
                    </div>

                    <Link to={`/admin/products/${prod.id}`}>
                      <Button variant="ghost" size="xs">
                        {t('admin.edit_btn')}
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick Shortcuts */}
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-3">
            <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white">
              {t('admin.quick_actions_title')}
            </h2>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Link to="/admin/products/new" className="block">
                <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/50 hover:border-[#FF7A00] transition-colors text-center">
                  <PlusCircle className="w-5 h-5 text-[#FF7A00] mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                    {t('admin.add_product_btn')}
                  </span>
                </div>
              </Link>
              <Link to="/admin/categories" className="block">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 hover:border-blue-500 transition-colors text-center">
                  <FolderTree className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                    {t('admin.nav_categories')}
                  </span>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
