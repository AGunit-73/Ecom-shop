// src/app/api/product/delete-item/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

interface DeleteRequestBody {
  itemid: number;
  imageUrl: string;
}

export async function DELETE(request: Request) {
  try {
    const { itemid, imageUrl }: DeleteRequestBody = await request.json();

    if (!itemid || !imageUrl) {
      return NextResponse.json(
        { error: "Item ID and image URL are required" },
        { status: 400 }
      );
    }

    console.log("Deleting item:", { itemid, imageUrl });

    const imagePath = new URL(imageUrl).pathname;
    await del(imagePath);

    const result = await sql`
      DELETE FROM items
      WHERE itemid = ${itemid}
      RETURNING *;
    `;

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { success: false, message: "Deletion failed" },
      { status: 500 }
    );
  }
}
