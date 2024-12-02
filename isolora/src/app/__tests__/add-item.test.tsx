import { POST } from "../api/cart/add-item/route" // Adjust the path based on your project structure
import { sql } from "@vercel/postgres";

// Mock the database
jest.mock("@vercel/postgres", () => ({
  sql: jest.fn(),
}));

describe("POST /api/cart", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("adds an item to the cart successfully", async () => {
    const request = new Request("http://localhost/api/cart", {
      method: "POST",
      body: JSON.stringify({
        userId: 1,
        productId: 101,
        quantity: 2,
      }),
    });

    // Mock the database responses
    sql.mockResolvedValueOnce({ rowCount: 0 }); // No existing item in the cart
    sql.mockResolvedValueOnce({
      rows: [
        { id: 1, productId: 101, quantity: 2 },
      ],
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(sql).toHaveBeenCalledTimes(2); // Check both queries are executed
    expect(sql).toHaveBeenCalledWith(
      expect.stringContaining("SELECT id, quantity FROM cart"),
      expect.anything()
    );
    expect(sql).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO cart"),
      expect.anything()
    );
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      success: true,
      message: "Item added to cart successfully",
      cartItem: { id: 1, productId: 101, quantity: 2 },
    });
  });

  it("returns an error if the item is already in the cart", async () => {
    const request = new Request("http://localhost/api/cart", {
      method: "POST",
      body: JSON.stringify({
        userId: 1,
        productId: 101,
        quantity: 2,
      }),
    });

    // Mock the database response to indicate the item exists
    sql.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 1, quantity: 2 }],
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(sql).toHaveBeenCalledTimes(1); // Only the SELECT query is executed
    expect(sql).toHaveBeenCalledWith(
      expect.stringContaining("SELECT id, quantity FROM cart"),
      expect.anything()
    );
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      success: false,
      message: "Item already in cart",
    });
  });

  it("handles unexpected errors gracefully", async () => {
    const request = new Request("http://localhost/api/cart", {
      method: "POST",
      body: JSON.stringify({
        userId: 1,
        productId: 101,
        quantity: 2,
      }),
    });

    // Mock the database to throw an error
    sql.mockRejectedValueOnce(new Error("Database connection failed"));

    const response = await POST(request);
    const responseData = await response.json();

    expect(sql).toHaveBeenCalledTimes(1); // Only the SELECT query is executed before the error
    expect(sql).toHaveBeenCalledWith(
      expect.stringContaining("SELECT id, quantity FROM cart"),
      expect.anything()
    );
   
