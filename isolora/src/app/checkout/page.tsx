"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useState } from "react";
import { useUser } from "../context/usercontext";

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

  // useEffect(() => {
  //   if (!user) {
  //     console.log("User not available");
  //     setError("User not logged in.");
  //     setLoading(false);
  //     return;
  //   }

  //   const fetchCartTotal = async () => {
  //     try {
  //       const response = await fetch(`/api/cart/get-items?userId=${user.id}`);
  //       const data = await response.json();

  //       if (data.success) {
  //         if (data.cartItems.length === 0) {
  //           setError("Your cart is empty. Please add items to continue.");
  //         } else {
  //           const formattedCartItems = data.cartItems.map(
  //             (item: { price: string; quantity: number; name: string; image_url: string }) => ({
  //               ...item,
  //               price: Number(item.price),
  //             })
  //           );
  //           setCartItems(formattedCartItems);

  //           const subtotal = formattedCartItems.reduce(
  //             (sum: number, item: { price: number; quantity: number }) =>
  //               sum + item.price * item.quantity,
  //             0
  //           );

  //           const salesTax = subtotal * 0.1; // 10% sales tax
  //           setTotalAmount(subtotal + salesTax);
  //         }
  //       } else {
  //         setError(data.message || "Failed to fetch cart data.");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching cart total:", err);
  //       setError("An error occurred while fetching cart data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCartTotal();
  // }, [user]);

  // if (loading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-blue-100">
  //       <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
  //       <p className="mt-2 text-gray-600">Loading your cart...</p>
  //     </div>
  //   );
  // }

  // if (error || totalAmount === null) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-blue-100">
  //       <p className="text-red-500">
  //         {error || "Your cart appears to be empty. Please add items to continue."}
  //       </p>
  //       <a
  //         href="/"
  //         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  //       >
  //         Continue Shopping
  //       </a>
  //     </div>
  //   );
  // }

  // <Elements stripe={stripePromise}>
  //   <CheckoutForm totalAmount={totalAmount} />
  // </Elements>

  return <div>Checkout Page Placeholder</div>;
};

export default CheckoutPage;
