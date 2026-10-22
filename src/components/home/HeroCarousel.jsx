import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { ShieldCheck, Truck, CreditCard, Sparkles, ArrowRight, PhoneCall } from 'lucide-react';

export function HeroCarousel() {
  const { language } = useLanguage();
  const isRu = language === 'ru';

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-4">
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-green-50/50 dark:from-[#1D2028] dark:via-[#191C24] dark:to-[#15171D] border border-[#E6E8EE] dark:border-[#2A2E3B] shadow-xs p-6 sm:p-10 lg:p-12">
        {/* Subtle decorative background ambient glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#00A859]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#00A859]/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand Welcome Text */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859] border border-[#00A859]/20 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#00A859] animate-pulse" />
              <span>
                {isRu
                  ? 'Официальный магазин электроники'
                  : 'Rasmiy elektronika va gadjetlar do‘koni'}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#17191F] dark:text-[#F4F7FC] leading-tight">
              {isRu ? (
                <>
                  Добро пожаловать в <span className="text-[#00A859]">TechUz</span>
                </>
              ) : (
                <>
                  <span className="text-[#00A859]">TechUz</span> rasmiy do‘koniga xush kelibsiz!
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#737985] dark:text-[#9CA3AF] max-w-xl leading-relaxed">
              {isRu
                ? 'Премиальные смартфоны, оригинальные аксессуары и современные гаджеты. Быстрая доставка по всему Узбекистану и официальная гарантия на каждый товар.'
                : 'Eng so‘nggi smartfonlar, original aksessuarlar va zamonaviy gadjetlar. Butun O‘zbekiston bo‘ylab tezkor yetkazib berish hamda rasmiy kafolat.'}
            </p>

            {/* Brand Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/90 dark:bg-[#15171D]/90 border border-gray-150 dark:border-[#2A2E3B] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#00A859] shrink-0" />
                <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">
                  {isRu ? '100% Оригинал' : '100% Asl mahsulot'}
                </span>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/90 dark:bg-[#15171D]/90 border border-gray-150 dark:border-[#2A2E3B] shadow-2xs">
                <Truck className="w-4 h-4 text-[#00A859] shrink-0" />
                <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">
                  {isRu ? 'Быстрая доставка' : 'Tezkor yetkazish'}
                </span>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/90 dark:bg-[#15171D]/90 border border-gray-150 dark:border-[#2A2E3B] shadow-2xs">
                <CreditCard className="w-4 h-4 text-[#00A859] shrink-0" />
                <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">
                  {isRu ? 'Удобная оплата' : 'Qulay to‘lov'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00A859] hover:bg-[#00924C] active:bg-[#007D40] text-white font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md text-center"
              >
                <span>{isRu ? 'Перейти в каталог' : 'Katalogni ko‘rish'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>

              <a
                href="tel:+998945876472"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-[#15171D] border border-gray-200 dark:border-[#2A2E3B] hover:bg-gray-50 dark:hover:bg-[#1E212B] text-gray-700 dark:text-gray-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs text-center"
              >
                <PhoneCall className="w-4 h-4 text-[#00A859] shrink-0" />
                <span>+998 (94) 587-64-72</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Trust Badges & Showcase Card */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-sm space-y-3">
              {/* Feature Box 1 */}
              <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#15171D]/95 border border-emerald-100 dark:border-[#2A2E3B] shadow-sm flex items-center gap-3.5 transition-transform hover:-translate-y-0.5 duration-200">
                <div className="w-11 h-11 rounded-xl bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    {isRu ? 'Официальная гарантия' : 'Rasmiy kafolat'}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {isRu
                      ? 'Сертифицированная продукция и сервис'
                      : 'Sertifikatlangan mahsulotlar va servis'}
                  </p>
                </div>
              </div>

              {/* Feature Box 2 */}
              <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#15171D]/95 border border-emerald-100 dark:border-[#2A2E3B] shadow-sm flex items-center gap-3.5 transition-transform hover:-translate-y-0.5 duration-200">
                <div className="w-11 h-11 rounded-xl bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859] flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    {isRu ? 'Доставка по всему Узбекистану' : 'Butun O‘zbekistonga yetkazish'}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {isRu
                      ? 'Быстро и надежно прямо до ваших дверей'
                      : 'Eshigingizgacha tez va xavfsiz yetkazib beramiz'}
                  </p>
                </div>
              </div>

              {/* Feature Box 3 */}
              <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#15171D]/95 border border-emerald-100 dark:border-[#2A2E3B] shadow-sm flex items-center gap-3.5 transition-transform hover:-translate-y-0.5 duration-200">
                <div className="w-11 h-11 rounded-xl bg-[#E6F7EF] dark:bg-[#00A859]/15 text-[#00A859] flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    {isRu ? 'Скоро: новые поступления' : 'Tez orada yangi tovarlar'}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {isRu
                      ? 'Ассортимент пополняется лучшими новинками'
                      : 'Assortiment eng sara yangiliklar bilan to‘ldiriladi'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
