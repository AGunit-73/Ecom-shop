import { PATCH } from "@/app/api/product/update-quantity/route";
import { mockSql } from "@/app/__mock__/postgres";

// Mock dependencies
jest.mock("@vercel/postgres");

jest.mock("next/server", () => ({
    ...jest.requireActual("next/server"),
    NextResponse: {
        json: jest.fn((data: any, init?: { status?: number }) => ({
            status: init?.status || 200,
            json: async () => data,
        })),
    },
}));

describe("PATCH /api/product/update-quantity", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update the quantity successfully", async () => {
        const mockRequest = new Request("http://example.com", {
            method: "PATCH",
            body: JSON.stringify({
                userId: 1,
                productId: 1,
                quantity: 10,
            }),
        });

        // Mock SQL queries to match actual implementation
        mockSql.select.mockResolvedValueOnce({
            rowCount: 1,
            rows: [{ itemid: 1, quantity: 5 }],
        });

        mockSql.update.mockResolvedValueOnce({
            rowCount: 1,
            rows: [{ itemid: 1, quantity: 10 }],
        });

        const response = await PATCH(mockRequest);
        const responseBody = await response.json();

        // Validate SQL query execution using string matching
        expect(mockSql.select).toHaveBeenCalledTimes(1);
        expect(mockSql.select).toHaveBeenCalledWith(
            expect.stringMatching(/SELECT \* FROM items WHERE itemid = \?/),
            [1] // productId
        );

        expect(mockSql.update).toHaveBeenCalledTimes(1);
        expect(mockSql.update).toHaveBeenCalledWith(
            expect.stringMatching(/UPDATE items/),
            expect.arrayContaining([10, 1]) // quantity and itemid
        );

        // Validate response
        expect(response.status).toBe(200);
        expect(responseBody).toEqual({
            success: true,
            message: "Quantity updated successfully",
            updatedProduct: { itemid: 1, quantity: 10 },
        });
    });

    it("should return 400 for invalid input data", async () => {
        const mockRequest = new Request("http://example.com", {
            method: "PATCH",
            body: JSON.stringify({
                userId: 1,
                productId: 1,
                quantity: -1,
            }),
        });

        const response = await PATCH(mockRequest);
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody).toEqual({
            error: "Quantity cannot be negative"
        });
    });

    it("should return 404 if the product does not exist", async () => {
        const mockRequest = new Request("http://example.com", {
            method: "PATCH",
            body: JSON.stringify({
                userId: 1,
                productId: 999,
                quantity: 10,
            }),
        });

        mockSql.select.mockResolvedValueOnce({ rowCount: 0, rows: [] });

        const response = await PATCH(mockRequest);
        const responseBody = await response.json();

        expect(mockSql.select).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(404);
        expect(responseBody).toEqual({
            error: "Product not found"
        });
    });

    it("should handle server errors gracefully", async () => {
        const mockRequest = new Request("http://example.com", {
            method: "PATCH",
            body: JSON.stringify({
                userId: 1,
                productId: 1,
                quantity: 10,
            }),
        });

        mockSql.select.mockResolvedValueOnce({
            rowCount: 1,
            rows: [{ itemid: 1, quantity: 5 }],
        });
        mockSql.update.mockRejectedValueOnce(new Error("Database error"));

        const response = await PATCH(mockRequest);
        const responseBody = await response.json();

        expect(mockSql.select).toHaveBeenCalledTimes(1);
        expect(mockSql.update).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(500);
        expect(responseBody).toEqual({
            success: false,
            message: "Update failed"
        });
    });
});