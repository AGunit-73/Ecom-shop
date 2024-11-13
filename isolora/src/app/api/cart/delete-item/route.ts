import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const productId = url.searchParams.get("product_id");

  console.log("Received DELETE request:", { userId, productId });

  if (!userId || !productId) {
    console.warn("User ID and Product ID are required");
    return NextResponse.json(
      { success: false, message: "User ID and Product ID are required" },
      { status: 400 }
    );
  }

  try {
    const result = await sql`
      DELETE FROM cart 
      WHERE user_id = ${userId} AND product_id = ${productId}
      RETURNING *;
    `;

    if (result.rowCount === 0) {
      console.warn("Item not found for deletion:", { userId, productId });
      return NextResponse.json({ success: false, message: "Item not found in cart" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
  }
}
