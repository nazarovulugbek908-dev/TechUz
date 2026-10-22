import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../context/ThemeContext';
import { orderService } from '../../services/orderService';
import { AdminProfileModal } from './AdminProfileModal';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FolderTree,
  TrendingUp,
  Settings,
  Store,
  LogOut,
  Menu,
  X,
  Shield,
  Sun,
  Moon,
  Search,
  Bell,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  User,
  CheckCircle2,
  CheckCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import clsx from 'clsx';

export function AdminLayout() {
  const { t, language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { admin, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('search') || urlParams.get('q') || '';
  });

  // Sync top search bar with URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const q = urlParams.get('search') || urlParams.get('q') || '';
    setSearchQuery(q);
  }, [location.search, location.pathname]);

  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('techuz_read_notifications') || '[]');
    } catch {
      return [];
    }
  });

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Load pending orders count for badge & notifications
  useEffect(() => {
    async function loadNotifications() {
      try {
        const { data: orders } = await orderService.getOrders();
        const ordList = orders || [];
        let storedRead = [];
        try {
          storedRead = JSON.parse(localStorage.getItem('techuz_read_notifications') || '[]');
        } catch {
          storedRead = [];
        }
        const pending = ordList.filter(
          (o) => o.status === 'pending' && !storedRead.includes(String(o.id || o.orderNumber))
        );
        setPendingOrdersCount(pending.length);
        setRecentNotifications(ordList.slice(0, 5));
      } catch (err) {
        console.error('Failed to load orders for badge:', err);
      }
    }
    loadNotifications();
  }, [location.pathname]);

  const markAllAsRead = (e) => {
    e?.stopPropagation();
    const allIds = recentNotifications.map((ord) => String(ord.id || ord.orderNumber));
    setReadNotifIds(allIds);
    setPendingOrdersCount(0);
    try {
      localStorage.setItem('techuz_read_notifications', JSON.stringify(allIds));
    } catch (err) {
      console.error(err);
    }
  };

  const markOneAsRead = (id, e) => {
    e?.stopPropagation();
    e?.preventDefault();
    const strId = String(id);
    const updated = Array.from(new Set([...readNotifIds, strId]));
    setReadNotifIds(updated);
    try {
      localStorage.setItem('techuz_read_notifications', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setPendingOrdersCount((prev) => Math.max(0, prev - 1));
  };

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      if (location.search.includes('search=') || location.search.includes('q=')) {
        navigate(location.pathname);
      }
      return;
    }

    if (location.pathname.startsWith('/admin/orders')) {
      navigate(`/admin/orders?search=${encodeURIComponent(query)}`);
    } else if (location.pathname.startsWith('/admin/customers')) {
      navigate(`/admin/customers?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/admin/products?search=${encodeURIComponent(query)}`);
    }
  };

  // Sidebar navigation items matching user requirements
  const navItems = [
    {
      to: '/admin',
      label: t('admin.nav_dashboard'),
      icon: LayoutDashboard,
      end: true
    },
    {
      to: '/admin/orders',
      label: t('admin.nav_orders'),
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null
    },
    {
      to: '/admin/products',
      label: t('admin.nav_products'),
      icon: Package
    },
    {
      to: '/admin/customers',
      label: t('admin.nav_customers'),
      icon: Users
    },
    {
      to: '/admin/catalog',
      label: t('admin.nav_categories'),
      icon: FolderTree
    },
    {
      to: '/admin/reports',
      label: t('admin.nav_reports'),
      icon: TrendingUp
    },
    {
      to: '/admin/profile',
      label: t('admin.nav_settings'),
      icon: Settings
    }
  ];

  const adminName = admin?.name || 'Ulugbek Nazarov';
  const adminInitials = adminName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#15171D] text-[#17191F] dark:text-[#F7F8FA] flex font-sans">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#15171D] text-white shrink-0 border-r border-[#242731] sticky top-0 h-screen z-40 select-none">
        {/* Brand & Logo */}
        <div className="p-5 border-b border-[#242731] flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="font-extrabold text-xl text-white tracking-tight">
              Tech<span className="text-[#00A859]">Uz</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737985] bg-white/5 px-2 py-0.5 rounded border border-white/10">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#737985]">
            {t('admin.nav_home')}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isItemActive =
              location.pathname === item.to ||
              (item.to === '/admin/catalog' && location.pathname.startsWith('/admin/catalog'));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-lg font-semibold text-xs transition-colors group',
                    isActive || isItemActive
                      ? 'bg-[#00A859] text-white shadow-xs'
                      : 'text-[#737985] hover:text-white hover:bg-white/5'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#15171D] font-bold text-[10px]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-[#242731] flex items-center justify-between text-xs">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold text-[#737985] hover:text-white hover:bg-white/5 transition-colors"
            title={t('admin.back_to_store')}
          >
            <Store className="w-3.5 h-3.5 text-[#00A859]" />
            <span className="text-[11px]">{t('admin.back_to_store')}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-[#D64545] hover:text-red-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
            title={t('auth.logout_button')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={clsx(
          'fixed inset-y-0 left-0 w-64 bg-[#15171D] text-white z-50 lg:hidden flex flex-col transition-transform duration-300 ease-in-out shadow-2xl',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-5 border-b border-[#242731] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-white">
              Tech<span className="text-[#00A859]">Uz</span>
            </span>
            <span className="text-[10px] font-bold text-[#737985] bg-white/5 px-1.5 py-0.5 rounded">
              Admin
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-[#737985] hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-lg font-semibold text-xs transition-all',
                    isActive || (item.to === '/admin/catalog' && location.pathname.startsWith('/admin/catalog'))
                      ? 'bg-[#00A859] text-white'
                      : 'text-[#737985] hover:text-white hover:bg-white/5'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#15171D] font-bold text-[10px]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#242731]">
          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#D64545] hover:bg-rose-950/30 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('auth.logout_button')}</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white dark:bg-[#15171D] border-b border-[#E6E8EE] dark:border-[#242731] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Left: Mobile hamburger & Global Search */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#17191F] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
              <button
                type="submit"
                aria-label={t('catalog.search_button')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737985] hover:text-[#00A859] transition-colors cursor-pointer p-0 bg-transparent border-none flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder={t('catalog.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#F7F8FA] dark:bg-slate-900 border border-[#E6E8EE] dark:border-slate-800 text-xs font-semibold text-[#17191F] dark:text-white placeholder-[#737985] focus:outline-none focus:border-[#00A859] focus:ring-1 focus:ring-[#00A859] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    if (location.search.includes('search=') || location.search.includes('q=')) {
                      navigate(location.pathname);
                    }
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737985] hover:text-[#17191F] dark:hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Right Controls: Notifications, Lang, Theme, Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg bg-[#F7F8FA] dark:bg-slate-900 border border-[#E6E8EE] dark:border-slate-800 text-[#17191F] dark:text-slate-300 hover:text-[#00A859] transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {pendingOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00A859] text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#15171D] border border-[#E6E8EE] dark:border-slate-800 rounded-xl shadow-lg p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E6E8EE] dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#17191F] dark:text-white">
                        {t('admin.nav_orders')}
                      </span>
                      {pendingOrdersCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#E6F7EF] dark:bg-slate-800 text-[#00A859] font-bold text-[10px]">
                          {pendingOrdersCount}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-[#00A859] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>OK</span>
                    </button>
                  </div>

                  <div className="divide-y divide-[#E6E8EE] dark:divide-slate-800 max-h-60 overflow-y-auto">
                    {recentNotifications.length === 0 ? (
                      <p className="py-6 text-center text-[#737985]">
                        {t('admin.no_orders_found')}
                      </p>
                    ) : (
                      recentNotifications.map((ord) => {
                        const isRead = readNotifIds.includes(String(ord.id || ord.orderNumber));
                        return (
                          <div
                            key={ord.id}
                            className="py-2.5 px-2 flex items-center gap-3 hover:bg-[#F7F8FA] dark:hover:bg-slate-800/50 rounded-lg transition-colors group"
                          >
                            <Link
                              to="/admin/orders"
                              onClick={() => setNotificationsOpen(false)}
                              className="w-8 h-8 rounded-lg bg-[#E6F7EF] dark:bg-slate-800 text-[#00A859] flex items-center justify-center shrink-0"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </Link>

                            <Link
                              to="/admin/orders"
                              onClick={() => setNotificationsOpen(false)}
                              className="min-w-0 flex-1 block"
                            >
                              <p className="font-bold text-[#17191F] dark:text-slate-200 truncate">
                                #{ord.orderNumber || ord.id} • {ord.customer?.fullName || 'Mijoz'}
                              </p>
                              <p className="text-[10px] text-[#737985] capitalize">
                                {ord.status}
                              </p>
                            </Link>

                            <div className="shrink-0">
                              {isRead ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#16845B] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                  <CheckCheck className="w-3 h-3" />
                                  <span>OK</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => markOneAsRead(ord.id || ord.orderNumber, e)}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#00A859] hover:text-white bg-[#E6F7EF] dark:bg-slate-800 hover:bg-[#00A859] dark:hover:bg-[#00A859] px-2.5 py-0.5 rounded-full border border-[#00A859]/20 transition-colors cursor-pointer"
                                  title="Mark as read"
                                >
                                  <CheckCheck className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <Link
                    to="/admin/orders"
                    onClick={() => setNotificationsOpen(false)}
                    className="block text-center pt-2 border-t border-[#E6E8EE] dark:border-slate-800 text-[11px] font-semibold text-[#00A859] hover:underline"
                  >
                    {t('admin.view_orders_btn')}
                  </Link>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#F7F8FA] dark:bg-slate-900 border border-[#E6E8EE] dark:border-slate-800 rounded-lg p-0.5 text-xs font-bold">
              <button
                onClick={() => setLanguage('uz')}
                className={clsx(
                  'px-2 py-1 rounded-md transition-colors cursor-pointer',
                  language === 'uz'
                    ? 'bg-[#00A859] text-white shadow-xs'
                    : 'text-[#737985] hover:text-[#17191F] dark:hover:text-white'
                )}
              >
                UZ
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={clsx(
                  'px-2 py-1 rounded-md transition-colors cursor-pointer',
                  language === 'ru'
                    ? 'bg-[#00A859] text-white shadow-xs'
                    : 'text-[#737985] hover:text-[#17191F] dark:hover:text-white'
                )}
              >
                RU
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[#F7F8FA] dark:bg-slate-900 border border-[#E6E8EE] dark:border-slate-800 text-[#17191F] dark:text-slate-300 hover:text-[#00A859] transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin User Profile & Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-[#E6E8EE] dark:hover:border-slate-800 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#00A859] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {adminInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-[#17191F] dark:text-white leading-tight">
                    {adminName}
                  </p>
                  <p className="text-[10px] text-[#16845B] font-semibold">
                    Super Admin
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#737985] hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#15171D] border border-[#E6E8EE] dark:border-slate-800 rounded-xl shadow-lg p-2 z-50 text-xs font-semibold">
                  <div className="p-2.5 border-b border-[#E6E8EE] dark:border-slate-800">
                    <p className="text-[#17191F] dark:text-white font-bold">{adminName}</p>
                    <p className="text-[10px] text-[#737985] font-normal">admin@techuz.uz</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#17191F] dark:text-slate-300 hover:bg-[#F7F8FA] dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-[#00A859]" />
                      <span>{t('admin.nav_my_profile')}</span>
                    </button>

                    <Link
                      to="/admin/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#17191F] dark:text-slate-300 hover:bg-[#F7F8FA] dark:hover:bg-slate-800 text-left transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#00A859]" />
                      <span>{t('admin.nav_settings')}</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-[#E6E8EE] dark:border-slate-800">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#D64545] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('auth.logout_button')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Admin Profile Modal */}
      <AdminProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}
