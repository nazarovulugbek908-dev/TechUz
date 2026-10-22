import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/feedback/Alert';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const REMEMBER_IDENTIFIER_KEY = 'techuz_remembered_identifier';

export function LoginPage() {
  const { t, language, setLanguage } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const { loginAdmin, isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState(() => {
    return localStorage.getItem(REMEMBER_IDENTIFIER_KEY) || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem(REMEMBER_IDENTIFIER_KEY);
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname;
  const destination = from && from !== '/login' && from !== '/register' ? from : '/';

  // If already authenticated, redirect
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    } else if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, isAdminAuthenticated, navigate, destination]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password) {
      setErrorMsg(t('auth.error_fill_required'));
      return;
    }

    setLoading(true);
    const cleaned = cleanIdentifier.toLowerCase();

    // Handle Remember Me identifier storage
    if (rememberMe) {
      localStorage.setItem(REMEMBER_IDENTIFIER_KEY, cleanIdentifier);
    } else {
      localStorage.removeItem(REMEMBER_IDENTIFIER_KEY);
    }

    // Check if input is Admin credentials
    if (
      cleaned === 'admin@gmail.com' ||
      cleaned === 'admin@techuz.uz' ||
      cleaned === 'admin'
    ) {
      const { error } = await loginAdmin(cleaned, password);
      setLoading(false);
      if (error) {
        setErrorMsg(error.message || t('auth.invalid_credentials'));
      } else {
        navigate('/admin', { replace: true });
      }
      return;
    }

    // Customer login
    const { data: authData, error } = await login(cleanIdentifier, password, rememberMe);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || t('auth.invalid_credentials'));
    } else {
      if (authData?.user?.role === 'admin') {
        await loginAdmin(cleaned, password);
        navigate('/admin', { replace: true });
      } else {
        navigate(destination, { replace: true });
      }
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Mobile Header Logo & Language Switcher */}
        <div className="lg:hidden flex items-center justify-between pb-4 border-b border-[#2A2E3B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00A859] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl text-white leading-none">
                Tech<span className="text-[#00A859]">Uz</span>
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
                language === 'uz' ? 'bg-[#00A859] text-white' : 'text-[#737985]'
              }`}
            >
              UZ
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ru')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                language === 'ru' ? 'bg-[#00A859] text-white' : 'text-[#737985]'
              }`}
            >
              RU
            </button>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-left space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t('auth.login_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#737985] font-medium leading-relaxed">
            {t('auth.login_subtitle')}
          </p>
        </div>

        {errorMsg && (
          <Alert variant="error" title={t('common.error')}>
            {errorMsg}
          </Alert>
        )}

        {/* Login Form */}
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
              autoComplete="username"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {t('auth.password_label')}
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#00A859] hover:text-[#00924C] hover:underline transition-colors"
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
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-slate-400 font-medium hover:text-slate-300 transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#2A2E3B] bg-[#1D2028] text-[#00A859] focus:ring-[#00A859] focus:ring-offset-0 cursor-pointer"
              />
              <span>{t('auth.remember_me')}</span>
            </label>
          </div>

          {/* Primary Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold cursor-pointer transition-all shadow-lg shadow-[#00A859]/20"
            disabled={loading || !identifier.trim() || !password}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('auth.logging_in')}</span>
              </span>
            ) : (
              <span>{t('auth.login_submit')}</span>
            )}
          </Button>
        </form>

        {/* Link to Register */}
        <div className="pt-2 text-center text-xs text-[#737985] border-t border-[#2A2E3B]">
          <span>{t('auth.no_account')} </span>
          <Link
            to="/register"
            className="font-bold text-[#00A859] hover:text-[#00924C] hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>{t('auth.register_submit')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
