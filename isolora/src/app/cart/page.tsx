"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useUser } from "../context/usercontext";
import { useCart } from "../context/cartcontext";

interface CartItem {
  cartid: number;
  product_id: number; 
  name: string;
  price: string | number;
  quantity: number;
  image_url: string | null;
}

const CartPage = () => {
  const { user } = useUser();
  const { fetchCartCount } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Memoize fetchCartItems to avoid recreating the function on each render
  const fetchCartItems = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/cart/get-items?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        console.log("Fetched cart items:", data.cartItems);
        setCartItems(data.cartItems);
        fetchCartCount();
      } else {
        console.error("Error fetching cart items:", data.message);
      }
    } catch (error) {
      console.error("Error in fetchCartItems function:", error);
    }
  }, [user?.id, fetchCartCount]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const refreshCartItems = async () => {
    await fetchCartItems();
  };

  const handleRemove = async (product_id: number) => {
    if (!user?.id) return;

    console.log("Removing item from cart:", { userId: user.id, product_id });

    try {
      const response = await fetch(`/api/cart/delete-item?userId=${user.id}&product_id=${product_id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        if (data?.success) {
          console.log(`Item successfully removed: product_id ${product_id}`);
          await refreshCartItems();
          fetchCartCount();
        } else {
          console.error("Failed to remove item from cart:", data?.message || "Unknown error");
        }
      } else {
        console.error("Error: Received non-OK response", response.status);
      }
    } catch (error) {
      console.error("Error in handleRemove function:", error);
    }
  };

  const updateQuantity = async (product_id: number, newQuantity: number) => {
    if (newQuantity < 1 || !user?.id) return;

    try {
      const response = await fetch("/api/cart/update-quantity", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId: user.id, 
          product_id,
          quantity: newQuantity 
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log(`Quantity updated for product_id: ${product_id} to ${newQuantity}`);
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product_id === product_id ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        console.error("Error updating quantity:", data.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleBuyRequest = () => {
    alert("Processing your request—we'll be in touch soon.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length > 0 ? (
        cartItems.map((item: CartItem) => (
          <div key={item.product_id} className="flex justify-between items-center border-b border-gray-300 py-4">
            <div className="flex items-center space-x-4">
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="object-cover rounded-md"
                />
              )}
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-700">
                  Price: ${(parseFloat(item.price as string) * item.quantity).toFixed(2)}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border rounded">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleBuyRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Buy
              </button>
              <button
                onClick={() => handleRemove(item.product_id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
