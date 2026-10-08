import React from 'react';
import { ProductCard } from './ProductCard';
import { SkeletonCard } from '../feedback/LoadingSpinner';
import { EmptyState } from '../feedback/EmptyState';
import { useLanguage } from '../../context/LanguageContext';
import { PackageOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ProductGrid({
  products = [],
  loading = false,
  onQuickView,
  onResetFilters,
  className = ''
}) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5', className)}>
        {Array.from({ length: 8 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={PackageOpen}
        title={t('catalog.no_products')}
        description={t('catalog.no_products_desc')}
        actionLabel={onResetFilters ? t('catalog.clear_filters') : null}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5', className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}
