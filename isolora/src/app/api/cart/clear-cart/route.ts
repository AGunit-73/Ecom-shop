import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function DELETE(request: Request) {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get("userId");
  
      if (!userId) {
        return NextResponse.json(
          { success: false, message: "Missing userId in query parameters" },
          { status: 400 }
        );
      }
  
      // Clear the cart for the specified userId
      await sql`DELETE FROM cart WHERE user_id = ${userId}`;
  
      return NextResponse.json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      return NextResponse.json(
        { success: false, message: "Failed to clear cart. Please try again." },
        { status: 500 }
      );
    }
  }
  