"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useEffect, useState } from "react";
import { useUser } from "../context/usercontext";
import Link from "next/link";
import Image from "next/image";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const CheckoutPage = () => {
  const { user } = useUser();
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<
    { name: string; price: number; quantity: number; image_url: string | null }[]
  >([]);
  const [paymentSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      console.log("User not available");
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchCartTotal = async () => {
      try {
        const response = await fetch(`/api/cart/get-items?userId=${user.id}`);
        const data = await response.json();

        if (data.success) {
          if (data.cartItems.length === 0) {
            setError("Your cart is empty. Please add items to continue.");
          } else {
            const formattedCartItems = data.cartItems.map(
              (item: { price: string; quantity: number; name: string; image_url: string }) => ({
                ...item,
                price: Number(item.price),
              })
            );
            setCartItems(formattedCartItems);

            const subtotal = formattedCartItems.reduce(
              (sum: number, item: { price: number; quantity: number }) =>
                sum + item.price * item.quantity,
              0
            );

            const salesTax = subtotal * 0.1; // 10% sales tax
            setTotalAmount(subtotal + salesTax);
          }
        } else {
          setError(data.message || "Failed to fetch cart data.");
        }
      } catch (err) {
        console.error("Error fetching cart total:", err);
        setError("An error occurred while fetching cart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartTotal();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-blue-100">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  if (error || totalAmount === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-blue-100">
        <p className="text-red-500">
          {error || "Your cart appears to be empty. Please add items to continue."}
        </p>
        <Link href="/">
          <span className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            Continue Shopping
          </span>
        </Link>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-blue-100">
        <h2 className="text-xl font-bold text-green-600">Payment Successful!</h2>
        <p className="text-gray-700 mt-4">
          Thank you for your purchase! Your order will be processed soon.
        </p>
        <Link href="/">
          <span className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
            Continue Shopping
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100 flex items-center justify-center">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 relative group">
            <span className="inline-block">
              <span className="text-blue-600 group-hover:text-blue-400 transition-colors duration-300">
                Checkout
              </span>
            </span>
            <div className="w-0 h-1 bg-blue-600 mt-2 mx-auto group-hover:w-full transition-all duration-500"></div>
          </h1>
          <p className="text-gray-500">Review your order and complete your purchase.</p>
        </header>

        <section className="bg-gray-50 p-6 rounded-lg border mb-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Order Summary</h2>
          <ul className="text-gray-600 mt-4 space-y-3">
            {cartItems.map((item) => (
              <li key={item.name} className="flex justify-between items-center py-2 border-b">
                <span className="flex items-center space-x-3">
                  <Image
                    src={item.image_url || "/default-image.jpg"}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-lg border"
                  />
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </span>
                <span className="text-gray-600">
                  ${item.price.toFixed(2)} x {item.quantity}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="flex justify-between text-gray-700 font-medium">
              <span>Subtotal Before Tax:</span>
              <span>
                $
                {cartItems
                  .reduce((subtotal, item) => subtotal + item.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </p>
            <p className="flex justify-between text-gray-700 font-medium">
              <span>Sales Tax (10%):</span>
              <span>${(totalAmount * 0.1).toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-bold text-gray-800 text-xl">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </p>
          </div>
        </section>

        <Elements stripe={stripePromise}>
          <CheckoutForm totalAmount={totalAmount} />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutPage;
