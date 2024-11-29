import { DELETE } from "@/app/api/product/delete/route";
import { del } from "@vercel/blob";
import { mockSql } from "@/app/__mock__/postgres"; // Import the mockSql for assertions

// Mock dependencies
jest.mock("@vercel/postgres");
jest.mock("@vercel/blob", () => ({
  del: jest.fn(),
}));

jest.mock("next/server", () => ({
  ...jest.requireActual("next/server"),
  NextResponse: {
    json: jest.fn((data: any, init?: { status?: number }) => ({// eslint-disable-line @typescript-eslint/no-explicit-any
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

describe("DELETE /api/product/delete", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should delete an item successfully", async () => {
    const mockRequest = new Request("http://example.com", {
      method: "DELETE",
      body: JSON.stringify({
        itemid: 1,
        imageUrl: "http://example.com/test.jpg",
      }),
    });

    // Mock SQL delete and del responses
    mockSql.delete.mockResolvedValueOnce({ rowCount: 1 });
    (del as jest.Mock).mockResolvedValueOnce({});

    const response = await DELETE(mockRequest);

    // Validate SQL query execution
    expect(mockSql.delete).toHaveBeenCalledTimes(1);
    expect(mockSql.delete).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM items"),
      expect.arrayContaining([1]) // Ensure the itemid is passed as a parameter
    );

    // Validate image deletion
    expect(del).toHaveBeenCalledWith("/test.jpg");

    // Validate response
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, message: "Item deleted successfully" });
  });

  it("should handle missing required fields", async () => {
    const mockRequest = new Request("http://example.com", {
      method: "DELETE",
      body: JSON.stringify({}),
    });

    const response = await DELETE(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Item ID and image URL are required" });
  });

  it("should handle item not found", async () => {
    const mockRequest = new Request("http://example.com", {
      method: "DELETE",
      body: JSON.stringify({
        itemid: 1,
        imageUrl: "http://example.com/test.jpg",
      }),
    });

    // Mock SQL delete response with no rows affected
    mockSql.delete.mockResolvedValueOnce({ rowCount: 0 });

    const response = await DELETE(mockRequest);

    // Validate SQL query execution
    expect(mockSql.delete).toHaveBeenCalledTimes(1);
    expect(mockSql.delete).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM items"),
      expect.arrayContaining([1]) // Ensure the itemid is passed as a parameter
    );

    // Validate response
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ success: false, message: "Item not found" });
  });

  it("should handle deletion failure", async () => {
    const mockRequest = new Request("http://example.com", {
      method: "DELETE",
      body: JSON.stringify({
        itemid: 1,
        imageUrl: "http://example.com/test.jpg",
      }),
    });

    // Mock SQL delete rejection
    mockSql.delete.mockRejectedValueOnce(new Error("Database error"));

    const response = await DELETE(mockRequest);

    // Validate SQL query execution
    expect(mockSql.delete).toHaveBeenCalledTimes(1);
    expect(mockSql.delete).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM items"),
      expect.arrayContaining([1]) // Ensure the itemid is passed as a parameter
    );

    // Validate response
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ success: false, message: "Deletion failed" });
  });
});
