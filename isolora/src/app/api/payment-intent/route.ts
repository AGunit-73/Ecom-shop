// Import necessary modules
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

// Initialize Stripe with the specified API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-10-28.acacia", // Beta or experimental version
});

// Utility function to validate the request payload
const validateAmount = (amount: unknown): number | null => {
  if (typeof amount === "number" && amount > 0) {
    return amount;
  }
  return null;
};

// Utility function to create a payment intent
const createPaymentIntent = async (amount: number) => {
  return stripe.paymentIntents.create({
    amount, // Amount in cents (e.g., $10 = 1000)
    currency: "usd", // Hardcoded to USD
    automatic_payment_methods: { enabled: true }, // Enable automatic payment methods
  });
};

// Main API handler
export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const { amount } = await request.json();
    const validatedAmount = validateAmount(amount);

    if (!validatedAmount) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number." },
        { status: 400 }
      );
    }

    // Create a PaymentIntent
    const paymentIntent = await createPaymentIntent(validatedAmount);

    // Return the client secret and PaymentIntent ID
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    // Improved error logging
    console.error("Stripe Payment Error:", error);

    // Return a detailed error response
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "An unknown error occurred while processing the payment.",
      },
      { status: 500 }
    );
  }
}
