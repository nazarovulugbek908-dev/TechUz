import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  Zap,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  Send
} from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors pt-12 pb-24 lg:pb-12">
      {/* 1. Value Proposition Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-750">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-[#FF7A00] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t('footer.delivery_title')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('footer.delivery_desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-750">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-[#FF7A00] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t('footer.warranty_title')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('footer.warranty_desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-750">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-[#FF7A00] flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t('footer.returns_title')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('footer.returns_desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-750">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-[#FF7A00] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t('footer.support_title')}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t('footer.support_desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FF7A00] flex items-center justify-center text-white shadow-md">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <span className="text-2xl font-black font-heading tracking-tight text-white">
                Tech<span className="text-[#FF7A00]">Uz</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm">
              {t('footer.about_bio')}
            </p>

            {/* Newsletter Mini Form */}
            <div className="pt-2">
              <span className="text-xs font-bold text-white block mb-2">{t('footer.newsletter_title')}</span>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder={t('footer.newsletter_placeholder')}
                  className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-l-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#FF7A00]"
                />
                <button
                  type="button"
                  className="px-4 py-2.5 bg-[#FF7A00] hover:bg-[#E66E00] text-white font-bold text-xs rounded-r-xl transition-colors cursor-pointer"
                  aria-label="Submit newsletter"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider mb-4">
              {t('footer.categories_title')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop?category=smartphones" className="hover:text-white transition-colors">
                  {t('nav.smartphones')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cases" className="hover:text-white transition-colors">
                  {t('nav.cases')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=chargers" className="hover:text-white transition-colors">
                  {t('nav.chargers')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=headphones" className="hover:text-white transition-colors">
                  {t('nav.headphones')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=screen_protectors" className="hover:text-white transition-colors">
                  {t('nav.screen_protectors')}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cables" className="hover:text-white transition-colors">
                  {t('nav.cables')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider mb-4">
              {t('footer.customer_service')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  {t('footer.track_order')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  {t('footer.delivery_terms')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  {t('footer.payment_methods')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  {t('footer.warranty_service')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  {t('footer.returns_exchange')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Tashkent Location */}
          <div>
            <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider mb-4">
              {t('footer.contacts')}
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF7A00] shrink-0" />
                <a href="tel:+998945876472" className="hover:text-white font-bold">
                  +998 (94) 587-64-72
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF7A00] shrink-0" />
                <a href="mailto:info@techuz.uz" className="hover:text-white">
                  info@techuz.uz
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Payment Bar & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p className="text-slate-500">
          © {new Date().getFullYear()} TechUz. {t('footer.all_rights_reserved')}
        </p>

        {/* Uzbek payment systems badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-slate-500 font-semibold mr-1">{t('footer.payment_types')}</span>
          <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-[10px] font-bold text-white">
            UZCARD
          </span>
          <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-[10px] font-bold text-orange-400">
            HUMO
          </span>
          <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-[10px] font-bold text-cyan-400">
            PAYME
          </span>
          <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-[10px] font-bold text-blue-400">
            CLICK
          </span>
          <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-[10px] font-bold text-emerald-400">
            UZUM
          </span>
        </div>
      </div>
    </footer>
  );
}
