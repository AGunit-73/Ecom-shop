import { POST } from "@/app/api/product/add-items/route";
import { mockSql } from "@/app/__mock__/postgres";

// Mock dependencies
jest.mock("@vercel/postgres");

jest.mock("next/server", () => ({
    ...jest.requireActual("next/server"),
    NextResponse: {
        json: jest.fn((data: { success: boolean; item?: object; message?: string }, init?: { status?: number }) => ({
            status: init?.status || 200,
            json: async () => data,
        })),
    },
}));

describe("POST /api/cart/add-items", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it("should add an item to the cart successfully", async () => {
        const mockRequest = new Request("http://example.com", {
            method: "POST",
            body: JSON.stringify({
                item_id: 1,
                quantity: 2,
                user_id: 1,
            }),
        });

        // Mock SQL insert response for cart item addition
        mockSql.insert.mockResolvedValueOnce({
            rows: [
                {
                    id: 1,
                    item_id: 1,
                    quantity: 2,
                    user_id: 1,
                },
            ],
        });

        const response = await POST(mockRequest);

        // Validate SQL query execution
        expect(mockSql.insert).toHaveBeenCalledTimes(1);
        expect(mockSql.insert).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO cart"),
            expect.arrayContaining([1, 2, 1]) // item_id, quantity, user_id
        );

        // Validate response
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            success: true,
            item: {
                id: 1,
                item_id: 1,
                quantity: 2,
                user_id: 1,
            },
        });
    });

    it("should handle missing required fields", async () => {
        const mockRequest = new Request("http://example.com", {
            method: "POST",
            body: JSON.stringify({
                // Missing required fields like item_id, quantity, etc.
                user_id: 1,
            }),
        });

        const response = await POST(mockRequest);

        // Validate response
        expect(response.status).toBe(500); // Since missing fields throw an error
        expect(await response.json()).toEqual({
            success: false,
            message: "Database error",
        });
    });

    it("should handle database errors", async () => {
        const mockRequest = new Request("http://example.com", {
            method: "POST",
            body: JSON.stringify({
                item_id: 1,
                quantity: 2,
                user_id: 1,
            }),
        });

        // Mock SQL insert rejection
        mockSql.insert.mockRejectedValueOnce(new Error("Database error"));

        const response = await POST(mockRequest);

        // Validate response
        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({
            success: false,
            message: "Database error",
        });
    });
});
