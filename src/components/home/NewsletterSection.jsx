import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export function NewsletterSection({ className = '' }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className={cn('max-w-7xl mx-auto px-4 sm:px-6', className)}>
      <div className="bg-linear-to-r from-zinc-900 via-zinc-850 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-zinc-800 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-2">
            <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight">
              {t('home.newsletter_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              {t('home.newsletter_desc')}
            </p>

            {/* Telegram Channel Link */}
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-orange-400">
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              <span>{t('home.telegram_channel')}: @TechUzOfficial</span>
            </div>
          </div>

          {/* Right Input Form */}
          <div className="lg:col-span-5">
            {isSubscribed ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{t('home.newsletter_success')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.newsletter_placeholder')}
                  className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-2xl text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#FF7A00] transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#FF7A00] hover:bg-[#E66E00] text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('home.newsletter_btn')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
