import { GET } from "@/app/api/product/get-items/route";
import { mockSql } from "@/app/__mock__/postgres"; // Mock implementation of sql

// Mock NextResponse from next/server
jest.mock("next/server", () => ({
  ...jest.requireActual("next/server"),
  NextResponse: {
    json: jest.fn((data: any, init?: { status?: number }) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

// Mock sql
jest.mock("@vercel/postgres");

describe("GET /api/item/list", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should fetch items successfully", async () => {
    const mockItems = [{ itemid: 1, name: "Test Item", price: 100 }];

    // Mock the sql function to return the mock items
    mockSql.select.mockResolvedValueOnce({ rows: mockItems });

    // Call the GET function
    const response = await GET();

    // Parse the response
    const responseBody = await response.json();

    // Validate that sql was called with the expected query
    expect(mockSql.select).toHaveBeenCalledTimes(1);
    expect(mockSql.select).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM items"),
      [] // No parameters for this query
    );

    // Validate the response
    expect(response.status).toBe(200);
    expect(responseBody.items).toEqual(mockItems);
  });

  it("should handle database errors", async () => {
    // Mock the sql function to throw an error
    mockSql.select.mockRejectedValueOnce(new Error("Database error"));

    // Call the GET function
    const response = await GET();

    // Parse the response
    const responseBody = await response.json();

    // Validate that sql was called
    expect(mockSql.select).toHaveBeenCalledTimes(1);

    // Validate the response
    expect(response.status).toBe(500);
    expect(responseBody).toEqual({ error: "Error fetching items" });
  });
});
