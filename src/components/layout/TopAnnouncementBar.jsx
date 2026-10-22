import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../context/ThemeContext';
import { Phone, Truck, Globe, Sun, Moon } from 'lucide-react';

export function TopAnnouncementBar() {
  const { toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="bg-[#F7F8FA] dark:bg-[#15171D] text-[#737985] dark:text-[#9CA3AF] text-xs py-1.5 px-4 border-b border-[#E6E8EE] dark:border-[#2A2E3B] relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Concise Service Hotline & Delivery notice */}
        <div className="flex items-center gap-5 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 text-[#17191F] dark:text-[#F4F7FC] font-medium">
            <Truck className="w-3.5 h-3.5 text-[#00A859]" />
            <span>{t('announcement.fast_delivery')}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#737985] dark:text-[#9CA3AF]" />
            <span>{t('announcement.hotline_label')}</span>
            <a
              href="tel:+998945876472"
              className="text-[#17191F] dark:text-[#F4F7FC] hover:text-[#00A859] font-semibold transition-colors"
            >
              +998 (94) 587-64-72
            </a>
          </div>
        </div>

        {/* Right: Language switch & Theme toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-[#17191F] dark:text-[#F4F7FC] hover:bg-[#E6E8EE]/60 dark:hover:bg-[#2A2E3B] transition-colors cursor-pointer"
            aria-label="Tilni almashtirish"
          >
            <Globe className="w-3 h-3 text-[#00A859]" />
            <span>{t('nav.lang_label')}</span>
          </button>

          <span className="text-[#E6E8EE] dark:text-[#2A2E3B]">|</span>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-1 rounded text-[#737985] dark:text-[#9CA3AF] hover:text-[#17191F] dark:hover:text-white transition-colors cursor-pointer"
            aria-label={isDark ? t('theme.light') : t('theme.dark')}
            title={isDark ? t('theme.light') : t('theme.dark')}
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#737985]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
