import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/feedback/Alert';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const { t } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const { loginAdmin, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  // If already authenticated as customer, redirect to Home
  // If already authenticated as admin, redirect to Admin Dashboard
  React.useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    } else if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isAdminAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg(t('auth.error_fill_required'));
      return;
    }

    setLoading(true);
    const cleanedEmail = email.trim().toLowerCase();

    // Check if input is Admin credentials
    if (cleanedEmail === 'admin@gmail.com' || cleanedEmail === 'admin@techuz.uz' || cleanedEmail === 'admin@gamail.com') {
      const { data, error } = await loginAdmin(cleanedEmail, password);
      setLoading(false);
      if (error) {
        setErrorMsg(t(error.message) || error.message);
      } else {
        navigate('/admin', { replace: true });
      }
      return;
    }

    // Otherwise handle regular Customer login
    const { error } = await login(email, password);
    setLoading(false);

    if (error) {
      setErrorMsg(t(error.message) || error.message);
    } else {
      const destination = from && from !== '/login' && from !== '/register' ? from : '/';
      navigate(destination, { replace: true });
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
          {t('auth.login_title')}
        </span>
      </div>

      <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200/80 dark:border-slate-800">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#FF7A00] flex items-center justify-center mx-auto shadow-sm">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black font-heading text-slate-900 dark:text-white">
            {t('auth.login_title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('auth.login_subtitle')}
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
              placeholder="example@gmail.com"
              icon={Mail}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('auth.password_label')}
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-[#FF7A00] hover:underline"
              >
                {t('auth.forgot_password_link')}
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2 font-bold shadow-lg shadow-orange-500/20"
            disabled={loading}
          >
            {loading ? t('common.loading') : t('auth.login_submit')}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <span>{t('auth.no_account')} </span>
          <Link
            to="/register"
            className="font-bold text-[#FF7A00] hover:underline inline-flex items-center gap-1"
          >
            {t('auth.register_title')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
