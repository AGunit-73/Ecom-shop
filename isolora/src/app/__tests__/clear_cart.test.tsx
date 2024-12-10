import { DELETE } from "@/app/api/cart/clear-cart/route";
import { mockSql } from "@/app/__mock__/postgres";

jest.mock("next/server", () => ({
    ...jest.requireActual("next/server"),
    NextResponse: {
        json: jest.fn((data: any, init?: { status?: number }) => ({
            status: init?.status || 200,
            json: async () => data,
        })),
    },
}));

jest.mock("@vercel/postgres");

describe("DELETE /api/cart/clear", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should clear the cart successfully for a valid userId", async () => {
        const mockRequest = new Request("http://example.com?userId=123", {
            method: "DELETE",
        });

        mockSql.delete.mockResolvedValueOnce({ rowCount: 1 });

        const response = await DELETE(mockRequest);
        const responseBody = await response.json();

        expect(mockSql.delete).toHaveBeenCalledTimes(1);
        expect(mockSql.delete).toHaveBeenCalledWith(
            expect.stringContaining("DELETE FROM cart WHERE user_id ="),
            ["123"] // Ensure the correct parameter is passed
        );

        expect(response.status).toBe(200);
        expect(responseBody).toEqual({
            success: true,
            message: "Cart cleared successfully",
        });
    });

    it("should return 400 if userId is missing", async () => {
        const mockRequest = new Request("http://example.com", {
            method: "DELETE",
        });

        const response = await DELETE(mockRequest);
        const responseBody = await response.json();

        expect(mockSql.delete).not.toHaveBeenCalled();
        expect(response.status).toBe(400);
        expect(responseBody).toEqual({
            success: false,
            message: "Missing userId in query parameters",
        });
    });

    it("should handle server errors gracefully", async () => {
        const mockRequest = new Request("http://example.com?userId=123", {
            method: "DELETE",
        });

        mockSql.delete.mockRejectedValueOnce(new Error("Database error"));

        const response = await DELETE(mockRequest);
        const responseBody = await response.json();

        expect(mockSql.delete).toHaveBeenCalledTimes(1);
        expect(mockSql.delete).toHaveBeenCalledWith(
            expect.stringContaining("DELETE FROM cart WHERE user_id ="),
            ["123"]
        );

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({
            success: false,
            message: "Failed to clear cart. Please try again.",
        });
    });
});
