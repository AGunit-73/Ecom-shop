import { POST } from "@/app/api/product/add-items/route";
import { mockSql } from "@/app/__mock__/postgres"; // Import the mockSql for assertions

// Mock dependencies
jest.mock("@vercel/postgres");
jest.mock("next/server", () => ({
  ...jest.requireActual("next/server"),
  NextResponse: {
    json: jest.fn((data: any, init?: { status?: number }) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

describe("POST /api/product/add-items", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should successfully add an item to the database", async () => {
    const mockItem = {
      name: "Test Item",
      category: "Test Category",
      description: "Test Description",
      price: 100,
      quantity: 10,
      imageUrl: "http://example.com/test.jpg",
      user_id: 1,
    };

    // Mock SQL insert response
    mockSql.insert.mockResolvedValueOnce({ rows: [mockItem] });

    const mockRequest = new Request("http://example.com", {
      method: "POST",
      body: JSON.stringify(mockItem),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    // Validate SQL query execution
    expect(mockSql.insert).toHaveBeenCalledTimes(1);
    expect(mockSql.insert).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO items"),
      expect.arrayContaining([
        "Test Item",
        "Test Category",
        "Test Description",
        100,
        10,
        "http://example.com/test.jpg",
        1,
      ])
    );

    // Validate response
    expect(response.status).toBe(200);
    expect(responseBody).toEqual({ success: true, item: mockItem });
  });

  it("should handle missing required fields", async () => {
    const mockRequest = new Request("http://example.com", {
      method: "POST",
      body: JSON.stringify({}), // Missing fields
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    // Ensure the SQL insert query is not executed
    expect(mockSql.insert).not.toHaveBeenCalled();

    // Validate response
    expect(response.status).toBe(400);
    expect(responseBody).toEqual({ success: false, message: "Missing required fields" });
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

    // Mock SQL insert rejection
    mockSql.insert.mockRejectedValueOnce(new Error("Database error"));

    const mockRequest = new Request("http://example.com", {
      method: "POST",
      body: JSON.stringify(mockItem),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    // Validate SQL query execution
    expect(mockSql.insert).toHaveBeenCalledTimes(1);
    expect(mockSql.insert).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO items"),
      expect.arrayContaining([
        "Test Item",
        "Test Category",
        "Test Description",
        100,
        10,
        "http://example.com/test.jpg",
        1,
      ])
    );

    // Validate response
    expect(response.status).toBe(500);
    expect(responseBody).toEqual({ success: false, message: "Database error" });
  });
});
