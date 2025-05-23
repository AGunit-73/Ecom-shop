"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useUser } from "../context/usercontext";
import { useCart } from "../context/cartcontext";
import { useRouter } from "next/navigation";

interface CartItem {
  cartid: string | number;
  product_id: number;
  name: string;
  price: string | number;
  quantity: number;
  image_url: string | null;
  estimatedDelivery: string;
}

const CartPage = () => {
  const { user } = useUser();
  const { fetchCartCount } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // const salesTax = 0.1;

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
        setCartItems([]);
        console.error("Error fetching cart items:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: product_id, quantity: newQuantity }),
      });

      if (response.ok) {
        await fetchCartItems();
      } else {
        console.error("Failed to update quantity");
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
        { method: "DELETE" }
      );

      if (response.ok) {
        await fetchCartItems();
        fetchCartCount();
      } else {
        console.error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + parseFloat(item.price as string) * item.quantity, 0);



  

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (loading) return <div className="mt-20 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto mt-20">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">
          {user?.name ? `${user.name}'s Cart` : "Your Cart"}
        </h1>
        <p className="text-gray-600">({cartItems.length} items)</p>
      </header>

      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <Image
            src="/cart-icon.png"
            alt="Empty Cart"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
          <p className="text-gray-500 mt-2">Add items to your cart to see them here.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
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
                  <tr key={item.cartid || index}>
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
                          className="px-2 bg-red-600 hover:bg-red-900 rounded text-red"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="px-2 bg-green-600 hover:bg-green-900 rounded text-green"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-blue-700">
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
            <div className="flex justify-between font-bold text-blue-500 mt-4">
              <p>Grand Total:</p>
              <p>${calculateTotal().toFixed(2)}</p>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
