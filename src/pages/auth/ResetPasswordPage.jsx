import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/feedback/Alert';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export function ResetPasswordPage() {
  const { t } = useLanguage();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password || !confirmPassword) {
      setErrorMsg(t('auth.error_fill_required'));
      return;
    }

    if (password.length < 6) {
      setErrorMsg(t('auth.password_min_length'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(t('auth.passwords_dont_match'));
      return;
    }

    setLoading(true);
    const { error } = await resetPassword({ email: emailParam, newPassword: password });
    setLoading(false);

    if (error) {
      setErrorMsg(t(error.message) || error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
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
          {t('auth.reset_password_title')}
        </span>
      </div>

      <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200/80 dark:border-slate-800">
        {success ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/50 text-green-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black font-heading text-slate-900 dark:text-white">
              {t('auth.password_updated_success')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('auth.redirecting_to_login')}
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button variant="primary" size="md" className="w-full">
                  {t('auth.back_to_login')}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#FF7A00] flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black font-heading text-slate-900 dark:text-white">
                {t('auth.reset_password_title')}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('auth.reset_password_subtitle')}
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
                  {t('auth.new_password_label')}
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('auth.confirm_password_label')}
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={Lock}
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
                {loading ? t('common.loading') : t('auth.reset_submit')}
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
