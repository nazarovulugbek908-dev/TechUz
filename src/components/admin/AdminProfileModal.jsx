import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../feedback/Alert';
import { Shield, User, Mail, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export function AdminProfileModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const { admin, updateAdminProfile } = useAdminAuth();

  const [name, setName] = useState(admin?.name || 'Ulugbek Nazarov');
  const [email, setEmail] = useState(admin?.email || 'admin@gmail.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (admin) {
      setName(admin.name || 'Ulugbek Nazarov');
      setEmail(admin.email || 'admin@gmail.com');
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
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('admin.profile_modal_title')}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 text-xs">
        {/* Admin Header Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center gap-4 shadow-sm border border-slate-700">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-orange-500/20 font-heading">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-base text-white">
                {admin?.name || 'Super Admin'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                {t('admin.online_status')}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {admin?.email || 'admin@gmail.com'}
            </p>
            <span className="inline-block mt-1 text-[10px] font-bold text-orange-400">
              {t('admin.role_super_admin')}
            </span>
          </div>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
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
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
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

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  aria-label={showPassword ? 'Hide' : 'Show'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {newPassword && (
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
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={saving}
              className="font-bold shadow-lg shadow-orange-500/20"
            >
              {saving ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
