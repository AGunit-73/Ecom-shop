import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    console.error("No userId provided in the request.");
    return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
  }

  try {
    const cartItems = await sql`
      SELECT cart.*, items.name, items.price, items.image_url 
      FROM cart 
      JOIN items ON cart.product_id = items.itemid 
      WHERE cart.user_id = ${userId};
    `;

    console.log("Fetched Cart Items:", cartItems.rows);

    if (cartItems.rows.length === 0) {
      return NextResponse.json({ success: true, cartItems: [], message: "Cart is empty" });
    }

    return NextResponse.json({ success: true, cartItems: cartItems.rows });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
  }
}
