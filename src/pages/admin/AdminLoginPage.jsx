import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/feedback/Alert';
import { Shield, Mail, Lock, LogIn, Eye, EyeOff, Store } from 'lucide-react';

export function AdminLoginPage() {
  const { t } = useLanguage();
  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg(t('admin.error_fill_required'));
      return;
    }

    setLoading(true);
    const { error } = await loginAdmin(email, password);
    setLoading(false);

    if (error) {
      setErrorMsg(t(error.message) || error.message);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#15171D] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight text-white">
            TechUz <span className="text-brand-400">Admin</span>
          </h2>
          <p className="text-xs text-neutral-400">
            {t('admin.admin_login_subtitle')}
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-[#1A1D24] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {errorMsg && (
            <Alert variant="error" title={t('common.error')}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                {t('auth.email_label')}
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                icon={Mail}
                required
                className="bg-[#15171D] border-neutral-800 text-white placeholder:text-neutral-500 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
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
                  className="bg-[#15171D] border-neutral-800 text-white placeholder:text-neutral-500 focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 cursor-pointer"
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
              className="w-full mt-2 font-bold shadow-sm shadow-brand-500/20"
              disabled={loading}
            >
              {loading ? t('common.loading') : t('admin.login_submit')}
            </Button>
          </form>

          <div className="pt-2 text-center border-t border-neutral-800">
            <Link
              to="/"
              className="text-xs font-semibold text-neutral-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-brand-400" />
              {t('admin.back_to_store')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
