import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { formatUzbekCurrency } from '../utils/currency';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/feedback/EmptyState';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  CreditCard,
  Banknote,
  MapPin,
  User,
  Phone,
  FileText,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

const REGIONS_UZ = [
  'Toshkent shahri',
  'Toshkent viloyati',
  'Andijon viloyati',
  'Buxoro viloyati',
  "Farg'ona viloyati",
  'Jizzax viloyati',
  'Xorazm viloyati',
  'Namangan viloyati',
  'Navoiy viloyati',
  'Qashqadaryo viloyati',
  "Qoraqalpog'iston Respublikasi",
  'Samarqand viloyati',
  'Sirdaryo viloyati',
  'Surxondaryo viloyati'
];

export function CheckoutPage() {
  const { t, language, isUz } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    clearCart,
    subtotal,
    deliveryFee,
    total
  } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user ? (user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim()) : '',
    phone: user?.phone || '',
    region: user?.region || 'Toshkent shahri',
    cityDistrict: user?.city || user?.cityDistrict || '',
    streetAddress: user?.streetAddress || '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'payme' | 'click'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || prev.fullName,
        phone: user.phone || prev.phone,
        region: user.region || prev.region || 'Toshkent shahri',
        cityDistrict: user.city || user.cityDistrict || prev.cityDistrict,
        streetAddress: user.streetAddress || prev.streetAddress
      }));
    }
  }, [user]);

  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {t('checkout.success_title')}
        </span>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mt-4">
          {t('checkout.success_thank_you')}
        </h1>

        <p className="text-sm sm:text-base text-slate-500 mt-2">
          {t('checkout.order_number_label')} <strong className="text-slate-900 dark:text-white font-mono text-lg">{completedOrder.orderNumber}</strong>
        </p>

        <Card className="mt-8 p-6 text-left space-y-4">
          <h3 className="text-xs font-bold text-[#737985] uppercase tracking-wider">
            {t('checkout.delivery_address')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#737985] block text-xs">{t('admin.customer_col')}:</span>
              <span className="font-semibold text-[#17191F] dark:text-white">
                {completedOrder.customer?.fullName || completedOrder.customerName}
              </span>
            </div>

            <div>
              <span className="text-[#737985] block text-xs">{t('auth.phone_label')}:</span>
              <span className="font-semibold text-[#17191F] dark:text-white">
                {completedOrder.customer?.phone || completedOrder.customerPhone}
              </span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-[#737985] block text-xs">{t('checkout.delivery_address')}:</span>
              <span className="font-semibold text-[#17191F] dark:text-white">
                {completedOrder.customer?.region || ''}, {completedOrder.customer?.streetAddress || ''}
              </span>
            </div>

            <div>
              <span className="text-[#737985] block text-xs">{t('checkout.payment_method')}:</span>
              <span className="font-semibold text-[#17191F] dark:text-white uppercase">
                {completedOrder.paymentMethod === 'cash' ? t('checkout.payment_cash_desc') : completedOrder.paymentMethod}
              </span>
            </div>

            <div>
              <span className="text-[#737985] block text-xs">{t('cart.total')}:</span>
              <span className="font-extrabold text-[#5B5BD6]">
                {formatUzbekCurrency(completedOrder.total, language)}
              </span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link to="/account/orders" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full">
              {t('checkout.view_order_history')}
            </Button>
          </Link>
          <Link to="/shop" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              {t('checkout.continue_shopping')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon={ShoppingBag}
          title={t('cart.empty_title')}
          description={t('cart.empty_desc')}
          actionLabel={t('cart.start_shopping')}
          onAction={() => navigate('/shop')}
        />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Iltimos, ism va familiyangizni kiriting');
      return;
    }

    if (!formData.phone.trim() || formData.phone.length < 9) {
      setErrorMsg('Iltimos, to\'g\'ri telefon raqamingizni kiriting');
      return;
    }

    if (!formData.streetAddress.trim()) {
      setErrorMsg('Iltimos, yetkazib berish manzilini kiriting');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await orderService.createOrder({
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          region: formData.region,
          cityDistrict: formData.cityDistrict,
          streetAddress: formData.streetAddress,
          notes: formData.notes
        },
        items: cartItems,
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        notes: formData.notes,
        userId: user?.id || null
      });

      if (error || !data) {
        setErrorMsg(error?.message || 'Buyurtma yaratishda xatolik yuz berdi');
        setIsSubmitting(false);
        return;
      }

      clearCart();
      setCompletedOrder(data);
    } catch (err) {
      console.error('Order creation failed:', err);
      setErrorMsg('Buyurtma rasmiylashtirishda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#737985] mb-6">
        <Link to="/" className="hover:text-[#17191F] dark:hover:text-slate-200">
          {t('nav.home')}
        </Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-[#17191F] dark:hover:text-slate-200">
          {t('cart.title')}
        </Link>
        <span>/</span>
        <span className="text-[#17191F] dark:text-slate-300">Rasmiylashtirish</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17191F] dark:text-white">
          Buyurtmani rasmiylashtirish
        </h1>
        <p className="text-sm text-[#737985] mt-1">
          Ma'lumotlaringizni to'ldiring va buyurtmani tasdiqlang
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Delivery Details & Payment */}
          <div className="lg:col-span-8 space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-[#D64545] text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            {/* 1. Recipient Info */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-[#E6E8EE] dark:border-slate-800 pb-3">
                <div className="w-7 h-7 rounded-lg bg-[#5B5BD6]/10 text-[#5B5BD6] border border-[#5B5BD6]/20 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h2 className="text-base font-bold text-[#17191F] dark:text-white">
                  Qabul qiluvchi ma'lumotlari
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#17191F] dark:text-slate-300 mb-1.5">
                    F.I.SH (Ism va familiya) *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Masalan: Ulugbek Nazarov"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17191F] dark:text-slate-300 mb-1.5">
                    Telefon raqam *
                  </label>
                  <Input
                    type="tel"
                    required
                    placeholder="+998 94 587 64 72"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </Card>

            {/* 2. Delivery Address */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-[#E6E8EE] dark:border-slate-800 pb-3">
                <div className="w-7 h-7 rounded-lg bg-[#5B5BD6]/10 text-[#5B5BD6] border border-[#5B5BD6]/20 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="text-base font-bold text-[#17191F] dark:text-white">
                  Yetkazib berish manzili
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#17191F] dark:text-slate-300 mb-1.5">
                    Viloyat / Shahar *
                  </label>
                  <Select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    options={REGIONS_UZ}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17191F] dark:text-slate-300 mb-1.5">
                    Tuman / Aholi punkti
                  </label>
                  <Input
                    type="text"
                    placeholder="Masalan: Quvasoy shahri"
                    value={formData.cityDistrict}
                    onChange={(e) => setFormData({ ...formData, cityDistrict: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#17191F] dark:text-slate-300 mb-1.5">
                    Ko'cha, uy, xonadon raqami *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Masalan: Markaziy ko'cha, 24-uy, 15-xonadon"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#17191F] dark:text-slate-300 mb-1.5">
                    Kuryer uchun izoh (ixtiyoriy)
                  </label>
                  <Input
                    type="text"
                    placeholder="Masalan: Domofon kodi 45, eshik oldida qoldiring"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
            </Card>

            {/* 3. Payment Method */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-[#E6E8EE] dark:border-slate-800 pb-3">
                <div className="w-7 h-7 rounded-lg bg-[#5B5BD6]/10 text-[#5B5BD6] border border-[#5B5BD6]/20 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h2 className="text-base font-bold text-[#17191F] dark:text-white">
                  To'lov usuli
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    paymentMethod === 'cash'
                      ? 'border-[#5B5BD6] bg-[#EEEEFF]/40 dark:bg-slate-800 shadow-xs'
                      : 'border-[#E6E8EE] dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Banknote className="w-6 h-6 text-[#5B5BD6]" />
                    {paymentMethod === 'cash' && (
                      <div className="w-5 h-5 rounded-full bg-[#5B5BD6] text-white flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-[#17191F] dark:text-white">
                      Naqd / Kuryerga
                    </h4>
                    <p className="text-xs text-[#737985] mt-0.5">
                      Qabul qilib olganda to'lash
                    </p>
                  </div>
                </button>

                {/* Payme */}
                <div className="p-4 rounded-xl border border-[#E6E8EE] dark:border-slate-800 bg-[#F7F8FA]/60 dark:bg-slate-800/40 opacity-70 relative flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-6 h-6 text-sky-500" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[#737985] dark:text-slate-300">
                      Tez orada
                    </span>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-[#17191F] dark:text-white">
                      Payme
                    </h4>
                    <p className="text-xs text-[#737985] mt-0.5">
                      Karta orqali to'lov
                    </p>
                  </div>
                </div>

                {/* Click */}
                <div className="p-4 rounded-xl border border-[#E6E8EE] dark:border-slate-800 bg-[#F7F8FA]/60 dark:bg-slate-800/40 opacity-70 relative flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[#737985] dark:text-slate-300">
                      Tez orada
                    </span>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-bold text-[#17191F] dark:text-white">
                      Click
                    </h4>
                    <p className="text-xs text-[#737985] mt-0.5">
                      Karta orqali to'lov
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-[#17191F] dark:text-white">
                Buyurtma tarkibi
              </h3>

              {/* Items preview */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const name = isUz ? (item.nameUz || item.name_uz || item.name) : (item.nameRu || item.name_ru || item.name);
                  const image = item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';

                  return (
                    <div key={`${item.id}-${item.selectedColor || ''}`} className="flex items-center gap-3 text-xs">
                      <img
                        src={image}
                        alt={name}
                        className="w-12 h-12 object-contain rounded-lg bg-white dark:bg-slate-900 p-1 border border-[#E6E8EE] dark:border-slate-800 shadow-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#17191F] dark:text-white truncate">
                          {name}
                        </p>
                        <p className="text-[#737985]">
                          {item.quantity} × {formatUzbekCurrency(item.price, language)}
                        </p>
                      </div>
                      <span className="font-bold text-[#17191F] dark:text-white">
                        {formatUzbekCurrency(item.price * item.quantity, language)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#E6E8EE] dark:border-slate-800 space-y-2 text-sm">
                <div className="flex justify-between text-[#737985]">
                  <span>{t('cart.subtotal')}:</span>
                  <span className="font-semibold text-[#17191F] dark:text-white">
                    {formatUzbekCurrency(subtotal, language)}
                  </span>
                </div>

                <div className="flex justify-between text-[#737985]">
                  <span>{t('cart.delivery')}:</span>
                  <span className="font-semibold text-[#16845B]">
                    {deliveryFee === 0 ? t('cart.delivery_free') : formatUzbekCurrency(deliveryFee, language)}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#E6E8EE] dark:border-slate-700 flex justify-between items-baseline">
                  <span className="text-base font-bold text-[#17191F] dark:text-white">
                    {t('cart.total')}:
                  </span>
                  <span className="text-xl font-extrabold text-[#5B5BD6]">
                    {formatUzbekCurrency(total, language)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full justify-center mt-2 cursor-pointer"
              >
                <span>Buyurtmani tasdiqlash</span>
                <Check className="w-4 h-4 ml-2" />
              </Button>
            </Card>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-[#E6E8EE] dark:border-slate-800 text-xs text-[#737985] space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-[#17191F] dark:text-slate-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#16845B]" />
                <span>100% Xavfsiz xarid</span>
              </div>
              <p>
                Buyurtmangiz tasdiqlangandan so'ng operatorimiz siz bilan bog'lanadi.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
