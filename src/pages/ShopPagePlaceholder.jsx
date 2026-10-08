import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export function ShopPagePlaceholder() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const rawCategory = params.get('category');
  
  // Resolve localized category name if it matches known keys
  let categoryName = t('placeholder.all_categories_label');
  if (rawCategory === 'smartphones') categoryName = t('nav.smartphones');
  else if (rawCategory === 'cases') categoryName = t('nav.cases');
  else if (rawCategory === 'chargers') categoryName = t('nav.chargers');
  else if (rawCategory === 'headphones') categoryName = t('nav.headphones');
  else if (rawCategory === 'screen_protectors') categoryName = t('nav.screen_protectors');
  else if (rawCategory) categoryName = rawCategory;

  const query = params.get('q') || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          {t('nav.home')}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-bold">
          {t('nav.shop')}
        </span>
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#FF7A00] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black font-heading text-slate-900 dark:text-white">
          {t('placeholder.shop_title')}
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {t('placeholder.selected_category')} <strong>{categoryName}</strong>{' '}
          {query && `• ${t('placeholder.search_query')} "${query}"`}.{' '}
          {t('placeholder.shop_desc')}
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm" icon={ArrowLeft}>
              {t('placeholder.back_to_home')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AuthPagePlaceholder({ mode = 'login' }) {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <Card className="p-8 text-center space-y-4">
        <h1 className="text-2xl font-black font-heading text-slate-900 dark:text-white">
          {mode === 'login' ? t('auth.login_title') : t('auth.register_title')}
        </h1>
        <p className="text-xs text-slate-500">
          {t('placeholder.auth_desc')}
        </p>
        <Link to="/">
          <Button variant="primary" size="sm" className="w-full">
            {t('placeholder.back_to_home')}
          </Button>
        </Link>
      </Card>
    </div>
  );
}
