import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const FavoritesContext = createContext();
const FAVORITES_STORAGE_KEY = 'techuz_favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    return storage.get(FAVORITES_STORAGE_KEY, []);
  });

  useEffect(() => {
    storage.set(FAVORITES_STORAGE_KEY, favorites);
  }, [favorites]);

  const toggleFavorite = (product) => {
    if (!product || !product.id) return;
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isFavorite = (productId) => {
    return favorites.some((item) => item.id === productId);
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        isFavorite,
        toggleFavorite,
        removeFromFavorites,
        clearFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
