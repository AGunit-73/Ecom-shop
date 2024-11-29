import { DELETE } from "@/app/api/product/delete/route";
import { del } from "@vercel/blob"; // Import `del` for mocking
import { mockSql } from "@/app/__mock__/postgres";

// Mock `del` to prevent actual file deletion during tests
jest.mock("@vercel/blob", () => ({
  del: jest.fn().mockResolvedValue({}), // Mock `del` to return a resolved promise
}));

// Mock `NextResponse` to simulate JSON response behavior
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data: Record<string, unknown>, init?: { status?: number }) => ({
      status: init?.status || 200,
      json: async () => data,
    })),
  },
}));

describe("DELETE /api/product/delete-item (Integration Test)", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should delete an item and the image", async () => {
    const mockDbResponse = { rowCount: 1 }; // Simulate the item was found and deleted
    mockSql.delete.mockResolvedValueOnce(mockDbResponse); // Mock SQL delete

    const mockImagePath = "/test.jpg";
    (del as jest.Mock).mockResolvedValueOnce({}); // Mock successful image deletion

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        itemid: 1,
        imageUrl: "http://example.com/test.jpg",
      }),
    } as unknown as Request;

    const response = await DELETE(mockRequest);

    // Validate SQL query execution
    expect(mockSql.delete).toHaveBeenCalledTimes(1);
    expect(mockSql.delete).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM items"),
      expect.arrayContaining([1])
    );

    // Validate image deletion
    expect(del).toHaveBeenCalledWith(mockImagePath);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      message: "Item deleted successfully",
    });
  });

  it("should handle missing required fields", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        itemid: undefined,
        imageUrl: undefined,
      }),
    } as unknown as Request;

    const response = await DELETE(mockRequest);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Item ID and image URL are required",
    });
  });

  it("should handle item not found", async () => {
    const mockDbResponse = { rowCount: 0 }; // Simulate no items found
    mockSql.delete.mockResolvedValueOnce(mockDbResponse);

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        itemid: 1,
        imageUrl: "http://example.com/test.jpg",
      }),
    } as unknown as Request;

    const response = await DELETE(mockRequest);

    // Validate SQL query execution
    expect(mockSql.delete).toHaveBeenCalledTimes(1);
    expect(mockSql.delete).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM items"),
      expect.arrayContaining([1])
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      success: false,
      message: "Item not found",
    });
  });

  it("should handle deletion failure", async () => {
    mockSql.delete.mockRejectedValueOnce(new Error("Database error"));

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        itemid: 1,
        imageUrl: "http://example.com/test.jpg",
      }),
    } as unknown as Request;

    const response = await DELETE(mockRequest);

    // Validate SQL query execution
    expect(mockSql.delete).toHaveBeenCalledTimes(1);
    expect(mockSql.delete).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM items"),
      expect.arrayContaining([1])
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      success: false,
      message: "Deletion failed",
    });
  });
});
