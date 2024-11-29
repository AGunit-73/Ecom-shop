import { POST } from "@/app/api/product/add-items/route";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// Mock SQL function
jest.mock("@vercel/postgres", () => ({
  sql: jest.fn(), // Create a Jest mock for sql
}));

// Mock NextResponse
jest.mock("next/server", () => ({
  ...jest.requireActual("next/server"),
  NextResponse: {
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      body: data,
    })),
  },
}));

describe("POST /api/product/add-items", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle database errors", async () => {
    const mockItem = {
      name: "Test Item",
      category: "Test Category",
      description: "Test Description",
      price: 100,
      quantity: 10,
      imageUrl: "http://example.com/test.jpg",
      user_id: 1,
    };

    // Mocking the SQL function to throw an error
    (sql as unknown as jest.Mock).mockRejectedValue(new Error("Database error"));

    const request = {
      json: jest.fn().mockResolvedValue(mockItem),
    } as unknown as Request;

    const response = await POST(request);

    // Assert that NextResponse.json was called with the appropriate error
    expect(NextResponse.json).toHaveBeenCalledWith(
      { success: false, message: "Database error" },
      { status: 500 }
    );
    expect(response.status).toBe(500);
  });
});
