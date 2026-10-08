import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/feedback/Alert';
import { User, Mail, Phone, MapPin, Package, LogOut, CheckCircle2, Shield } from 'lucide-react';

export function AccountPage() {
  const { t } = useLanguage();
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || 'Ulugbek Nazarov');
  const [phone, setPhone] = useState(user?.phone || '+998 94 587-64-72');
  const [city, setCity] = useState(user?.city || 'Quvasoy');
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || 'Quvasoy shahri, Markaziy ko\'cha, 1-uy');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSavedSuccess(false);

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg(t('auth.error_fill_required'));
      return;
    }

    setLoading(true);
    const { error } = await updateProfile({
      fullName,
      phone,
      city,
      streetAddress
    });
    setLoading(false);

    if (error) {
      setErrorMsg(t(error.message) || error.message);
    } else {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          {t('nav.home')}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-bold">
          {t('account.profile_title')}
        </span>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 font-heading">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
                {user?.fullName || t('account.guest_user')}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800 text-[11px] font-bold flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {t('account.verified_customer')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {user?.email} • {user?.phone || '+998 -- --- -- --'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/account/orders">
            <Button variant="outline" size="md" icon={Package}>
              {t('account.my_orders')}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="md"
            icon={LogOut}
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            {t('auth.logout_button')}
          </Button>
        </div>
      </div>

      {/* Profile Details & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Quick Summary Info */}
        <Card className="p-6 space-y-6 h-fit border-slate-200/80 dark:border-slate-800">
          <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-[#FF7A00]" />
            {t('account.personal_info')}
          </h2>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
              <span className="text-slate-400 block">{t('auth.email_label')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user?.email}</span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
              <span className="text-slate-400 block">{t('auth.phone_label')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user?.phone || '—'}</span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
              <span className="text-slate-400 block">{t('account.city_label')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{user?.city || 'Toshkent'}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/account/orders" className="block">
              <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/70 dark:border-orange-900/50 hover:border-[#FF7A00] transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#FF7A00]" />
                  <div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white">{t('account.view_order_history')}</p>
                    <p className="text-[11px] text-slate-500">{t('account.track_and_manage_orders')}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </Card>

        {/* Right Form: Edit Profile */}
        <Card className="lg:col-span-2 p-6 sm:p-8 space-y-6 border-slate-200/80 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
              {t('account.edit_profile_title')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('account.edit_profile_desc')}
            </p>
          </div>

          {savedSuccess && (
            <Alert variant="success" title={t('common.success')}>
              {t('account.profile_updated_success')}
            </Alert>
          )}

          {errorMsg && (
            <Alert variant="error" title={t('common.error')}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('auth.full_name_label')}
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aziz Rahimov"
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('account.city_label')}
                </label>
                <Input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Quvasoy shahri"
                  icon={MapPin}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('account.address_label')}
                </label>
                <Input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Quvasoy shahri, Markaziy ko'cha, 1-uy"
                  icon={MapPin}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="font-bold shadow-lg shadow-orange-500/20"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('account.save_changes')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
