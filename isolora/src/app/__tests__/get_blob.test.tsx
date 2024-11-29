import { GET } from "@/app/api/product/get-items/route";
import { mockSql } from "@/app/__mock__/postgres"; // Import the mockSql for assertions

// Mock dependencies
jest.mock("@vercel/postgres"); // Mock the postgres module
jest.mock("next/server", () => ({
  ...jest.requireActual("next/server"),
  NextResponse: {
    json: jest.fn((data: any, init?: { status?: number }) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

describe("GET /api/product/get-items", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("should return a list of items", async () => {
    const mockItems = [
      { itemid: 1, name: "Test Item", price: 100 },
      { itemid: 2, name: "Another Item", price: 200 },
    ];

    // Mock SQL select response
    mockSql.select.mockResolvedValueOnce({ rows: mockItems });

    // Call the GET function
    const response = await GET();

    // Read the response body
    const responseBody = await response.json();

    // Validate SQL query execution
    expect(mockSql.select).toHaveBeenCalledTimes(1);
    expect(mockSql.select).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM items"),
      [] // No parameters for this query
    );

    // Validate response
    expect(response.status).toBe(200);
    expect(responseBody.items).toEqual(mockItems);
  });

  it("should handle database errors", async () => {
    // Mock SQL rejection to simulate a database error
    mockSql.select.mockRejectedValueOnce(new Error("Database error"));

    // Call the GET function
    const response = await GET();

    // Read the response body
    const responseBody = await response.json();

    // Validate SQL query execution
    expect(mockSql.select).toHaveBeenCalledTimes(1);

    // Validate response
    expect(response.status).toBe(500);
    expect(responseBody).toEqual({ error: "Error fetching items" });
  });
});
