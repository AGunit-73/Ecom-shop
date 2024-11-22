// Import necessary modules
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

// Load and validate the Stripe API key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
}

// Initialize Stripe without specifying an API version
const stripe = new Stripe(stripeSecretKey, {
  // No `apiVersion` here; uses the default version from Stripe Dashboard
});

// Utility function to validate the amount in the request
const validateAmount = (amount: unknown): number => {
  if (typeof amount !== "number" || amount <= 0) {
    throw new Error("Amount must be a positive number.");
  }
  return amount;
};

// Utility function to handle errors and return a response
const handleErrorResponse = (message: string, statusCode: number) =>
  NextResponse.json({ success: false, error: message }, { status: statusCode });

// Utility function to create a PaymentIntent
const createPaymentIntent = async (amount: number) => {
  try {
    return await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: "usd", // Hardcoded to USD
      automatic_payment_methods: { enabled: true }, // Enable automatic payment methods
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : null,
    });
    throw new Error("Failed to create PaymentIntent.");
  }
};

// Main API handler for POST requests
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { amount } = await request.json();

    // Validate the amount
    const validatedAmount = validateAmount(amount);

    // Create a PaymentIntent with the validated amount
    const paymentIntent = await createPaymentIntent(validatedAmount);

    // Return the client secret and PaymentIntent ID
    return NextResponse.json({
      success: true,
      message: "PaymentIntent created successfully.",
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    // Log the error details
    console.error("Stripe Payment Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : null,
    });

    // Return a user-friendly error response
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while processing the payment.";
    return handleErrorResponse(errorMessage, 500);
  }
}
