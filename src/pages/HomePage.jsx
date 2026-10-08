import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategoryPillsBar } from '../components/home/CategoryPillsBar';
import { PromoBentoGrid } from '../components/home/PromoBentoGrid';
import { DealsSection } from '../components/home/DealsSection';
import { ProductCarouselSection } from '../components/home/ProductCarouselSection';
import { BenefitsSection } from '../components/home/BenefitsSection';
import { AboutSection } from '../components/home/AboutSection';
import { InfoTilesSection } from '../components/home/InfoTilesSection';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { QuickViewModal } from '../components/product/QuickViewModal';

export function HomePage() {
  const { t } = useLanguage();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Fast Category Selector Pills */}
      <CategoryPillsBar />

      {/* 3. Promo Bento Grid */}
      <PromoBentoGrid />

      {/* 4. Deals / Chegirmalar Section (No countdown timer) */}
      <DealsSection onQuickView={(p) => setQuickViewProduct(p)} />

      {/* 5. Accessories Section with Pill Tabs */}
      <ProductCarouselSection
        title={t('home.accessories_title')}
        subtitle={t('home.hero_subtitle')}
        category="cases"
        showTabs={true}
        viewAllLink="/shop?category=cases"
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 6. Smartphones Section */}
      <ProductCarouselSection
        title={t('home.smartphones_title')}
        subtitle={t('home.smartphones_subtitle')}
        category="smartphones"
        showTabs={false}
        viewAllLink="/shop?category=smartphones"
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 7. Value Propositions / Benefits Bar */}
      <BenefitsSection />

      {/* 8. About TechUz Information Block */}
      <AboutSection />

      {/* 9. Blog & Help Center Tiles */}
      <InfoTilesSection />

      {/* 10. Newsletter & Telegram Strip */}
      <NewsletterSection />

      {/* Global Quick View Modal */}
      <QuickViewModal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </div>
  );
}
