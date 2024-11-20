"use client";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import Link from "next/link";

const CheckoutForm = ({ totalAmount }: { totalAmount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded properly.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Please enter your card details.");
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount * 100, currency: "usd" }),
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed.");
        setProcessing(false);
      } else if (result.paymentIntent?.status === "succeeded") {
        setPaymentSuccess(true);
      }
    } catch (err) {
      setError("An error occurred during payment.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center text-green-600 p-6">
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        <p className="text-gray-700">
          Your payment of ${totalAmount} was processed successfully.
        </p>
        <p className="text-gray-500 mt-2">Thank you for your purchase!</p>
        <Link href="/">
          <span className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
            Continue Shopping
          </span>
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Payment Details</h2>
      <div className="space-y-4">
        <label className="block font-semibold text-gray-700">Select Payment Method</label>
        <div className="flex justify-around">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment-method"
              value="card"
              checked={selectedPaymentMethod === "card"}
              onChange={() => setSelectedPaymentMethod("card")}
              className="form-radio text-blue-600"
            />
            <span>Credit/Debit Card</span>
          </label>
          <label className="flex items-center space-x-2 opacity-50">
            <input
              type="radio"
              name="payment-method"
              value="paypal"
              disabled
              onChange={() => setSelectedPaymentMethod("paypal")}
              className="form-radio"
            />
            <span>PayPal</span>
          </label>
          <label className="flex items-center space-x-2 opacity-50">
            <input
              type="radio"
              name="payment-method"
              value="bank"
              disabled
              onChange={() => setSelectedPaymentMethod("bank")}
              className="form-radio"
            />
            <span>Bank Transfer</span>
          </label>
        </div>
      </div>
      <div>
        <label className="block font-semibold text-gray-700 mb-2">Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                color: "#32325d",
                fontFamily: "'Roboto', sans-serif",
                fontSize: "16px",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#fa755a" },
            },
          }}
          onChange={(event) => {
            if (event.error) {
              setError(event.error.message);
            } else {
              setError(null);
            }
          }}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 rounded-md font-bold text-white transition-transform transform ${
          processing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <div
              className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
              role="status"
            ></div>
            <span className="ml-2">Processing...</span>
          </div>
        ) : (
          `Pay $${totalAmount}`
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
