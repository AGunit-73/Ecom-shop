import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId, productId, quantity } = await request.json();

  try {
    const result = await sql`
      INSERT INTO cart (user_id, product_id, quantity)
      VALUES (${userId}, ${productId}, ${quantity})
      RETURNING id, product_id as productId;
    `;

    return NextResponse.json({ success: true, cartItem: result.rows[0] });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
  }
}
