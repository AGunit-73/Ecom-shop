import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-10-28.acacia", // Beta or experimental version
});

export async function POST(request: NextRequest) {
  try {
    // Comment out the implementation
    // const { amount } = await request.json();

    // if (!amount || typeof amount !== "number" || amount <= 0) {
    //   return NextResponse.json(
    //     { error: "Invalid amount. Must be a positive number." },
    //     { status: 400 }
    //   );
    // }

    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount,
    //   currency: "usd",
    //   automatic_payment_methods: { enabled: true },
    // });

    // return NextResponse.json({
    //   clientSecret: paymentIntent.client_secret,
    //   paymentIntentId: paymentIntent.id,
    // });

    // Temporary response for testing failure
    return NextResponse.json(
      { error: "Not Implemented Yet" },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error handling not implemented" },
      { status: 500 }
    );
  }
}
