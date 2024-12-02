import { DELETE } from "@/app/api/cart/delete-item/route";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { Mocked } from "jest-mock";

jest.mock("@vercel/postgres");

const mockedSql = sql as jest.Mocked<typeof sql>;

// Mocking dependencies
jest.mock("@vercel/postgres", () => ({
  sql: jest.fn() as jest.Mock,
}));



jest.mock("next/server", () => ({
  ...jest.requireActual("next/server"),
  NextResponse: {
    json: jest.fn((data: any, init?: { status?: number }) => ({
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

describe("DELETE /api/cart/delete-item", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks between tests
  });

  it("should return 400 if userId or productId is missing", async () => {
    const mockRequest = new Request("https://example.com/api/cart/delete-item");

    const response = await DELETE(mockRequest as any);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse).toEqual({
      success: false,
      message: "User ID and Product ID are required",
    });
  });

  it("should return 404 if the item is not found in the cart", async () => {
    const mockRequest = new Request(
      "https://example.com/api/cart/delete-item?userId=123&productId=456"
    );

    // Mocking SQL query to return no rows found
    (sql as unknown as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });

    const response = await DELETE(mockRequest as any);
    const jsonResponse = await response.json();

    expect(response.status).toBe(404);
    expect(jsonResponse).toEqual({
      success: false,
      message: "Item not found in cart",
    });
  });

  it("should return 200 if the item is successfully removed from the cart", async () => {
    const mockRequest = new Request(
      "https://example.com/api/cart/delete-item?userId=123&productId=456"
    );

    // Mocking SQL query to simulate successful deletion
    (sql as unknown as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });

    const response = await DELETE(mockRequest as any);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse).toEqual({
      success: true,
      message: "Item removed from cart",
    });
  });

  it("should return 500 if there is a database error", async () => {
    const mockRequest = new Request(
      "https://example.com/api/cart/delete-item?userId=123&productId=456"
    );

    // Mocking SQL query to simulate a database error
    (sql as unknown as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

    const response = await DELETE(mockRequest as any);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse).toEqual({
      success: false,
      message: "Database error",
    });
  });
});

