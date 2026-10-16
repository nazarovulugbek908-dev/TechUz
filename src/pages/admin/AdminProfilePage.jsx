import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/feedback/Alert';
import { Shield, User, Mail, Lock, CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';

export function AdminProfilePage() {
  const { t } = useLanguage();
  const { admin, updateAdminProfile } = useAdminAuth();

  const [name, setName] = useState(admin?.name || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (admin) {
      setName(admin.name || '');
      setEmail(admin.email || '');
    }
  }, [admin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim()) {
      setErrorMsg(t('admin.error_fill_required'));
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMsg(t('auth.password_min_length'));
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg(t('auth.passwords_dont_match'));
        return;
      }
    }

    setSaving(true);
    const { error } = await updateAdminProfile({
      name,
      email,
      newPassword: newPassword || undefined
    });
    setSaving(false);

    if (error) {
      setErrorMsg(t(error.message) || error.message);
    } else {
      setSuccessMsg(t('admin.profile_saved_success'));
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/admin" className="hover:text-slate-900 dark:hover:text-white">
          {t('admin.nav_dashboard')}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-bold">
          {t('admin.profile_modal_title')}
        </span>
      </div>

      {/* Header Profile Card */}
      <div className="bg-[#15171D] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-sm font-heading">
            A
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
                {admin?.name || 'Super Admin'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                {t('admin.online_status')}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              {admin?.email || ''} • {t('admin.role_super_admin')}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="p-6 sm:p-8 border-neutral-200/80 dark:border-neutral-800 space-y-6">
        <div>
          <h2 className="text-lg font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            {t('admin.profile_modal_title')}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {t('admin.profile_settings_desc')}
          </p>
        </div>

        {successMsg && (
          <Alert variant="success" title={t('common.success')}>
            {successMsg}
          </Alert>
        )}

        {errorMsg && (
          <Alert variant="error" title={t('common.error')}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                {t('admin.name_label')} *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Super Admin"
                icon={User}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                {t('auth.email_label')} *
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                icon={Mail}
                required
              />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h3 className="text-sm font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              {t('admin.change_password_section')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {t('admin.new_password_optional')}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={Lock}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 cursor-pointer"
                    aria-label={showPassword ? 'Hide' : 'Show'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {t('auth.confirm_password_label')}
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={Lock}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={saving}
              className="font-bold shadow-sm shadow-brand-500/20"
            >
              {saving ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
