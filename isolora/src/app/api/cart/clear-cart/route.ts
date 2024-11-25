import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    // Extract and validate userId from the request body
    const { userId } = await request.json();
    if (!userId) {
      console.warn("userId missing in the request payload");
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    // Perform DELETE query on the cart table for the given userId
    const deleteResult = await sql`
      DELETE FROM cart WHERE user_id = ${userId};
    `;

    // Log the result for better traceability
    console.info("Cart emptied for userId:", userId, "Result:", deleteResult);

    // Respond with success
    return NextResponse.json({
      success: true,
      message: "Cart emptied successfully",
    });
  } catch (error) {
    // Enhanced error logging
    console.error("Error while emptying cart for userId:", error);

    // Respond with an error message
    return NextResponse.json(
      { success: false, message: "Failed to empty the cart" },
      { status: 500 }
    );
  }
}
