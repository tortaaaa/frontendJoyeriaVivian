// src/context/CartContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../../domain/entities/Product';
import { ProductByCode } from '../../domain/useCases/product/ProductByCode';

interface CartItem extends Product {
  quantity: number;
}

interface Notification {
  product: CartItem;
  visible: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartItemQuantity: (id: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;
  validateStock: () => void;
  updateCartInformation: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const validateStock = () => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.quantity > item.stock) {
          return { ...item, quantity: item.stock };
        }
        return item;
      })
    );
  };

  const updateCartInformation = async (): Promise<boolean> => {
    let hasChanges = false;

    const updatedCart = await Promise.all(
      cart.map(async (item) => {
        try {
          const updatedProduct = await ProductByCode(item.product_code);

          if (updatedProduct.stock !== item.stock || updatedProduct.price !== item.price) {
            hasChanges = true;
          }

          let updatedQuantity = item.quantity;

          if (updatedProduct.stock < item.quantity) {
            updatedQuantity = updatedProduct.stock;
          }

          return { ...updatedProduct, quantity: updatedQuantity };
        } catch (error) {
          console.error(`Error al actualizar el producto con código ${item.product_code}:`, error);
          return item;
        }
      })
    );

    setCart(updatedCart);
    return hasChanges;
  };

  const addToCart = (item: CartItem) => {
  setCart(prevCart => {
    const existingItemIndex = prevCart.findIndex(
      cartItem => cartItem.product_code === item.product_code
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...prevCart];
      const existingItem = updatedCart[existingItemIndex];

      const newQuantity = existingItem.quantity + item.quantity;
      const adjustedQuantity = Math.min(
        Math.max(newQuantity, 1),
        existingItem.stock
      );

      updatedCart[existingItemIndex] = {
        ...existingItem,
        quantity: adjustedQuantity,
      };

      return updatedCart;
    }

    // Producto nuevo
    const adjustedQuantity = Math.min(item.quantity, item.stock);
    return [...prevCart, { ...item, quantity: adjustedQuantity }];
  });

  // Mostrar notificación
  setNotification({ product: item, visible: true });

  setTimeout(() => {
    setNotification(null);
  }, 3000);
};
  

  const removeFromCart = (productCode) => {
    setCart(prevCart => prevCart.filter(item => item.product_code !== productCode));
  };
  const clearCart = () => {
    setCart([]);
  };

  const getCartItemQuantity = (id: string) => {
    const cartItem = cart.find(item => item.id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  useEffect(() => {
    validateStock();
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartItemQuantity, getTotalItems, getTotalPrice, notification, setNotification, validateStock, updateCartInformation }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
