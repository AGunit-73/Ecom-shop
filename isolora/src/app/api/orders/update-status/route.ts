import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const { orderId, status } = await request.json();

    // Validate input
    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "Order ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["Pending", "Shipped", "Delivered"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    // Check if the order exists
    const orderCheck = await sql`
      SELECT * FROM orders WHERE id = ${orderId} LIMIT 1;
    `;
    if (orderCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Update the order status
    const updateResult = await sql`
      UPDATE orders
      SET order_status = ${status}
      WHERE id = ${orderId}
      RETURNING *;
    `;

    // Return the updated order
    return NextResponse.json({
      success: true,
      message: "Order status updated",
      order: updateResult.rows[0],
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating order status:", error.message);
      return NextResponse.json(
        { success: false, message: "Failed to update order status" },
        { status: 500 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred while updating order status" },
      { status: 500 }
    );
  }
}
