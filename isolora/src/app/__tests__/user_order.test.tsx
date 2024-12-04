import { GET } from "../api/orders/get-user-orders/route";
import { mockSql } from "../__mock__/postgres";

jest.mock("@vercel/postgres");

describe("GET /api/orders/get-user-orders", () => {
  test("returns orders for a valid customer ID", async () => {
    const mockRequest = {
      url: "http://localhost/api/orders/get-user-orders?customerId=1",
    } as Request;

    mockSql.select.mockResolvedValueOnce({
      rows: [
        {
          orderId: 1,
          product_name: "Product A",
          image_url: "http://example.com/image.jpg",
          price: 20,
        },
      ],
    });

    const response = await GET(mockRequest);

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.orders).toHaveLength(1);
    expect(result.orders[0].product_name).toBe("Product A");
  });

  test("returns an error for missing customer ID", async () => {
    const mockRequest = {
      url: "http://localhost/api/orders/get-user-orders",
    } as Request;

    const response = await GET(mockRequest);

    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.success).toBe(false);
    expect(result.message).toBe("Valid Customer ID is required");
  });
});
