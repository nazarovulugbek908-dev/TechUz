import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/feedback/Alert';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

export function ResetPasswordPage() {
  const { t } = useLanguage();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token') || searchParams.get('resetToken') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    const { error } = await resetPassword({ resetToken, newPassword: password });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || t('common.error_occurred'));
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md w-full mx-auto space-y-6">
        {success ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-[#16845B] flex items-center justify-center mx-auto shadow-xs border border-emerald-500/20">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {t('auth.password_updated_success')}
            </h2>
            <p className="text-xs text-[#737985]">
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
            <div className="text-left space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t('auth.reset_password_title')}
              </h1>
              <p className="text-xs sm:text-sm text-[#737985] font-medium leading-relaxed">
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t('auth.new_password_label')}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={Lock}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t('auth.confirm_password_label')}
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={Lock}
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 font-bold cursor-pointer shadow-lg shadow-[#5B5BD6]/20 transition-all"
                disabled={loading || !password || !confirmPassword || password.length < 6 || password !== confirmPassword}
              >
                {loading ? t('common.loading') : t('auth.reset_submit')}
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-[#737985] border-t border-[#2A2E3B]">
              <Link
                to="/login"
                className="font-bold text-[#5B5BD6] hover:text-[#4949BC] hover:underline inline-flex items-center gap-1 transition-colors"
              >
                <span>{t('auth.back_to_login')}</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
