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

  // Helper function to calculate totals
  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const salesTax = subtotal * 0.1; // 10% sales tax
    return { subtotal, salesTax, total: subtotal + salesTax };
  };

  // Fetch cart items and calculate totals
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
          if (data.cartItems.length === 0) {
            setError("Your cart is empty. Please add items to continue.");
          } else {
            const items = data.cartItems.map((item: CartItem) => ({
              ...item,
              price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
            }));
            setCartItems(items);
            setTotals(calculateTotals(items));
          }
        } else {
          setError(data.message || "Failed to fetch cart data.");
        }
      } catch (fetchError) {
        console.error("Error fetching cart data:", fetchError);
        setError("An error occurred while fetching cart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  // Handle order confirmation
  const handleOrderConfirmation = async () => {
    const { addressLine1, city, state, country, zipCode } = shippingAddress;

    // Validate shipping address
    if (!addressLine1 || !city || !state || !country || !zipCode) {
      alert("Please fill in all shipping address fields.");
      return;
    }

    if (!user?.id || !user?.name || !user?.email) {
      alert("User data is incomplete. Please log in again.");
      return;
    }

    setConfirmLoading(true);
    try {
      const orderDetails = cartItems.map((item) => ({
        customer_id: user.id,
        customer_name: user.name,
        customer_email: user.email,
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
        console.error("Order Placement Error:", data.message);
        alert(data.message || "An error occurred. Please try again.");
      }
    } catch (confirmationError) {
      console.error("Error during order confirmation:", confirmationError);
      alert("An error occurred. Please try again.");
    } finally {
      setConfirmLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-blue-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-blue-100">
        <h2 className="text-xl font-bold text-green-600">Order Confirmed!</h2>
        <p className="text-gray-700 mt-4">Thank you for shopping with us! Your order is being processed.</p>
        <Link href="/pages/dashboard">
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Go to Dashboard
          </button>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-blue-100">
        <p className="text-red-500">{error}</p>
        <Link href="/">
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Checkout</h1>

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

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Totals</h2>
        <div className="p-4 border rounded-md bg-gray-50">
          <p className="text-gray-700">
            Subtotal: <span className="font-bold">${totals.subtotal.toFixed(2)}</span>
          </p>
          <p className="text-gray-700">
            Sales Tax (10%): <span className="font-bold">${totals.salesTax.toFixed(2)}</span>
          </p>
          <p className="text-gray-700">
            Total: <span className="font-bold">${totals.total.toFixed(2)}</span>
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Address Line 1"
            value={shippingAddress.addressLine1}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })
            }
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="City"
            value={shippingAddress.city}
            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="State"
            value={shippingAddress.state}
            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Country"
            value={shippingAddress.country}
            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Zip Code"
            value={shippingAddress.zipCode}
            onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <button
        onClick={handleOrderConfirmation}
        className={`w-full py-2 px-4 text-white rounded ${
          confirmLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
        disabled={confirmLoading}
      >
        {confirmLoading ? "Processing..." : "Confirm Order"}
      </button>
    </div>
  );
};

export default CheckoutPage;
