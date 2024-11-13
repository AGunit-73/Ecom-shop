// /api/cart/update-quantity/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const { userId, productId, quantity } = await request.json();

  try {
    await sql`
      UPDATE cart
      SET quantity = ${quantity}
      WHERE user_id = ${userId} AND product_id = ${productId}
      RETURNING *;
    `;
    return NextResponse.json({ success: true, message: "Quantity updated" });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
  }
}
