import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import {
  Shield,
  Truck,
  Headphones,
  Lock,
  Globe
} from 'lucide-react';

export function AuthLayout({ children }) {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0E1015] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative selection:bg-[#5B5BD6] selection:text-white overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-[#5B5BD6]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-[#15171D] rounded-2xl border border-[#2A2E3B] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] relative z-10">
        {/* ================= LEFT BRAND PANEL (Desktop) ================= */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#12141A] text-white p-8 sm:p-10 flex-col justify-between overflow-hidden border-r border-[#2A2E3B]">
          {/* Top Brand Logo & Language Switcher */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#5B5BD6] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
                T
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-none">
                  Tech<span className="text-[#5B5BD6]">Uz</span>
                </span>
                <span className="text-[9px] font-semibold tracking-wider uppercase text-[#737985] mt-0.5">
                  Electronics
                </span>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-[#1D2028] border border-[#2A2E3B] rounded-lg p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setLanguage('uz')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  language === 'uz' ? 'bg-[#5B5BD6] text-white' : 'text-[#737985] hover:text-white'
                }`}
              >
                UZ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ru')}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  language === 'ru' ? 'bg-[#5B5BD6] text-white' : 'text-[#737985] hover:text-white'
                }`}
              >
                RU
              </button>
            </div>
          </div>

          {/* Middle: Brand Pitch */}
          <div className="relative z-10 my-8 space-y-6">
            <div className="space-y-3">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#5B5BD6] bg-[#5B5BD6]/10 px-2.5 py-1 rounded-md border border-[#5B5BD6]/20">
                Premium Store
              </span>
              <h2 className="text-2xl font-extrabold text-white leading-snug">
                {t('auth.brand_pitch_title')}
              </h2>
              <p className="text-xs text-[#737985] leading-relaxed">
                {t('auth.brand_pitch_desc')}
              </p>
            </div>

            {/* Store Features */}
            <div className="space-y-3 pt-2">
              {[
                {
                  icon: Shield,
                  title: t('benefits.warranty_title'),
                  desc: t('benefits.warranty_desc')
                },
                {
                  icon: Truck,
                  title: t('benefits.delivery_title'),
                  desc: t('benefits.delivery_desc')
                },
                {
                  icon: Headphones,
                  title: t('benefits.support_title'),
                  desc: t('benefits.support_desc')
                }
              ].map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-[#5B5BD6] flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white leading-tight">{benefit.title}</p>
                      <p className="text-[10px] text-[#737985] leading-tight">{benefit.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-4 border-t border-[#2A2E3B] flex items-center justify-between text-[11px] text-[#737985]">
            <span className="text-[#16845B] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16845B]" />
              {t('auth.secure_connection')}
            </span>
            <span className="text-slate-500 font-medium">TechUz Electronics</span>
          </div>
        </div>

        {/* ================= RIGHT FORM PANEL ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#15171D] text-white">
          {children}
        </div>
      </div>
    </div>
  );
}
