import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Missing userId" },
      { status: 400 }
    );
  }

  try {
    // Delete all cart items for the user
    await sql`
      DELETE FROM cart WHERE user_id = ${userId};
    `;

    return NextResponse.json({ success: true, message: "Cart emptied successfully" });
  } catch (error) {
    console.error("Error emptying the cart:", error);
    return NextResponse.json(
      { success: false, message: "Database error" },
      { status: 500 }
    );
  }
}
