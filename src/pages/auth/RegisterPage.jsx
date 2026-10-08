import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/feedback/Alert';
import { UserPlus, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';

export function RegisterPage() {
  const { t } = useLanguage();
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to Home
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !phone.trim() || !email.trim() || !password) {
      setErrorMsg(t('auth.error_fill_required'));
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg(t('auth.error_invalid_email'));
      return;
    }

    if (phone.replace(/\D/g, '').length < 9) {
      setErrorMsg(t('auth.error_invalid_phone'));
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
    const { error } = await register({
      email,
      password,
      fullName,
      phone
    });
    setLoading(false);

    if (error) {
      setErrorMsg(t(error.message) || error.message);
    } else {
      navigate('/', { replace: true });
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
          {t('auth.register_title')}
        </span>
      </div>

      <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200/80 dark:border-slate-800">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#FF7A00] flex items-center justify-center mx-auto shadow-sm">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black font-heading text-slate-900 dark:text-white">
            {t('auth.register_title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('auth.register_subtitle')}
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
              {t('auth.full_name_label')}
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ulugbek Nazarov"
              icon={User}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.phone_label')}
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 94 587-64-72"
              icon={Phone}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.email_label')}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@techuz.uz"
              icon={Mail}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.password_label')}
            </label>
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

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('auth.confirm_password_label')}
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
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
            {loading ? t('common.loading') : t('auth.register_submit')}
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <span>{t('auth.have_account')} </span>
          <Link
            to="/login"
            className="font-bold text-[#FF7A00] hover:underline inline-flex items-center gap-1"
          >
            {t('auth.login_title')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
