import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export function AuthLoadingScreen() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0E1015] flex flex-col items-center justify-center p-6 text-white selection:bg-[#5B5BD6] selection:text-white">
      <div className="flex flex-col items-center space-y-5 animate-in fade-in duration-200">
        {/* TechUz Electronics Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#5B5BD6] text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-[#5B5BD6]/30 animate-pulse">
            T
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-none">
              Tech<span className="text-[#5B5BD6]">Uz</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mt-1">
              Electronics
            </span>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center gap-2.5 pt-2 text-xs font-semibold text-slate-400">
          <div className="w-4 h-4 border-2 border-[#5B5BD6]/30 border-t-[#5B5BD6] rounded-full animate-spin" />
          <span>{t('common.loading')}</span>
        </div>
      </div>
    </div>
  );
}
