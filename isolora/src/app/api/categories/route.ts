import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// Handle GET request: fetch categories
export async function GET() {
  try {
    const result = await sql`SELECT name FROM categories ORDER BY name ASC`;
    return NextResponse.json({ categories: result.rows });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// ✅ Handle POST request: insert new category
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO categories (name)
      VALUES (${name})
      RETURNING id, name;
    `;

    return NextResponse.json({ success: true, category: result.rows[0] });
  } catch (error) {
    console.error("Error inserting category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add category" },
      { status: 500 }
    );
  }
}
