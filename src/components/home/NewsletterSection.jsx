import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
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
      <div className="bg-white dark:bg-[#1D2028] text-[#17191F] dark:text-[#F4F7FC] rounded-xl p-6 sm:p-8 border border-[#E6E8EE] dark:border-[#2A2E3B] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              {t('home.newsletter_title')}
            </h3>
            <p className="text-xs sm:text-sm text-[#737985] dark:text-[#9CA3AF]">
              {t('home.newsletter_desc')}
            </p>

            {/* Telegram Channel Link */}
            <div className="pt-1 flex items-center gap-1.5 text-xs font-semibold text-[#00A859]">
              <MessageCircle className="w-4 h-4" />
              <span>{t('home.telegram_channel')}: @TechUzOfficial</span>
            </div>
          </div>

          {/* Right Input Form */}
          <div className="lg:col-span-5">
            {isSubscribed ? (
              <div className="p-3 bg-[#EAF6F0] border border-[#CFEBDD] rounded-lg flex items-center gap-2 text-[#16845B] text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
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
                  className="flex-1 px-3 py-2 bg-[#F7F8FA] dark:bg-[#15171D] border border-[#E6E8EE] dark:border-[#2A2E3B] rounded-lg text-xs sm:text-sm text-[#17191F] dark:text-white placeholder:text-[#737985]/60 outline-none focus:border-[#00A859] transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00A859] hover:bg-[#00924C] active:bg-[#007D40] text-white font-semibold text-xs sm:text-sm rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
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
