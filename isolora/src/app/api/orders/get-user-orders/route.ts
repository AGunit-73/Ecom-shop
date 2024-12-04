import { sql } from "@vercel/postgres";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId");

  // Validate `customerId`
  if (!customerId || isNaN(Number(customerId))) {
    return new Response(
      JSON.stringify({ success: false, message: "Valid Customer ID is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Query to fetch orders placed by the customer
    const result = await sql`
      SELECT o.*, i.name AS product_name, i.image_url, i.price
      FROM orders o
      INNER JOIN items i ON o.product_id = i.itemid
      WHERE o.customer_id = ${customerId}
      ORDER BY o.created_at DESC;
    `;

    // Check if orders exist
    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No orders found", orders: [] }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, orders: result.rows }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching user orders:", error);

    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch user orders" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
