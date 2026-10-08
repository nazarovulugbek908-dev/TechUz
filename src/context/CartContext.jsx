import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const CartContext = createContext();
const CART_STORAGE_KEY = 'techuz_cart_items';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    return storage.get(CART_STORAGE_KEY, []);
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    storage.set(CART_STORAGE_KEY, cartItems);
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedColor = null) => {
    if (!product || quantity <= 0) return;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            ...product,
            quantity,
            selectedColor: selectedColor || product.colors?.[0] || null
          }
        ];
      }
    });
  };

  const updateQuantity = (id, selectedColor, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id, selectedColor);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id && item.selectedColor === selectedColor) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id, selectedColor) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === id && item.selectedColor === selectedColor)
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Pure integer calculations
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Math.round(item.price) * item.quantity,
    0
  );
  
  // Free delivery above 500 000 UZS, otherwise 30 000 UZS
  const deliveryFee = subtotal === 0 || subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        subtotal,
        deliveryFee,
        total,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
