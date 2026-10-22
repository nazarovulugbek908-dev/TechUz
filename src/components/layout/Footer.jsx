import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-[#063A26] text-white/80 transition-colors pt-12 pb-16 lg:pb-12 border-t border-[#042A1B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer 4 Columns - matching Screenshot 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold text-lg border border-white/20 shadow-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M4 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1h4V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1h-4v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm4 3H6v9h2V9zm12 0h-2v9h2V9zm-4-1h-4v8h4V8z" />
                </svg>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tight text-white">
                  Tech<span className="text-[#00A859]">Uz</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A859]" />
              </div>
            </Link>

            <div className="space-y-2 text-xs text-white/70 leading-relaxed pt-2">
              <p>123 Mustaqillik shoh ko'chasi, Toshkent, O'zbekiston</p>
              <p>
                <a href="tel:+998945876472" className="hover:text-white transition-colors">
                  +998 (94) 587-64-72
                </a>
              </p>
              <p>
                <a href="mailto:contact@techuz.uz" className="hover:text-white transition-colors">
                  contact@techuz.uz
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-wide">
              {language === 'ru' ? 'Быстрые ссылки' : 'Tezkor havolalar'}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  {language === 'ru' ? 'Главная' : 'Bosh sahifa'}
                </Link>
              </li>
              <li>
                <Link to="/#about" className="hover:text-white transition-colors">
                  {language === 'ru' ? 'О нас' : 'Biz haqimizda'}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  {language === 'ru' ? 'Каталог' : 'Katalog'}
                </Link>
              </li>
              <li>
                <Link to="/#help" className="hover:text-white transition-colors">
                  {language === 'ru' ? 'Помощь' : 'Yordam'}
                </Link>
              </li>
              <li>
                <a href="tel:+998945876472" className="hover:text-white transition-colors">
                  {language === 'ru' ? 'Контакты' : 'Bog‘lanish'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Services / Categories */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-wide">
              {language === 'ru' ? 'Категории' : 'Toifalar'}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link to="/shop?category=smartphones" className="hover:text-white transition-colors">
                  {language === 'ru' ? 'Смартфоны' : 'Smartfonlar'}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cases" className="hover:text-white transition-colors">
                  {language === 'ru' ? 'Чехлы и бамперы' : 'G‘iloflar'}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=chargers" className="hover:text-white transition-colors">
                  {language === 'ru' ? 'Зарядные устройства' : 'Zaryadlash moslamalari'}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=headphones" className="hover:text-white transition-colors">
                  {language === 'ru' ? 'Наушники' : 'Quloqchinlar'}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=screen_protectors" className="hover:text-white transition-colors">
                  {language === 'ru' ? 'Защитные стекла' : 'Himoya oynalari'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Link */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-wide">
              {language === 'ru' ? 'Социальные сети' : 'Ijtimoiy tarmoqlar'}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  YouTube
                </a>
              </li>
              <li>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-white/10 pt-6 pb-2">
          {/* Payment Methods - We Accept */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold tracking-wider text-white uppercase">
                {language === 'ru' ? 'МЫ ПРИНИМАЕМ' : 'TO‘LOV USULLARI'}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 bg-white text-[#1a1f71] text-[10px] font-black tracking-wider rounded shadow-xs">
                  VISA
                </span>
                <span className="px-2.5 py-1 bg-white text-[#eb001b] text-[10px] font-black tracking-wider rounded shadow-xs">
                  MasterCard
                </span>
                <span className="px-2.5 py-1 bg-[#0070ba] text-white text-[10px] font-black tracking-wider rounded shadow-xs">
                  AMEX
                </span>
                <span className="px-2.5 py-1 bg-[#ff6000] text-white text-[10px] font-black tracking-wider rounded shadow-xs">
                  DISCOVER
                </span>
                <span className="px-2.5 py-1 bg-[#00A859] text-white text-[10px] font-black tracking-wider rounded shadow-xs">
                  PAYME
                </span>
                <span className="px-2.5 py-1 bg-[#7000FF] text-white text-[10px] font-black tracking-wider rounded shadow-xs">
                  UZUM
                </span>
                <span className="px-2.5 py-1 bg-white text-[#003087] text-[10px] font-black tracking-wider rounded shadow-xs">
                  PayPal
                </span>
              </div>
            </div>

            <Link
              to="/admin/login"
              className="text-[11px] text-white/50 hover:text-white/90 transition-colors"
            >
              {t('nav.admin_panel')}
            </Link>
          </div>

          {/* Copyright Center Bar */}
          <div className="text-center text-xs text-white/60">
            &copy; {new Date().getFullYear()} TechUz. {language === 'ru' ? 'Все права защищены.' : 'Barcha huquqlar himoyalangan.'}
          </div>
        </div>
      </div>
    </footer>
  );
}
