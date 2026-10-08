import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { usePhoneModel } from '../../context/PhoneModelContext';
import { PhoneModelSelector } from '../common/PhoneModelSelector';
import {
  X,
  User,
  Smartphone,
  Shield,
  Zap,
  Headphones,
  SmartphoneNfc,
  Percent,
  ChevronRight,
  Phone,
  Truck,
  ShieldCheck,
  Globe,
  Sun,
  Moon,
  Layers,
  LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';

export function MobileDrawer({ isOpen, onClose }) {
  const { toggleLanguage, isUz, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { hasSelectedModel } = usePhoneModel();

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'account'

  if (!isOpen) return null;

  const categories = [
    { to: '/shop?category=smartphones', label: t('nav.smartphones'), icon: Smartphone, count: '24+' },
    { to: '/shop?category=cases', label: t('nav.cases'), icon: Shield, count: '48+' },
    { to: '/shop?category=chargers', label: t('nav.chargers'), icon: Zap, count: '32+' },
    { to: '/shop?category=headphones', label: t('nav.headphones'), icon: Headphones, count: '18+' },
    { to: '/shop?category=screen_protectors', label: t('nav.screen_protectors'), icon: SmartphoneNfc, count: '28+' },
    { to: '/shop?onSale=true', label: t('nav.sales_deals'), icon: Percent, highlight: true }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 max-w-[320px] w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-10">
        {/* 1. Header with User Status */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF7A00] flex items-center justify-center text-white font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">
                {isAuthenticated ? t('nav.welcome') : t('nav.welcome_guest')}
              </p>
              {isAuthenticated ? (
                <p className="text-sm font-bold text-white leading-tight">{user.fullName}</p>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF7A00]">
                  <Link to="/login" onClick={onClose} className="hover:underline">
                    {t('nav.login')}
                  </Link>
                  <span className="text-slate-500">/</span>
                  <Link to="/register" onClick={onClose} className="hover:underline">
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Menu / Account Pill Tabs */}
        <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={cn(
              'flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center',
              activeTab === 'menu'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            {t('nav.menu')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={cn(
              'flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center',
              activeTab === 'account'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            {t('nav.account')}
          </button>
        </div>

        {/* 3. Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* My Phone Model compatibility selector in drawer */}
          <div className="p-3.5 bg-orange-50/70 dark:bg-orange-950/30 rounded-2xl border border-orange-200/80 dark:border-orange-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#FF7A00] uppercase tracking-wider">
                {t('phone_model.my_model')}
              </span>
              {hasSelectedModel && (
                <span className="text-[10px] bg-[#FF7A00] text-white px-1.5 py-0.2 rounded-md font-bold">
                  {t('home.saved_badge')}
                </span>
              )}
            </div>
            <PhoneModelSelector variant="badge" className="w-full justify-between" />
          </div>

          {activeTab === 'menu' ? (
            <>
              {/* Categories Navigation */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                  {t('footer.categories_title')}
                </span>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.to}
                      to={cat.to}
                      onClick={onClose}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors',
                        cat.highlight
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 font-bold border border-rose-200/60'
                          : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn('w-4 h-4', cat.highlight ? 'text-rose-500' : 'text-slate-400')} />
                        <span>{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {cat.count && <span className="text-xs text-slate-400">{cat.count}</span>}
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Service info & Hotline */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                  {t('nav.services_help')}
                </span>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-[#FF7A00]" />
                    <span>
                      {t('announcement.hotline_label')}{' '}
                      <a href="tel:+998945876472" className="font-bold hover:text-[#FF7A00]">
                        +998 (94) 587-64-72
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Truck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t('announcement.fast_delivery')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>{t('announcement.warranty_badge')}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Account Tab */
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                {t('nav.user_menu')}
              </span>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                  >
                    <span>{t('nav.profile_info')}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <Link
                    to="/account/orders"
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                  >
                    <span>{t('nav.my_orders')}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-rose-600 bg-rose-50 dark:bg-rose-950/40 text-sm font-bold cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </div>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="block w-full py-2.5 bg-[#FF7A00] text-white text-center text-sm font-bold rounded-xl shadow-xs"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="block w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-center text-sm font-bold rounded-xl"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Drawer Footer: Language & Theme Switches */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#FF7A00]" />
            <span>{t('nav.lang_label')}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>{t('theme.light')}</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span>{t('theme.dark')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
