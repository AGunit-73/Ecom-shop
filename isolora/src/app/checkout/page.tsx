"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/usercontext";
import { useCart } from "../context/cartcontext";
import Image from "next/image";
import Link from "next/link";

interface CartItem {
  cartid: string | number;
  name: string;
  quantity: number;
  price: number;
  image_url: string | null;
  product_id: string | number;
  vendor_id: string | number;
}

const CheckoutPage = () => {
  const { user } = useUser();
  const { clearCart } = useCart();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totals, setTotals] = useState({ subtotal: 0, salesTax: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const salesTax = subtotal * 0.1; // 10% sales tax
    return { subtotal, salesTax, total: subtotal + salesTax };
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user?.id) {
        setError("User is not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/cart/get-items?userId=${user.id}`);
        const data = await response.json();

        if (data.success && data.cartItems) {
          const items = data.cartItems.map((item: CartItem) => ({
            ...item,
            price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
          }));
          setCartItems(items);
          setTotals(calculateTotals(items));
        } else {
          setError(data.message || "Failed to fetch cart data.");
        }
      } catch {
        setError("An error occurred while fetching cart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  const handleOrderConfirmation = async () => {
    const { addressLine1, city, state, country, zipCode } = shippingAddress;

    if (!addressLine1 || !city || !state || !country || !zipCode) {
      alert("Please fill in all shipping address fields.");
      return;
    }

    setConfirmLoading(true);
    try {
      const orderDetails = cartItems.map((item) => ({
        customer_id: user?.id,
        customer_name: user?.name,
        customer_email: user?.email,
        vendor_id: item.vendor_id,
        product_id: item.product_id,
        quantity: item.quantity,
        shipping_address: `${addressLine1}, ${city}, ${state}, ${country}, ${zipCode}`,
      }));

      const response = await fetch(`/api/orders/place`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: orderDetails }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        clearCart();
        setOrderConfirmed(true);
      } else {
        alert(data.message || "An error occurred. Please try again.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setConfirmLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <Link href="/">
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold text-green-600">Order Confirmed!</h2>
        <p className="mt-4">Thank you for shopping with us! Your order is being processed.</p>
        <Link href="/pages/dashboard">
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Go to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-20 px-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-6 relative group">
        Checkout
        <div className="h-1 w-16 bg-blue-600 mx-auto mt-2 group-hover:w-32 transition-all duration-500"></div>
      </h1>

      {/* Order Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <table className="w-full border border-gray-200 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Item</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Price</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.cartid} className="border-b border-gray-200">
                <td className="p-3">
                  {item.image_url && (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  )}
                </td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">${item.price.toFixed(2)}</td>
                <td className="p-3">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Totals</h2>
        <div className="p-4 border rounded-md bg-gray-50">
          <p>Subtotal: <span className="font-bold">${totals.subtotal.toFixed(2)}</span></p>
          <p>Sales Tax (10%): <span className="font-bold">${totals.salesTax.toFixed(2)}</span></p>
          <p>Total: <span className="font-bold">${totals.total.toFixed(2)}</span></p>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <input
          type="text"
          placeholder="Address Line 1"
          className="w-full mb-2 p-3 border rounded"
          onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          className="w-full mb-2 p-3 border rounded"
          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="State"
          className="w-full mb-2 p-3 border rounded"
          onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
        />
        <input
          type="text"
          placeholder="Country"
          className="w-full mb-2 p-3 border rounded"
          onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
        />
        <input
          type="text"
          placeholder="Zip Code"
          className="w-full mb-2 p-3 border rounded"
          onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
        />
      </div>

      {/* Confirm Order Button */}
      <button
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        onClick={handleOrderConfirmation}
        disabled={confirmLoading}
      >
        {confirmLoading ? "Processing..." : "Confirm Order"}
      </button>
    </div>
  );
};

export default CheckoutPage;
