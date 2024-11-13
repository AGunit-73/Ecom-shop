"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useUser } from "./usercontext";

interface CartContextType {
  cartCount: number;
  addItemToCart: (productId: number) => void;
  fetchCartCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const userId = user?.id;
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/cart/get-items?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setCartCount(data.cartItems.length);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  }, [userId]);

  const addItemToCart = async (productId: number) => {
    if (!userId) return;
    try {
      await fetch("/api/cart/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity: 1 }),
      });
      fetchCartCount();
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, addItemToCart, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
