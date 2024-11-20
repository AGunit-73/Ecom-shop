"use client";

import { CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = ({ totalAmount }: { totalAmount: number }) => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Simulating a placeholder for payment submission logic
    setProcessing(true);

    try {
      // Placeholder for payment logic
      console.log("Processing payment for:", totalAmount);
    } catch (err) {
      setError("An error occurred during payment.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Payment Details
      </h2>
      <div className="space-y-4">
        <label className="block font-semibold text-gray-700">
          Select Payment Method
        </label>
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
        <label className="block font-semibold text-gray-700 mb-2">
          Card Details
        </label>
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
        disabled={processing}
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
