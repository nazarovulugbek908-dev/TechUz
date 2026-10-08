import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { usePhoneModel } from '../context/PhoneModelContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatUzbekCurrency } from '../utils/currency';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';

// Primitives
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Drawer } from '../components/common/Drawer';
import { Tabs, PillFilter } from '../components/common/PillFilter';
import { QuantityCounter } from '../components/common/QuantityCounter';
import { RatingStars } from '../components/common/RatingStars';
import { PhoneModelSelector } from '../components/common/PhoneModelSelector';

// Feedback
import { Alert } from '../components/feedback/Alert';
import { LoadingSpinner, SkeletonCard } from '../components/feedback/LoadingSpinner';
import { EmptyState } from '../components/feedback/EmptyState';

// Icons
import {
  ShoppingBag,
  Moon,
  Sun,
  Globe,
  Smartphone,
  Package,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Check,
  X
} from 'lucide-react';

export function ShowcasePage() {
  const { language, toggleLanguage, t, isUz } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { selectedModel, hasSelectedModel, checkCompatibility } = usePhoneModel();
  const { cartItems, totalCount, addToCart, clearCart, total } = useCart();
  const { user, isAuthenticated, login, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('primitives');
  const [counterVal, setCounterVal] = useState(1);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [lastOrderResult, setLastOrderResult] = useState(null);

  useEffect(() => {
    async function loadData() {
      const { data } = await productService.getProducts();
      setProducts(data || []);
    }
    loadData();
  }, []);

  const handleTestOrder = async () => {
    const { orderNumber, error } = await orderService.createOrder({
      customer: {
        fullName: 'Ulugbek Nazarov',
        phone: '+998 94 587-64-72',
        region: 'Fargʻona viloyati',
        cityDistrict: 'Quvasoy shahri',
        streetAddress: 'Quvasoy shahri, Markaziy ko\'cha, 1-uy'
      },
      items: products.slice(0, 2).map((p) => ({ ...p, quantity: 1 })),
      subtotal: 520000,
      deliveryFee: 0,
      total: 520000,
      paymentMethod: 'cash'
    });

    if (!error) {
      setLastOrderResult(orderNumber);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Bar */}
      <div className="bg-linear-to-r from-orange-500/10 via-amber-500/5 to-transparent p-6 sm:p-8 rounded-3xl border border-orange-200/60 dark:border-orange-950/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-[#FF7A00] text-xs font-bold shadow-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Design System & Testing Lab</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white">
              TechUz UI & Logic Verification Lab
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl">
              Inspect all primitives, integer UZS formatting, device compatibility state, and mock order/auth services.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-right shrink-0">
            <span className="text-xs text-slate-400 block font-medium">Integer Currency Formatter:</span>
            <span className="text-xl font-extrabold font-heading text-[#FF7A00]">
              {formatUzbekCurrency(3450000, language)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: 'primitives', label: '1. UI Primitives & Design System', icon: Layers },
            { id: 'compatibility', label: '2. "My Phone Model" Feature', icon: Smartphone },
            { id: 'services', label: '3. Mock Services & State', icon: ShieldCheck }
          ]}
        />
      </div>

      {/* TAB 1 */}
      {activeTab === 'primitives' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-bold font-heading mb-4 text-slate-900 dark:text-white">
              Buttons & Steppers
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Orange</Button>
              <Button variant="secondary">Secondary Black</Button>
              <Button variant="outline">Outline Border</Button>
              <Button variant="soft">Soft Tint</Button>
              <Button variant="primary" loading>Loading</Button>
              <Button variant="primary" icon={ShoppingBag}>With Icon</Button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6">
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-2">Quantity Stepper:</span>
                <QuantityCounter
                  quantity={counterVal}
                  onIncrement={() => setCounterVal((v) => v + 1)}
                  onDecrement={() => setCounterVal((v) => Math.max(1, v - 1))}
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-2">Rating Stars:</span>
                <RatingStars rating={4.9} reviewsCount={48} />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-2">Modal Dialog:</span>
                <Button variant="outline" size="sm" onClick={() => setIsDemoModalOpen(true)}>
                  Open Modal
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-base font-bold font-heading mb-3 text-slate-900 dark:text-white">
                Badges & Chips
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="sale">SALE 20%</Badge>
                <Badge variant="original">100% ORIGINAL</Badge>
                <Badge variant="new">YANGI / НОВИНКА</Badge>
                <Badge variant="premium">FLAGSHIP</Badge>
                <Badge variant="compatible">iPhone 15 Pro Mos</Badge>
                <Badge variant="success">Kafolat mavjud</Badge>
              </div>
            </Card>

            <Card>
              <h3 className="text-base font-bold font-heading mb-3 text-slate-900 dark:text-white">
                Feedback Components
              </h3>
              <div className="space-y-3">
                <Alert type="info" title="Ma'lumot">
                  Barcha smartfonlarga 1 yillik rasmiy servis kafolati taqdim etiladi.
                </Alert>
                <Alert type="success" title="Buyurtma">
                  Mahsulot muvaffaqiyatli savatga qo'shildi.
                </Alert>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2 */}
      {activeTab === 'compatibility' && (
        <div className="space-y-6">
          <PhoneModelSelector variant="banner" />

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white mb-4">
              Real-time Compatibility Match on Accessories
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products
                .filter((p) => p.category !== 'smartphones')
                .map((product) => {
                  const { isChecked, isCompatible } = checkCompatibility(product);

                  return (
                    <div
                      key={product.id}
                      className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">
                            {product.category}
                          </span>
                          {isChecked ? (
                            isCompatible ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200">
                                <Check className="w-3 h-3 stroke-[3]" /> 100% Mos
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200">
                                <X className="w-3 h-3 stroke-[3]" /> Mos emas
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] text-slate-400">Model tanlanmagan</span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                          {isUz ? product.name_uz : product.name_ru}
                        </h4>
                        <p className="text-xs text-slate-500 mb-3">
                          {isUz ? product.description_uz : product.description_ru}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="font-bold text-[#FF7A00]">
                          {formatUzbekCurrency(product.price, language)}
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => addToCart(product, 1)}
                        >
                          + Savatga
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3 */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-base font-bold font-heading mb-2 text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-[#FF7A00]" />
                Order Service Test
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Saves order in localStorage and returns UZ-XXXXXX order number.
              </p>
              <Button variant="primary" size="sm" onClick={handleTestOrder}>
                Sinov buyurtmasi yaratish
              </Button>
              {lastOrderResult && (
                <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                  Buyurtma raqami: <strong>{lastOrderResult}</strong>
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-base font-bold font-heading mb-2 text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF7A00]" />
                Auth Service Test
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Status: <strong>{isAuthenticated ? user.fullName : 'Guest'}</strong>
              </p>
              {!isAuthenticated ? (
                <Button variant="secondary" size="sm" onClick={() => login('test@techuz.uz', 'password123')}>
                  Sinov profiliga kirish
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={logout}>
                  Chiqish
                </Button>
              )}
            </Card>
          </div>
        </div>
      )}

      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Modal Namoyishi"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          TechUz modali to'liq ishchi holatda.
        </p>
        <Button variant="secondary" size="sm" onClick={() => setIsDemoModalOpen(false)}>
          Yopish
        </Button>
      </Modal>
    </div>
  );
}
