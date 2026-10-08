import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'techuz_theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return storage.get(THEME_STORAGE_KEY, 'light');
  });

  const isDark = theme === 'dark' || theme === 'techuz-dark';

  useEffect(() => {
    storage.set(THEME_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, isDark]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' || prev === 'techuz-dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
