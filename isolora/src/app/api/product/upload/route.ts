// // src/app/api/product/upload/route.ts
// import { put } from "@vercel/blob";
// import { NextResponse } from "next/server";

// // Define the BlobResult interface
// interface BlobResult {
//   url: string;
// }

// export async function POST(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const filename = searchParams.get("filename");

//   if (!filename) {
//     return NextResponse.json({ error: "Filename is required" }, { status: 400 });
//   }

//   if (!request.body) {
//     return NextResponse.json({ error: "File data is missing" }, { status: 400 });
//   }

//   try {
//     const blob: BlobResult = await put(filename, request.body, {
//       access: "public",
//     });

//     return NextResponse.json(blob);
//   } catch (error) {
//     console.error("Failed to upload blob:", error);
//     return NextResponse.json({ error: "Blob upload failed" }, { status: 500 });
//   }
// }

// src/app/api/product/upload/route.ts
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// Define the BlobResult interface
interface BlobResult {
  url: string;
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: "File data is missing" }, { status: 400 });
  }

  try {
    const blob: BlobResult = await put(filename, request.body, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Failed to upload blob:", error);
    return NextResponse.json({ error: "Blob upload failed" }, { status: 500 });
  }
}

