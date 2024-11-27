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
  estimatedDelivery: string;
}
// Define the structure of the cart item
const CartPage = () => {
  const { user } = useUser();
  const { fetchCartCount } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isPromoValid, setIsPromoValid] = useState(false);

  // Define a fixed sales tax
  const salesTax = 0.1;

  const validPromoCodes: { [key: string]: number } = {
    DISCOUNT10: 0.1,
    SAVE20: 0.2,
    FLASHSALE30: 0.3,
    FREESHIP50: 0.5,
  };

  const fetchCartItems = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/cart/get-items?userId=${user.id}`);
      const data = await response.json();

      if (data.success) { 
        const updatedCartItems = data.cartItems.map((item: CartItem) => ({
          ...item,
          estimatedDelivery: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
          ).toLocaleDateString(),
        }));
        setCartItems(updatedCartItems);
      } else {
        console.error("Error fetching cart items:", data.message);
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error in fetchCartItems:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const updateQuantity = async (product_id: number, newQuantity: number) => {
    if (newQuantity < 1 || !user?.id) {
      console.error("Invalid quantity or user ID");
      return;
    }
  
    try {
      const response = await fetch("/api/cart/update-quantity", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, productId: product_id, quantity: newQuantity }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Quantity updated successfully:", result);
        await fetchCartItems();
      } else {
        console.error("Failed to update quantity:", result.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  

  const handleRemove = async (product_id: number) => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `/api/cart/delete-item?userId=${user.id}&product_id=${product_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchCartItems();
        fetchCartCount();
      } else {
        console.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error in handleRemove function:", error);
    }
  };

  const applyPromoCode = () => {
    if (promoCode in validPromoCodes) {
      setDiscount(validPromoCodes[promoCode]);
      setIsPromoValid(true);
      alert(`Promo code applied! You saved ${validPromoCodes[promoCode] * 100}%`);
    } else {
      setDiscount(0);
      setIsPromoValid(false);
      alert("Invalid promo code.");
    }
  };

  const calculateSubtotal = () =>
    cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price as string) * item.quantity,
      0
    );

  const calculateDiscount = () => calculateSubtotal() * discount;

  const calculateTax = () => calculateSubtotal() * salesTax;

  const calculateTotal = () =>
    calculateSubtotal() - calculateDiscount() + calculateTax();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">
          {user?.name ? `${user.name}'s Cart` : "Your Cart"}
        </h1>
        <p className="text-gray-600">({cartItems.length} items)</p>
      </header>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-700">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mt-2">
            Add items to your cart to see them here.
          </p>
        </div>
      ) : (
        <>
          <div className="border-t border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-600">
                  <th className="py-3">Item</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Quantity</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
  {cartItems.map((item, index) => (
    <tr key={item.cartid || item.product_id || index}>
      <td className="py-4">
        <div className="flex items-center">
          {item.image_url && (
            <Image
              src={item.image_url}
              alt={item.name}
              width={50}
              height={50}
              className="rounded-md mr-4"
            />
          )}
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">
              Estimated Delivery: {item.estimatedDelivery || "N/A"}
            </p>
          </div>
        </div>
      </td>
      <td className="py-4 text-gray-700">
        ${parseFloat(item.price as string).toFixed(2)}
      </td>
      <td className="py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
            className="px-2 bg-gray-200"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
            className="px-2 bg-gray-200"
          >
            +
          </button>
        </div>
      </td>
      <td className="py-4 text-gray-700">
        ${(item.quantity * parseFloat(item.price as string)).toFixed(2)}
      </td>
      <td className="py-4">
        <button
          onClick={() => handleRemove(item.product_id)}
          className="px-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Remove
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>

          <div className="mt-6 border-t border-gray-300 pt-6">
            <div className="flex justify-between text-gray-700 mb-2">
              <p>Subtotal:</p>
              <p>${calculateSubtotal().toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <p>Sales Tax:</p>
              <p>${calculateTax().toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <p>Coupon Code:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add Coupon"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className={`border px-2 py-1 rounded ${
                    isPromoValid ? "border-green-500" : "border-gray-300"
                  }`}
                />
                <button
                  onClick={applyPromoCode}
                  className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            </div>
            <div className="flex justify-between font-bold text-gray-900 mt-4">
              <p>Grand Total:</p>
              <p>${calculateTotal().toFixed(2)}</p>
            </div>
            <button className="w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
