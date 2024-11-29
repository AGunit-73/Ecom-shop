import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Extract filename from the URL query
    const url = new URL(request.url);
    const filename = url.searchParams.get("filename");

    // Validate filename
    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // Validate file data
    const fileData = await request.text();
    if (!fileData) {
      return NextResponse.json({ error: "File data is missing" }, { status: 400 });
    }

    // Upload the file using Vercel Blob
    const result = await put(filename, fileData, { access: "public" });

    // Return the file URL
    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
