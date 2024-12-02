import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId, productId, quantity } = await request.json();

  try {
    // Check if the item already exists in the cart
    const existingItem = await sql`
      SELECT id, quantity FROM cart 
      WHERE user_id = ${userId} AND product_id = ${productId};
    `;

    // Ensure existingItem is not null or undefined before accessing rowCount
    if (existingItem && existingItem.rowCount && existingItem.rowCount > 0) {
      return NextResponse.json(
        { success: false, message: "Item already in cart" },
        { status: 200 } // Keep status 200 to avoid unnecessary error handling in the frontend
      );
    }

    // Add the item to the cart if it doesn't exist
    const result = await sql`
      INSERT INTO cart (user_id, product_id, quantity)
      VALUES (${userId}, ${productId}, ${quantity})
      RETURNING id, product_id as productId, quantity;
    `;

    return NextResponse.json({
      success: true,
      message: "Item added to cart successfully",
      cartItem: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);

    // Ensure consistent response using NextResponse
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
