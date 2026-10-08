import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Global Context Providers
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { PhoneModelProvider } from './context/PhoneModelContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import { registerServiceWorker } from './serviceWorkerRegistration';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <PhoneModelProvider>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </PhoneModelProvider>
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>
);

// Register PWA Service Worker
registerServiceWorker();
