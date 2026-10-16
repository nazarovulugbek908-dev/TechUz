import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/feedback/Alert';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function RegisterPage() {
  const { t, language, setLanguage } = useLanguage();
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to Home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Real-time password validations
  const isLengthValid = password.length >= 6;
  const isMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !password || !confirmPassword) {
      setErrorMsg(t('auth.error_fill_required'));
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg(t('auth.error_invalid_email'));
      return;
    }

    // Phone validation
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 9) {
      setErrorMsg(t('auth.error_invalid_phone'));
      return;
    }

    // Password validation
    if (password.length < 6) {
      setErrorMsg(t('auth.password_min_length'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(t('auth.passwords_dont_match'));
      return;
    }

    if (!agreeTerms) {
      setErrorMsg(t('auth.terms_required'));
      return;
    }

    setLoading(true);
    const { error } = await register({
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password
    });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message || t('common.error_occurred'));
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md w-full mx-auto space-y-5">
        {/* Mobile Header Logo & Language Switcher */}
        <div className="lg:hidden flex items-center justify-between pb-3 border-b border-[#2A2E3B]">
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

        {/* Title & Subtitle */}
        <div className="text-left space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t('auth.register_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#737985] font-medium leading-relaxed">
            {t('auth.register_subtitle')}
          </p>
        </div>

        {errorMsg && (
          <Alert variant="error" title={t('common.error')}>
            {errorMsg}
          </Alert>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t('auth.full_name_label')} *
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ulugbek Nazarov"
              icon={User}
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t('auth.email_label')} *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@techuz.uz"
              icon={Mail}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t('auth.phone_label')} *
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              icon={Phone}
              required
              disabled={loading}
              autoComplete="tel"
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('auth.password_label')} *
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
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('auth.confirm_password_label')} *
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                icon={Lock}
                required
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Password validation cues */}
          {password && (
            <div className="text-[11px] space-y-1 pt-0.5">
              <div className={`flex items-center gap-1.5 ${isLengthValid ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isLengthValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{t('auth.password_min_length')}</span>
              </div>
              {confirmPassword && (
                <div className={`flex items-center gap-1.5 ${isMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isMatch ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{isMatch ? t('common.success') : t('auth.passwords_dont_match')}</span>
                </div>
              )}
            </div>
          )}

          {/* Terms Agreement */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-[#2A2E3B] bg-[#1D2028] text-[#5B5BD6] focus:ring-[#5B5BD6] focus:ring-offset-0 cursor-pointer"
                required
              />
              <span className="leading-tight">
                {t('auth.terms_agree')}{' '}
                <span className="text-[#5B5BD6] font-semibold underline">
                  {t('auth.terms_of_service')}
                </span>{' '}
                {t('auth.and_conjunction')}{' '}
                <span className="text-[#5B5BD6] font-semibold underline">
                  {t('auth.privacy_policy')}
                </span>
              </span>
            </label>
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold cursor-pointer mt-2 shadow-lg shadow-[#5B5BD6]/20 transition-all"
            disabled={
              loading ||
              !fullName.trim() ||
              !email.trim() ||
              !password ||
              !confirmPassword ||
              !agreeTerms ||
              password.length < 6 ||
              password !== confirmPassword
            }
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t('auth.registering')}</span>
              </span>
            ) : (
              <span>{t('auth.register_submit')}</span>
            )}
          </Button>
        </form>

        {/* Link back to Login */}
        <div className="pt-2 text-center text-xs text-[#737985] border-t border-[#2A2E3B]">
          <span>{t('auth.have_account')} </span>
          <Link
            to="/login"
            className="font-bold text-[#5B5BD6] hover:text-[#4949BC] hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>{t('auth.login_submit')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
