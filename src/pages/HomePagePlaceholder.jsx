import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePhoneModel } from '../context/PhoneModelContext';
import { productService } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { PhoneModelSelector } from '../components/common/PhoneModelSelector';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import {
  Smartphone,
  Shield,
  Zap,
  Headphones,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';

export function HomePagePlaceholder() {
  const { t } = useLanguage();
  const { selectedModel, hasSelectedModel, selectedModelId } = usePhoneModel();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const { data } = await productService.getProducts({
        phoneModel: selectedModelId,
        limit: 8
      });
      setProducts(data || []);
      setLoading(false);
    }
    loadProducts();
  }, [selectedModelId]);

  const quickCategories = [
    { title: t('nav.smartphones'), desc: 'Apple, Samsung, Xiaomi', icon: Smartphone, to: '/shop?category=smartphones' },
    { title: t('nav.cases'), desc: 'MagSafe, silikon va zarbaga chidamli', icon: Shield, to: '/shop?category=cases' },
    { title: t('nav.chargers'), desc: 'GaN tezkor quvvatlagichlar', icon: Zap, to: '/shop?category=chargers' },
    { title: t('nav.headphones'), desc: 'Simsiz TWS quloqchinlar', icon: Headphones, to: '/shop?category=headphones' }
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Promo Section */}
      <section className="bg-linear-to-b from-slate-100/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 py-8 sm:py-14 lg:py-16 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF7A00] text-xs font-extrabold shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('home.badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                {t('home.hero_title_part1')}{' '}
                <span className="text-[#FF7A00]">{t('home.hero_title_accent')}</span>{' '}
                {t('home.hero_title_part2')}.
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                {t('home.hero_subtitle')}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/shop">
                  <Button variant="primary" size="lg" icon={ShoppingBag}>
                    {t('home.shop_now')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Phone Model Selector Widget Card */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF7A00] text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                      {t('home.compatibility_widget_title')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t('home.compatibility_widget_desc')}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                  <span className="text-xs text-slate-400 block mb-1">
                    {t('home.selected_model_label')}
                  </span>
                  <div className="flex items-center justify-between">
                    <strong className="text-sm text-slate-900 dark:text-white truncate">
                      {hasSelectedModel ? selectedModel.name : t('home.model_not_selected')}
                    </strong>
                    {hasSelectedModel && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md shrink-0 ml-2">
                        <CheckCircle2 className="w-3 h-3" /> {t('home.saved_badge')}
                      </span>
                    )}
                  </div>
                </div>

                <PhoneModelSelector variant="banner" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Product Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading text-slate-900 dark:text-white">
              {t('home.popular_categories')}
            </h2>
            {hasSelectedModel && (
              <p className="text-xs text-[#FF7A00] font-bold mt-1">
                {t('phone_model.showing_compatible_for')} {selectedModel.name}
              </p>
            )}
          </div>

          <Link to="/shop" className="text-xs sm:text-sm font-bold text-[#FF7A00] hover:underline flex items-center gap-1 shrink-0">
            {t('home.view_all')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      </section>

      {/* 3. Quick Category Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.title} to={cat.to} className="group">
                <Card hoverEffect className="h-full flex flex-col justify-between p-5">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#FF7A00] group-hover:bg-[#FF7A00] group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500">{cat.desc}</p>
                  </div>

                  <div className="flex items-center text-xs font-bold text-[#FF7A00] mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span>{t('home.category_products')}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </div>
  );
}
