import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId, productId } = await request.json();

  try {
    // Check if the item already exists in the wishlist for this user
    const existingItem = await sql`
      SELECT id FROM wishlist 
      WHERE user_id = ${userId} AND product_id = ${productId};
    `;

    // If the item already exists, return an error
    if (existingItem?.rowCount && existingItem.rowCount > 0) {
      return NextResponse.json({
        success: false,
        message: "Item already exists in the wishlist",
      });
    }

    // Insert the new item into the wishlist
    const result = await sql`
      INSERT INTO wishlist (user_id, product_id)
      VALUES (${userId}, ${productId})
      RETURNING id, user_id AS userId, product_id AS productId;
    `;

    return NextResponse.json({
      success: true,
      wishlistItem: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding item to wishlist:", error);
    return NextResponse.json(
      { success: false, message: "Database error" },
      { status: 500 }
    );
  }
}
