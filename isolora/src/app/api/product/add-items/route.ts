
// import { sql } from "@vercel/postgres";
// import { NextResponse } from "next/server";

// interface Item {
//   name: string;
//   category: string;
//   description: string;
//   price: number;
//   quantity: number;
//   imageUrl: string;
//   user_id: number;
// }

// export async function POST(request: Request) {
//   const { name, category, description, price, quantity, imageUrl, user_id } = (await request.json()) as Item;
//   console.log(name, category, description, price, quantity, imageUrl, user_id);

//   try {
//     const result = await sql`
//       INSERT INTO items (name, category, description, price, quantity, image_url, user_id)
//       VALUES (${name}, ${category}, ${description}, ${price}, ${quantity}, ${imageUrl}, ${user_id})
//       RETURNING *;
//     `;
//     return NextResponse.json({ success: true, item: result.rows[0] });
//   } catch (error) {
//     console.error("Error adding item to database:", error);
//     return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
//   }
// }



import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

interface Item {
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  user_id: number;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { name, category, description, price, quantity, imageUrl, user_id } = (await request.json()) as Item;

    // Validate required fields
    if (!name || !category || !price || !quantity || !imageUrl || !user_id) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Insert into the database
    const result = await sql`
      INSERT INTO items (name, category, description, price, quantity, image_url, user_id)
      VALUES (${name}, ${category}, ${description}, ${price}, ${quantity}, ${imageUrl}, ${user_id})
      RETURNING *;
    `;

    // Respond with the inserted item
    return NextResponse.json({ success: true, item: result.rows[0] });
  } catch (error) {
    // Log the error and return a database error response
    console.error("Error adding item to database:", error);
    return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
  }
}


