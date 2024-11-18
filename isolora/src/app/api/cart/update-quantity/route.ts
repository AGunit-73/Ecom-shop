import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    // Parse the JSON body from the request
    const { userId, productId, quantity } = await request.json();

    // Log incoming data for debugging
    console.log("PATCH request received with:", { userId, productId, quantity });

    // Validate the input data
    if (
      !userId || 
      typeof userId !== "number" ||
      !productId || 
      typeof productId !== "number" || 
      typeof quantity !== "number" || 
      quantity <= 0
    ) {
      console.error("Invalid input data:", { userId, productId, quantity });
      return NextResponse.json(
        { success: false, message: "Invalid input data" },
        { status: 400 }
      );
    }

    // Check if the item exists in the cart
    const existingItem = await sql`
      SELECT * FROM cart
      WHERE user_id = ${userId} AND product_id = ${productId}
    `;

    if (existingItem.rowCount === 0) {
      console.error("Item not found in cart:", { userId, productId });
      return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Update the quantity in the database
    const result = await sql`
      UPDATE cart
      SET quantity = ${quantity}
      WHERE user_id = ${userId} AND product_id = ${productId}
      RETURNING *;
    `;

    // Log the result for debugging
    console.log("Updated item:", result.rows);

    // Check if the row was updated
    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to update item quantity" },
        { status: 500 }
      );
    }

    // Return success response with the updated item
    return NextResponse.json({
      success: true,
      message: "Quantity updated successfully",
      updatedItem: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating quantity:", error);

    // Return a server error response
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 }
    );
  }
}
