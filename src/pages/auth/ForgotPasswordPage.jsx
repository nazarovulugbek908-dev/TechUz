import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/feedback/Alert';
import { KeyRound, Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';

export function ForgotPasswordPage() {
  const { t } = useLanguage();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg(t('auth.error_fill_required'));
      return;
    }

    setLoading(true);
    const { error } = await forgotPassword(email);
    setLoading(false);

    if (error) {
      setErrorMsg(t(error.message) || error.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          {t('nav.home')}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-bold">
          {t('auth.forgot_password_title')}
        </span>
      </div>

      <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200/80 dark:border-slate-800">
        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/50 text-green-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black font-heading text-slate-900 dark:text-white">
              {t('auth.mock_recovery_title')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              {t('auth.mock_recovery_sent')} <strong>{email}</strong>
            </p>
            <div className="pt-4 space-y-2">
              <Link to={`/reset-password?email=${encodeURIComponent(email)}`}>
                <Button variant="primary" size="md" className="w-full">
                  {t('auth.proceed_reset_btn')}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/login" className="block">
                <Button variant="ghost" size="sm" className="w-full">
                  {t('auth.back_to_login')}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#FF7A00] flex items-center justify-center mx-auto shadow-sm">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black font-heading text-slate-900 dark:text-white">
                {t('auth.forgot_password_title')}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('auth.email_label')}
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@techuz.uz"
                  icon={Mail}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 font-bold shadow-lg shadow-orange-500/20"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('auth.send_recovery_link')}
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/login"
                className="font-bold text-slate-600 dark:text-slate-300 hover:text-[#FF7A00] inline-flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t('auth.back_to_login')}
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
