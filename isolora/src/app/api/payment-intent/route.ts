// Import necessary modules
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

// Initialize Stripe with the specified API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-10-28.acacia", // Beta or experimental version
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { amount } = await request.json();

    // Validate the input
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number." },
        { status: 400 }
      );
    }

    // Create a PaymentIntent in USD
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents (e.g., $10 = 1000)
      currency: "usd", // Hardcoded to USD
      automatic_payment_methods: { enabled: true }, // Enable automatic payment methods
    });

    // Respond with the client secret and PaymentIntent ID
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Stripe Payment Error:", error);

    // Respond with an error message
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unknown error occurred while processing the payment.",
      },
      { status: 500 }
    );
  }
}
