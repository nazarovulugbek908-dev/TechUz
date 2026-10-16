import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AdminAuthProvider } from './context/AdminAuthContext';

// Layouts & Guards
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { CustomerProtectedRoute } from './components/auth/CustomerProtectedRoute';
import { GuestRoute } from './components/auth/GuestRoute';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShowcasePage } from './pages/ShowcasePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { AccountPage } from './pages/account/AccountPage';
import { AccountOrdersPage } from './pages/account/AccountOrdersPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminCatalogPage } from './pages/admin/AdminCatalogPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBrandsPage } from './pages/admin/AdminBrandsPage';
import { AdminPhoneModelsPage } from './pages/admin/AdminPhoneModelsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Guest Only Customer Authentication Routes */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestRoute>
                <ForgotPasswordPage />
              </GuestRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <GuestRoute>
                <ResetPasswordPage />
              </GuestRoute>
            }
          />

          {/* Protected Customer Storefront Routes (Requires Customer Authentication) */}
          <Route
            path="/"
            element={
              <CustomerProtectedRoute>
                <MainLayout />
              </CustomerProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="products" element={<ShopPage />} />
            <Route path="categories" element={<ShopPage />} />
            <Route path="search" element={<ShopPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="account/orders" element={<AccountOrdersPage />} />

            {/* Testing UI Components Showcase */}
            <Route path="showcase" element={<ShowcasePage />} />
          </Route>

          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Dashboard Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminProductFormPage />} />
            <Route path="products/:id" element={<AdminProductFormPage />} />
            <Route path="catalog" element={<AdminCatalogPage />} />
            <Route path="categories" element={<Navigate to="/admin/catalog?tab=categories" replace />} />
            <Route path="accessories" element={<Navigate to="/admin/catalog?tab=models" replace />} />
            <Route path="brands" element={<Navigate to="/admin/catalog?tab=brands" replace />} />
            <Route path="phone-models" element={<Navigate to="/admin/catalog?tab=models" replace />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<Navigate to="/admin/profile" replace />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
