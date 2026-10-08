import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopAnnouncementBar } from './TopAnnouncementBar';
import { Header } from './Header';
import { CategoryNav } from './CategoryNav';
import { MobileHeader } from './MobileHeader';
import { MobileDrawer } from './MobileDrawer';
import { MobileBottomNav } from './MobileBottomNav';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { useCart } from '../../context/CartContext';
import { PhoneModelSelector } from '../common/PhoneModelSelector';

export function MainLayout() {
  const { isCartOpen, openCart, closeCart } = useCart();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isModelSelectorModalOpen, setIsModelSelectorModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Top Announcement Bar */}
      <TopAnnouncementBar />

      {/* 2. Desktop Header & Category Navigation */}
      <Header onOpenCart={openCart} />
      <CategoryNav />

      {/* 3. Mobile Header */}
      <MobileHeader
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        onOpenCart={openCart}
      />

      {/* 4. Mobile Slide-over Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* 5. Main Routed Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Mobile App-like Bottom Navigation */}
      <MobileBottomNav
        onOpenCart={openCart}
        onOpenModelSelector={() => setIsModelSelectorModalOpen(true)}
      />

      {/* 8. Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
      />

      {/* Hidden triggered model selector for mobile bottom nav */}
      {isModelSelectorModalOpen && (
        <div className="hidden">
          <PhoneModelSelector variant="badge" />
        </div>
      )}
    </div>
  );
}
