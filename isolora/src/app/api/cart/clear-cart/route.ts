import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    // Parse JSON body to extract the userId
    const { userId } = await request.json();
    console.log("Received userId:", userId); // Log userId for debugging

    // Check if userId is provided
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    // Perform DELETE query on the database
    const result = await sql`
      DELETE FROM cart WHERE user_id = ${userId};
    `;

    // Log the result for debugging
    console.log("Cart clear result:", result);

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "Cart emptied successfully",
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error emptying the cart:", error);

    // Return an error response
    return NextResponse.json(
      { success: false, message: "Database error" },
      { status: 500 }
    );
  }
}
