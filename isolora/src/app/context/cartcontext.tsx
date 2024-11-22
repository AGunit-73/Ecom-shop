"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useUser } from "./usercontext";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  addItemToCart: (productId: number, quantity?: number) => void;
  fetchCartItems: () => void;
  fetchCartCount: () => void;
  clearCart: () => void; // Add clearCart to context
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const userId = user?.id;
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fetch cart items from API
  const fetchCartItems = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/cart/get-items?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setCartItems(data.cartItems);
      } else {
        console.error("Failed to fetch cart items:", data.message);
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  }, [userId]);

  // Fetch cart count from API
  const fetchCartCount = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/cart/get-items?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setCartCount(data.cartItems.length);
      } else {
        console.error("Failed to fetch cart count:", data.message);
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  }, [userId]);

  // Add item to cart
  const addItemToCart = async (productId: number, quantity: number = 1) => {
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }
    try {
      const existingItem = cartItems.find((item) => item.productId === productId);

      if (existingItem) {
        const increaseQuantity = confirm(
          "This item is already in your cart. Do you want to increase the quantity?"
        );

        if (increaseQuantity) {
          const updatedQuantity = existingItem.quantity + quantity;

          const response = await fetch("/api/cart/update-quantity", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId, quantity: updatedQuantity }),
          });

          const updateData = await response.json();

          if (response.ok) {
            setCartItems((prevItems) =>
              prevItems.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: updatedQuantity }
                  : item
              )
            );
            setCartCount((prevCount) => prevCount + quantity);
            alert("Item quantity updated successfully!");
          } else {
            console.error("Failed to update item quantity:", updateData.message);
            alert(updateData.message || "Failed to update item quantity.");
          }
        }
      } else {
        const response = await fetch("/api/cart/add-item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, productId, quantity }),
        });

        const data = await response.json();

        if (response.ok) {
          setCartItems((prevItems) => [
            ...prevItems,
            { id: Date.now(), productId, quantity },
          ]);
          setCartCount((prevCount) => prevCount + quantity);
          alert("Item added to your cart successfully!");
        } else {
          console.error("Failed to add item to cart:", data.message);
          alert(data.message || "Failed to add item to cart.");
        }
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("An unexpected error occurred while adding the item to your cart.");
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!userId) {
      alert("Please log in to clear your cart.");
      return;
    }

    try {
      const response = await fetch(`/api/cart/clear-cart?userId=${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setCartItems([]);
        setCartCount(0);
        console.log("Cart cleared successfully!");
      } else {
        console.error("Failed to clear cart:", data.message);
        alert(data.message || "Failed to clear cart.");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("An unexpected error occurred while clearing the cart.");
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchCartCount();
  }, [fetchCartItems, fetchCartCount]);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartItems,
        addItemToCart,
        fetchCartItems,
        fetchCartCount,
        clearCart, // Provide clearCart
      }}
    >
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
