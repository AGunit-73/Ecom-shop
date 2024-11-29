import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

interface Item {
  name?: string;
  category?: string;
  description?: string;
  price?: number;
  quantity?: number;
  imageUrl?: string;
  user_id?: number;
}

export async function POST(request: Request) {
  const { name, category, description, price, quantity, imageUrl, user_id } = (await request.json()) as Item;

  // Validate required fields
  if (!name || !category || !description || !price || !quantity || !imageUrl || !user_id) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const result = await sql`
      INSERT INTO items (name, category, description, price, quantity, image_url, user_id)
      VALUES (${name}, ${category}, ${description}, ${price}, ${quantity}, ${imageUrl}, ${user_id})
      RETURNING *;
    `;
    return NextResponse.json({ success: true, item: result.rows[0] });
  } catch (error) {
    console.error("Error adding item to database:", error);
    return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
  }
}
