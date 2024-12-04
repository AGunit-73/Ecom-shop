import { sql } from "@vercel/postgres";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const vendorId = url.searchParams.get("vendorId");

  // Validate `vendorId`
  if (!vendorId || isNaN(Number(vendorId))) {
    return new Response(
      JSON.stringify({ success: false, message: "Valid Vendor ID is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Validate if the user is a vendor
    const vendorCheck = await sql`
      SELECT role FROM users WHERE id = ${vendorId} LIMIT 1;
    `;

    if (!vendorCheck.rows.length) {
      return new Response(
        JSON.stringify({ success: false, message: "Vendor not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (vendorCheck.rows[0].role !== "vendor") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User is not authorized as a vendor",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Query to fetch orders received by the vendor
    const result = await sql`
      SELECT 
        o.*, 
        i.name AS product_name, 
        i.image_url, 
        i.price, 
        o.customer_name, 
        o.customer_email
      FROM 
        orders o
      INNER JOIN 
        items i 
      ON 
        o.product_id = i.itemid
      WHERE 
        o.vendor_id = ${vendorId}
      ORDER BY 
        o.created_at DESC;
    `;

    // Check if orders exist
    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No orders found",
          orders: [],
        }),
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
    if (error instanceof Error) {
      console.error("Error fetching vendor orders:", error.message);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to fetch vendor orders",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
