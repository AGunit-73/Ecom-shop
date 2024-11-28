import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { orders } = await request.json();

    // Validate orders input
    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { success: false, message: "No orders to place." },
        { status: 400 }
      );
    }

    // Prepare arrays for UNNEST, including customer details
    const customerIds = orders.map((order: { customer_id: number }) => order.customer_id);
    const vendorIds = orders.map((order: { vendor_id: number }) => order.vendor_id);
    const productIds = orders.map((order: { product_id: number }) => order.product_id);
    const quantities = orders.map((order: { quantity: number }) => order.quantity);
    const shippingAddresses = orders.map((order: { shipping_address: string }) => order.shipping_address);
    const customerNames = orders.map((order: { customer_name: string }) => order.customer_name);
    const customerEmails = orders.map((order: { customer_email: string }) => order.customer_email);

    // Update the SQL query to include customer_name and customer_email
    const query = `
      INSERT INTO orders (
        customer_id, vendor_id, product_id, quantity, shipping_address, customer_name, customer_email
      )
      SELECT * FROM UNNEST(
        $1::int[], $2::int[], $3::int[], $4::int[], $5::text[], $6::text[], $7::text[]
      )
      RETURNING *;
    `;
    const result = await sql.query(query, [
      customerIds,
      vendorIds,
      productIds,
      quantities,
      shippingAddresses,
      customerNames,
      customerEmails,
    ]);

    // Return success response
    return NextResponse.json({ success: true, orders: result.rows });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error placing orders:", error.message);
      return NextResponse.json(
        { success: false, message: "Failed to place orders. Please try again later." },
        { status: 500 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred while placing orders." },
      { status: 500 }
    );
  }
}
