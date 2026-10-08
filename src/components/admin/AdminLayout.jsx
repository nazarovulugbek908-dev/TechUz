import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { AdminProfileModal } from './AdminProfileModal';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Building2,
  Smartphone,
  ShoppingCart,
  User,
  LogOut,
  Store,
  Menu,
  X,
  Shield,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import clsx from 'clsx';

export function AdminLayout() {
  const { t, language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { admin, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: t('admin.nav_dashboard'), icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: t('admin.nav_products'), icon: Package },
    { to: '/admin/categories', label: t('admin.nav_categories'), icon: FolderTree },
    { to: '/admin/brands', label: t('admin.nav_brands'), icon: Building2 },
    { to: '/admin/phone-models', label: t('admin.nav_phone_models'), icon: Smartphone },
    { to: '/admin/orders', label: t('admin.nav_orders'), icon: ShoppingCart },
    { to: '/admin/profile', label: t('admin.profile_modal_title'), icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-white shrink-0 border-r border-slate-800">
        {/* Brand & Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black shadow-lg shadow-orange-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-black text-lg text-white leading-tight">
                Tech<span className="text-[#FF7A00]">Uz</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all',
                    isActive
                      ? 'bg-[#FF7A00] text-white shadow-lg shadow-orange-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Store className="w-4 h-4 text-[#FF7A00]" />
            <span>{t('admin.back_to_store')}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('auth.logout_button')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 w-64 bg-slate-900 text-white z-50 lg:hidden flex flex-col transition-transform duration-300 ease-in-out shadow-2xl',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF7A00] text-white flex items-center justify-center font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div className="font-heading font-black text-lg text-white">
              Tech<span className="text-[#FF7A00]">Uz</span>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
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
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all',
                    isActive
                      ? 'bg-[#FF7A00] text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
          >
            <Store className="w-4 h-4 text-[#FF7A00]" />
            <span>{t('admin.back_to_store')}</span>
          </Link>

          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('auth.logout_button')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-400 hidden sm:inline-block">
              {t('admin.welcome_badge')}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 text-xs font-bold">
              <button
                onClick={() => setLanguage('uz')}
                className={clsx(
                  'px-2.5 py-1 rounded-lg transition-colors',
                  language === 'uz'
                    ? 'bg-[#FF7A00] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                )}
              >
                UZ
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={clsx(
                  'px-2.5 py-1 rounded-lg transition-colors',
                  language === 'ru'
                    ? 'bg-[#FF7A00] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                )}
              >
                RU
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin User Pill (Clickable to view/edit profile) */}
            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center gap-2 pl-2.5 py-1 pr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border-l border-slate-200 dark:border-slate-800 transition-colors cursor-pointer text-left group"
              title={t('admin.profile_modal_title')}
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-800 text-[#FF7A00] flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
                A
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {admin?.name || 'Ulugbek Nazarov'}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  {t('admin.online_status')}
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Outlet */}
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
