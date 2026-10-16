import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
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
  LogOut,
  Download
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { cn } from '../../utils/cn';

export function MobileDrawer({ isOpen, onClose }) {
  const { toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { hasSelectedModel } = usePhoneModel();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'account'

  if (!isOpen) return null;

  const { isInstallable, installPWA } = usePWAInstall();

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
        className="fixed inset-0 bg-[#17191F]/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 max-w-[300px] w-full bg-white dark:bg-[#15171D] shadow-xl border-r border-[#E6E8EE] dark:border-[#2A2E3B] flex flex-col z-10">
        {/* 1. Header with User Status */}
        <div className="p-4 bg-[#17191F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#5B5BD6] flex items-center justify-center text-white font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-[#737985]">
                {isAuthenticated ? t('nav.welcome') : t('nav.welcome_guest')}
              </p>
              {isAuthenticated ? (
                <p className="text-sm font-semibold text-white leading-tight">{user.fullName}</p>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Link to="/login" onClick={onClose} className="hover:text-[#5B5BD6]">
                    {t('nav.login')}
                  </Link>
                  <span className="text-[#737985]">/</span>
                  <Link to="/register" onClick={onClose} className="hover:text-[#5B5BD6]">
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#737985] hover:text-white hover:bg-[#252830] transition-colors cursor-pointer"
            aria-label={t('common.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Menu / Account Tabs */}
        <div className="px-3 py-2 bg-[#F7F8FA] dark:bg-[#1D2028] flex items-center gap-1.5 border-b border-[#E6E8EE] dark:border-[#2A2E3B]">
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={cn(
              'flex-1 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-center',
              activeTab === 'menu'
                ? 'bg-white dark:bg-[#15171D] text-[#17191F] dark:text-white shadow-xs'
                : 'text-[#737985] hover:text-[#17191F] dark:hover:text-white'
            )}
          >
            {t('nav.menu')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={cn(
              'flex-1 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-center',
              activeTab === 'account'
                ? 'bg-white dark:bg-[#15171D] text-[#17191F] dark:text-white shadow-xs'
                : 'text-[#737985] hover:text-[#17191F] dark:hover:text-white'
            )}
          >
            {t('nav.account')}
          </button>
        </div>

        {/* 3. Drawer Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {/* Phone Model compatibility */}
          <div className="p-3 bg-[#F7F8FA] dark:bg-[#1D2028] rounded-lg border border-[#E6E8EE] dark:border-[#2A2E3B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-[#5B5BD6] uppercase tracking-wider">
                {t('phone_model.my_model')}
              </span>
              {hasSelectedModel && (
                <span className="text-[10px] bg-[#5B5BD6] text-white px-1.5 py-0.2 rounded font-semibold">
                  {t('home.saved_badge')}
                </span>
              )}
            </div>
            <PhoneModelSelector variant="badge" className="w-full justify-between" />
          </div>

          {activeTab === 'menu' ? (
            <>
              {/* Categories */}
              <div className="space-y-0.5">
                <span className="text-[10px] font-semibold text-[#737985] uppercase tracking-wider px-2 block mb-1">
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
                        'flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors',
                        cat.highlight
                          ? 'bg-[#FDF2F2] dark:bg-[#D64545]/10 text-[#D64545] font-semibold'
                          : 'text-[#17191F] dark:text-[#F4F7FC] hover:bg-[#F7F8FA] dark:hover:bg-[#1D2028]'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn('w-4 h-4', cat.highlight ? 'text-[#D64545]' : 'text-[#737985]')} />
                        <span>{cat.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#737985]" />
                    </Link>
                  );
                })}
              </div>

              {/* Service info & Hotline */}
              <div className="pt-3 border-t border-[#E6E8EE] dark:border-[#2A2E3B] space-y-2">
                <div className="p-2.5 bg-[#F7F8FA] dark:bg-[#1D2028] rounded-lg space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-[#17191F] dark:text-[#F4F7FC]">
                    <Phone className="w-3.5 h-3.5 text-[#5B5BD6]" />
                    <span>
                      <a href="tel:+998945876472" className="font-semibold hover:text-[#5B5BD6]">
                        +998 (94) 587-64-72
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#737985] dark:text-[#9CA3AF]">
                    <Truck className="w-3.5 h-3.5 text-[#16845B]" />
                    <span>{t('announcement.fast_delivery')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#737985] dark:text-[#9CA3AF]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5B5BD6]" />
                    <span>{t('announcement.warranty_badge')}</span>
                  </div>
                </div>

                {isInstallable && (
                  <button
                    type="button"
                    onClick={() => {
                      installPWA();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#5B5BD6] text-white font-semibold text-xs active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-white" />
                      <span>{t('nav.pwa_install_app')}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Account Tab */
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-[#737985] uppercase tracking-wider px-2 block mb-1">
                {t('nav.user_menu')}
              </span>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F8FA] dark:bg-[#1D2028] text-xs font-semibold"
                  >
                    <span>{t('nav.profile_info')}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#737985]" />
                  </Link>
                  <Link
                    to="/account/orders"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F8FA] dark:bg-[#1D2028] text-xs font-semibold"
                  >
                    <span>{t('nav.my_orders')}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#737985]" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                      navigate('/login');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-[#D64545] bg-[#FDF2F2] dark:bg-[#D64545]/15 text-xs font-semibold cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('nav.logout')}</span>
                    </div>
                  </button>
                </>
              ) : (
                <div className="space-y-1.5">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="block w-full py-2 bg-[#5B5BD6] text-white text-center text-xs font-semibold rounded-lg shadow-xs"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="block w-full py-2 bg-[#F7F8FA] dark:bg-[#1D2028] text-[#17191F] dark:text-white text-center text-xs font-semibold rounded-lg border border-[#E6E8EE] dark:border-[#2A2E3B]"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Drawer Footer */}
        <div className="p-3 bg-[#F7F8FA] dark:bg-[#1D2028] border-t border-[#E6E8EE] dark:border-[#2A2E3B] flex items-center justify-between">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#15171D] border border-[#E6E8EE] dark:border-[#2A2E3B] text-xs font-semibold text-[#17191F] dark:text-[#F4F7FC] cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#5B5BD6]" />
            <span>{t('nav.lang_label')}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-[#15171D] border border-[#E6E8EE] dark:border-[#2A2E3B] text-xs font-semibold text-[#17191F] dark:text-[#F4F7FC] cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('theme.light')}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#737985]" />
                <span>{t('theme.dark')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
