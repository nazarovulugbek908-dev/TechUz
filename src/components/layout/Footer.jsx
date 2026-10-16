import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock
} from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white dark:bg-[#15171D] text-[#737985] dark:text-[#9CA3AF] border-t border-[#E6E8EE] dark:border-[#2A2E3B] transition-colors pt-10 pb-20 lg:pb-10">
      {/* 1. Value Proposition Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 border-b border-[#E6E8EE] dark:border-[#2A2E3B]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F8FA] dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B]">
            <div className="w-9 h-9 rounded-md bg-[#EEEEFF] dark:bg-[#5B5BD6]/15 text-[#5B5BD6] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#17191F] dark:text-[#F4F7FC]">
                {t('footer.delivery_title')}
              </h4>
              <p className="text-[11px] text-[#737985] dark:text-[#9CA3AF]">
                {t('footer.delivery_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F8FA] dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B]">
            <div className="w-9 h-9 rounded-md bg-[#EEEEFF] dark:bg-[#5B5BD6]/15 text-[#5B5BD6] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#17191F] dark:text-[#F4F7FC]">
                {t('footer.warranty_title')}
              </h4>
              <p className="text-[11px] text-[#737985] dark:text-[#9CA3AF]">
                {t('footer.warranty_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F8FA] dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B]">
            <div className="w-9 h-9 rounded-md bg-[#EEEEFF] dark:bg-[#5B5BD6]/15 text-[#5B5BD6] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#17191F] dark:text-[#F4F7FC]">
                {t('footer.returns_title')}
              </h4>
              <p className="text-[11px] text-[#737985] dark:text-[#9CA3AF]">
                {t('footer.returns_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F8FA] dark:bg-[#1D2028] border border-[#E6E8EE] dark:border-[#2A2E3B]">
            <div className="w-9 h-9 rounded-md bg-[#EEEEFF] dark:bg-[#5B5BD6]/15 text-[#5B5BD6] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#17191F] dark:text-[#F4F7FC]">
                {t('footer.support_title')}
              </h4>
              <p className="text-[11px] text-[#737985] dark:text-[#9CA3AF]">
                {t('footer.support_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#5B5BD6] text-white flex items-center justify-center font-bold text-xs">
                T
              </div>
              <span className="text-lg font-bold tracking-tight text-[#17191F] dark:text-[#F4F7FC]">
                Tech<span className="text-[#5B5BD6]">Uz</span>
              </span>
            </Link>
            <p className="text-xs text-[#737985] dark:text-[#9CA3AF] leading-relaxed">
              {t('footer.about_text')}
            </p>
            <div className="pt-1 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#737985] dark:text-[#9CA3AF]">
                <Phone className="w-3.5 h-3.5 text-[#5B5BD6]" />
                <a href="tel:+998945876472" className="hover:text-[#17191F] dark:hover:text-white font-medium">
                  +998 (94) 587-64-72
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#737985] dark:text-[#9CA3AF]">
                <Mail className="w-3.5 h-3.5 text-[#5B5BD6]" />
                <a href="mailto:support@techuz.uz" className="hover:text-[#17191F] dark:hover:text-white font-medium">
                  support@techuz.uz
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#737985] dark:text-[#9CA3AF]">
                <MapPin className="w-3.5 h-3.5 text-[#5B5BD6]" />
                <span>Toshkent shahri, O'zbekiston</span>
              </div>
            </div>
          </div>

          {/* Col 2: Catalog Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#17191F] dark:text-[#F4F7FC] mb-3">
              {t('catalog.title')}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=smartphones" className="hover:text-[#5B5BD6] transition-colors">
                  {t('nav.smartphones')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cases" className="hover:text-[#5B5BD6] transition-colors">
                  {t('nav.cases')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=chargers" className="hover:text-[#5B5BD6] transition-colors">
                  {t('nav.chargers')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=headphones" className="hover:text-[#5B5BD6] transition-colors">
                  {t('nav.headphones')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=screen_protectors" className="hover:text-[#5B5BD6] transition-colors">
                  {t('nav.screen_protectors')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#17191F] dark:text-[#F4F7FC] mb-3">
              {t('footer.customer_help')}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop" className="hover:text-[#5B5BD6] transition-colors">
                  {t('footer.how_to_order')}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#5B5BD6] transition-colors">
                  {t('nav.cart')}
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-[#5B5BD6] transition-colors">
                  {t('nav.favorites')}
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#5B5BD6] transition-colors">
                  {t('nav.account')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Information */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#17191F] dark:text-[#F4F7FC] mb-3">
              {t('footer.legal')}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-[#5B5BD6] transition-colors cursor-pointer">
                  {t('footer.terms')}
                </span>
              </li>
              <li>
                <span className="hover:text-[#5B5BD6] transition-colors cursor-pointer">
                  {t('footer.privacy')}
                </span>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#5B5BD6] transition-colors text-[#737985]">
                  {t('nav.admin_panel')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#E6E8EE] dark:border-[#2A2E3B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737985] dark:text-[#9CA3AF]">
        <div>
          &copy; {new Date().getFullYear()} TechUz Store. {t('footer.all_rights_reserved')}.
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Uzbekistan E-Commerce</span>
          <span>&bull;</span>
          <span>Toshkent</span>
        </div>
      </div>
    </footer>
  );
}
