import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

interface UpdateQuantityRequestBody {
  productId: number;
  quantity: number;
}
export async function PATCH(request: Request) {
    try {
      const body: UpdateQuantityRequestBody = await request.json();
  
      if (!body || typeof body.productId !== "number" || typeof body.quantity !== "number") {
        return NextResponse.json(
          { error: "Invalid product ID or quantity" },
          { status: 400 }
        );
      }
  
      const { productId, quantity } = body;
  
      if (quantity < 0) {
        return NextResponse.json({ error: "Quantity cannot be negative" }, { status: 400 });
      }
  
      const productResult = await sql`
        SELECT * FROM items WHERE itemid = ${productId};
      `;
  
      if (productResult.rowCount === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
  
      const updateResult = await sql`
        UPDATE items
        SET quantity = ${quantity}
        WHERE itemid = ${productId}
        RETURNING *;
      `;
  
      return NextResponse.json({
        success: true,
        message: "Quantity updated successfully",
        updatedProduct: updateResult.rows[0],
      });
    } catch (error) {
      console.error("Error updating product quantity:", error);
      return NextResponse.json(
        { success: false, message: "Update failed" },
        { status: 500 }
      );
    }
  }
  