import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
  }

  try {
    const cartItems = await sql`
      SELECT 
        cart.*, 
        items.name, 
        items.price, 
        items.image_url, 
        items.user_id AS vendor_id -- Fetch vendor_id from items table
      FROM cart 
      JOIN items ON cart.product_id = items.itemid 
      WHERE cart.user_id = ${userId};
    `;

    // Create response and set cache-control headers
    const response = NextResponse.json({ success: true, cartItems: cartItems.rows });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");

    return response;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
  }
}
