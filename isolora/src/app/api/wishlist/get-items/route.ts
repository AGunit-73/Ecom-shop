import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch wishlist items with associated product details
    const result = await sql`
      SELECT 
        wishlist.product_id AS productId, 
        items.name, 
        items.price, 
        items.image_url 
      FROM wishlist 
      JOIN items 
        ON wishlist.product_id = items.itemid
      WHERE wishlist.user_id = ${userId};
    `;

    return NextResponse.json({
      success: true,
      wishlist: result.rows, // Returns an array of items in the wishlist
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { success: false, message: "Database error" },
      { status: 500 }
    );
  }
}
