import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useAdminAuth } from '../../context/AdminAuthContext';
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
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Smartphone,
  Shield,
  Layers,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import clsx from 'clsx';

export function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const { admin } = useAdminAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrdersCount: 0,
    lowStockCount: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // Live timer for local date and time
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
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
        totalCustomers: Number(customersCount) || 0,
        totalRevenue: revenue,
        pendingOrdersCount: pending.length,
        lowStockCount: lowStock.length
      });

      setAllOrders(ordList);
      setRecentOrders(ordList.slice(0, 6));
      setLowStockProducts(lowStock.slice(0, 4));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickRestock = async (prodId, amount = 20) => {
    try {
      const prod = lowStockProducts.find((p) => p.id === prodId);
      const currentStock = Number(prod?.stock) || 0;
      await productService.updateProduct(prodId, { stock: currentStock + amount });
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to restock product:', err);
    }
  };

  // Status Badge Helper
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

  // Formatted date string for live header
  const formattedLiveDate = useMemo(() => {
    return currentDateTime.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'uz-UZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [currentDateTime, language]);

  const formattedLiveTime = currentDateTime.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="space-y-6">
      {/* ================= 1. DASHBOARD HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-[#E6E8EE] dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E6F7EF] dark:bg-slate-800 text-[#00A859] text-[10px] font-bold uppercase tracking-wider border border-[#00A859]/20 flex items-center gap-1">
              TechUz Business Cloud
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17191F] dark:text-white leading-tight">
            Assalomu alaykum, {admin?.name || 'Admin'}!
          </h1>
          <p className="text-xs text-[#737985] mt-1 font-medium">
            TechUz admin paneliga xush kelibsiz. Bugungi do'kon statistikasi bilan tanishing.
          </p>
        </div>

        {/* Dynamic Date & Time Display */}
        <div className="flex items-center gap-3 bg-[#F7F8FA] dark:bg-slate-800/60 border border-[#E6E8EE] dark:border-slate-700/60 px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0">
          <Calendar className="w-4 h-4 text-[#00A859]" />
          <div className="text-left">
            <p className="text-[#17191F] dark:text-white capitalize leading-tight">
              {formattedLiveDate}
            </p>
            <p className="text-[11px] text-[#00A859] font-mono mt-0.5 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formattedLiveTime}
            </p>
          </div>
        </div>
      </div>

      {/* ================= 2. FOUR STATISTICS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Jami buyurtmalar */}
        <Card className="p-5 border border-[#E6E8EE] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#737985]">
              {t('admin.stats_total_orders')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#E6F7EF] dark:bg-slate-800 text-[#00A859] flex items-center justify-center font-bold">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17191F] dark:text-white mt-2">
            {stats.totalOrders}
          </h3>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E6E8EE] dark:border-slate-800">
            <span className="text-[11px] font-bold text-[#16845B] flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +12.5%
            </span>
            <span className="text-[10px] text-[#737985]">
              {t('admin.filter_7_days')}
            </span>
          </div>
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full bg-[#00A859] rounded-full w-3/4" />
          </div>
        </Card>

        {/* 2. Jami mahsulotlar */}
        <Card className="p-5 border border-[#E6E8EE] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#737985]">
              {t('admin.stats_total_products')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17191F] dark:text-white mt-2">
            {stats.totalProducts}
          </h3>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E6E8EE] dark:border-slate-800">
            <span className="text-[11px] font-bold text-[#00A859] flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" />
              {stats.totalProducts - stats.lowStockCount} {t('admin.active_label')}
            </span>
            <span className="text-[10px] text-[#737985]">
              {stats.lowStockCount > 0 ? `${stats.lowStockCount} ta` : t('admin.filter_in_stock')}
            </span>
          </div>
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-4/5" />
          </div>
        </Card>

        {/* 3. Mijozlar */}
        <Card className="p-5 border border-[#E6E8EE] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#737985]">
              {t('admin.stats_total_customers')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-800 text-[#16845B] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17191F] dark:text-white mt-2">
            {stats.totalCustomers}
          </h3>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E6E8EE] dark:border-slate-800">
            <span className="text-[11px] font-bold text-[#16845B] flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +8.4%
            </span>
            <span className="text-[10px] text-[#737985]">
              {t('admin.active_label')}
            </span>
          </div>
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full bg-[#16845B] rounded-full w-2/3" />
          </div>
        </Card>

        {/* 4. Umumiy daromad */}
        <Card className="p-5 border border-[#E6E8EE] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#737985]">
              {t('admin.stats_revenue')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#E6F7EF] dark:bg-slate-800 text-[#00A859] flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#00A859] mt-2 whitespace-nowrap">
            {formatUzbekCurrency(stats.totalRevenue, language)}
          </h3>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E6E8EE] dark:border-slate-800">
            <span className="text-[11px] font-bold text-[#16845B] flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +18.2%
            </span>
            <span className="text-[10px] text-[#737985]">
              {t('admin.active_label')}
            </span>
          </div>
          <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
            <div className="h-full bg-[#00A859] rounded-full w-5/6" />
          </div>
        </Card>
      </div>

      {/* ================= RECENT ORDERS TABLE ================= */}
      <Card className="p-0 border border-[#E6E8EE] dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#E6E8EE] dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#17191F] dark:text-white">
              {t('admin.recent_orders_title')}
            </h2>
            <p className="text-xs text-[#737985] mt-0.5">
              {t('admin.recent_orders_subtitle')}
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00A859] hover:underline transition-colors"
          >
            <span>{t('common.view_all')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FA] dark:bg-slate-800/50 text-[#737985] border-b border-[#E6E8EE] dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">{t('order.order_id')}</th>
                <th className="py-3 px-4 font-semibold">{t('admin.customer_col')}</th>
                <th className="py-3 px-4 font-semibold">{t('admin.products_title')}</th>
                <th className="py-3 px-4 font-semibold">{t('admin.price_col')}</th>
                <th className="py-3 px-4 font-semibold">{t('admin.status_col')}</th>
                <th className="py-3 px-4 font-semibold">{t('admin.date_col')}</th>
                <th className="py-3 px-4 font-semibold text-right">{t('admin.actions_col')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E8EE] dark:divide-slate-800 font-medium">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#737985]">
                    {t('admin.no_orders_found')}
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => {
                  const firstItem = ord.items?.[0];
                  const otherCount = (ord.items?.length || 1) - 1;

                  return (
                    <tr
                      key={ord.id}
                      onClick={() => navigate('/admin/orders')}
                      className="hover:bg-[#F7F8FA] dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      {/* Buyurtma raqami */}
                      <td className="py-3 px-4 font-bold text-[#17191F] dark:text-white font-mono">
                        #{ord.orderNumber || ord.id}
                      </td>

                      {/* Mijoz */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#17191F] dark:text-white">
                          {ord.customer?.fullName || 'Mijoz'}
                        </p>
                        <p className="text-[11px] text-[#737985]">
                          {ord.customer?.phone || ord.customer?.cityDistrict}
                        </p>
                      </td>

                      {/* Mahsulotlar (Real Thumbnails) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 min-w-0">
                          {firstItem?.image && (
                            <img
                              src={firstItem.image}
                              alt=""
                              className="w-8 h-8 rounded-md object-contain bg-white dark:bg-slate-900 border border-[#E6E8EE] dark:border-slate-800 shrink-0"
                            />
                          )}
                          <div className="truncate max-w-[180px]">
                            <span className="text-[#17191F] dark:text-slate-200 font-semibold block truncate">
                              {firstItem?.name_uz || firstItem?.name_ru || 'Mahsulot'}
                            </span>
                            {otherCount > 0 && (
                              <span className="text-[10px] text-[#737985]">
                                + yana {otherCount} ta tovar
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Summa */}
                      <td className="py-3 px-4 font-bold text-[#00A859] whitespace-nowrap">
                        {formatUzbekCurrency(ord.total, language)}
                      </td>

                      {/* Holati */}
                      <td className="py-3 px-4">
                        {getStatusBadge(ord.status)}
                      </td>

                      {/* Sana */}
                      <td className="py-3 px-4 text-[#737985] whitespace-nowrap">
                        {formatDate(ord.createdAt)}
                      </td>

                      {/* Amallar */}
                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/admin/orders"
                          onClick={(e) => e.stopPropagation()}
                          className="font-semibold text-xs text-[#00A859] hover:underline"
                        >
                          {t('common.view_all')}
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
