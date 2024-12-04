import { GET } from "../api/orders/get-vendor-orders/route";
import { mockSql } from "../__mock__/postgres";

jest.mock("@vercel/postgres");

describe("GET /api/orders/get-vendor-orders", () => {
  test("should return 400 when vendorId is missing", async () => {
    const request = new Request("http://localhost/api/orders/get-vendor-orders");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Valid Vendor ID is required");
  });

  test("should return 404 when vendor does not exist", async () => {
    mockSql.select.mockResolvedValueOnce({ rows: [] }); // Mock vendor check

    const request = new Request("http://localhost/api/orders/get-vendor-orders?vendorId=123");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Vendor not found");
  });

  test("should return 200 with vendor orders when valid vendorId is provided", async () => {
    mockSql.select
      .mockResolvedValueOnce({ rows: [{ role: "vendor" }] }) // Mock vendor check
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            product_name: "Product 1",
            image_url: "http://example.com/product1.jpg",
            price: 100,
            customer_name: "John Doe",
          },
        ],
      }); // Mock orders query

    const request = new Request("http://localhost/api/orders/get-vendor-orders?vendorId=123");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.orders).toHaveLength(1);
    expect(body.orders[0].product_name).toBe("Product 1");
  });

  test("should return 500 when database query fails", async () => {
    mockSql.select.mockRejectedValueOnce(new Error("Database error")); // Mock error

    const request = new Request("http://localhost/api/orders/get-vendor-orders?vendorId=123");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Failed to fetch vendor orders");
  });
});
