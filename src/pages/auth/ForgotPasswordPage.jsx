import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/feedback/Alert';
import {
  Mail,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export function ForgotPasswordPage() {
  const { t, language, setLanguage } = useLanguage();
  const { forgotPassword } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg(t('auth.error_fill_required'));
      return;
    }

    setLoading(true);
    const { error } = await forgotPassword(identifier.trim());
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || t('common.error_occurred'));
    } else {
      setSubmitted(true);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Mobile Header Logo & Language Switcher */}
        <div className="lg:hidden flex items-center justify-between pb-4 border-b border-[#2A2E3B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5B5BD6] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-white leading-none">
                Tech<span className="text-[#5B5BD6]">Uz</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-[#737985] mt-0.5">
                Electronics
              </span>
            </div>
          </div>

          <div className="flex items-center bg-[#1D2028] border border-[#2A2E3B] rounded-lg p-0.5 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setLanguage('uz')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                language === 'uz' ? 'bg-[#5B5BD6] text-white' : 'text-[#737985]'
              }`}
            >
              UZ
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ru')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                language === 'ru' ? 'bg-[#5B5BD6] text-white' : 'text-[#737985]'
              }`}
            >
              RU
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-[#16845B] flex items-center justify-center mx-auto shadow-xs border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {t('auth.request_sent_title')}
            </h2>
            <p className="text-xs sm:text-sm text-[#737985] max-w-sm mx-auto leading-relaxed">
              {t('auth.request_sent_desc')} {identifier}
            </p>

            <div className="pt-4 space-y-2">
              <Link to="/login">
                <Button variant="primary" size="lg" className="w-full font-bold cursor-pointer">
                  {t('auth.back_to_login')}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-left space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t('auth.forgot_password_title')}
              </h1>
              <p className="text-xs sm:text-sm text-[#737985] font-medium leading-relaxed">
                {t('auth.forgot_password_subtitle')}
              </p>
            </div>

            {errorMsg && (
              <Alert variant="error" title={t('common.error')}>
                {errorMsg}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t('auth.phone_or_email')}
                </label>
                <Input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t('auth.phone_or_email_placeholder')}
                  icon={Mail}
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold cursor-pointer shadow-lg shadow-[#5B5BD6]/20 transition-all"
                disabled={loading || !identifier.trim()}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t('auth.sending')}</span>
                  </span>
                ) : (
                  <span>{t('auth.send_recovery_link')}</span>
                )}
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-[#737985] border-t border-[#2A2E3B]">
              <Link
                to="/login"
                className="font-bold text-[#5B5BD6] hover:text-[#4949BC] hover:underline inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('auth.back_to_login')}</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
