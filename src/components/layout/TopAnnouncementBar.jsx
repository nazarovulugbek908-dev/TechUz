import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Phone, ShieldCheck, Truck, Globe, Sun, Moon } from 'lucide-react';

export function TopAnnouncementBar() {
  const { toggleLanguage, isUz, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="bg-[#121826] text-slate-300 text-xs py-2 px-4 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Value propositions / Hotline */}
        <div className="flex items-center gap-6 overflow-hidden text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{t('announcement.fast_delivery')}</span>
            <span className="sm:hidden">{t('announcement.fast_delivery_short')}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{t('announcement.warranty_badge')}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
            <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>
              {t('announcement.hotline_label')}{' '}
              <a href="tel:+998945876472" className="text-white hover:text-orange-400 font-bold ml-1">
                +998 (94) 587-64-72
              </a>
            </span>
          </div>
        </div>

        {/* Right: Language switch & Theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/90 hover:bg-zinc-700 text-orange-400 text-xs font-bold transition-colors cursor-pointer"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t('nav.lang_label')}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-md bg-zinc-800/90 hover:bg-zinc-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label={isDark ? t('theme.light') : t('theme.dark')}
            title={isDark ? t('theme.light') : t('theme.dark')}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
