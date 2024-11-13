import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId, productId, quantity } = await request.json();

  try {
    // Check if the item already exists in the cart for this user
    const existingItem = await sql`
      SELECT id, quantity FROM cart 
      WHERE user_id = ${userId} AND product_id = ${productId};
    `;

    let result;

    // Check if existingItem and its rowCount are defined and greater than 0
    if (existingItem?.rowCount && existingItem.rowCount > 0) {
      // Update quantity if the item already exists
      result = await sql`
        UPDATE cart
        SET quantity = quantity + ${quantity}
        WHERE user_id = ${userId} AND product_id = ${productId}
        RETURNING id, product_id as productId, quantity;
      `;
    } else {
      // Insert new row if the item does not exist
      result = await sql`
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES (${userId}, ${productId}, ${quantity})
        RETURNING id, product_id as productId, quantity;
      `;
    }

    return NextResponse.json({ success: true, cartItem: result.rows[0] });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
  }
}
