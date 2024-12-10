import { POST } from "@/app/api/product/add-items/route";
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

describe("POST /api/product/add-items", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it("should add an item successfully", async () => {
        const mockRequest = new Request("http://example.com", {
            method: "POST",
            body: JSON.stringify({
                name: "Test Item",
                category: "Test Category",
                description: "This is a test item.",
                price: 100,
                quantity: 10,
                imageUrl: "http://example.com/test-image.jpg",
                user_id: 1,
            }),
        });

        // Mock SQL insert response
        mockSql.insert.mockResolvedValueOnce({
            rows: [
                {
                    id: 1,
                    name: "Test Item",
                    category: "Test Category",
                    description: "This is a test item.",
                    price: 100,
                    quantity: 10,
                    image_url: "http://example.com/test-image.jpg",
                    user_id: 1,
                },
            ],
        });

        const response = await POST(mockRequest);

        // Validate SQL query execution
        expect(mockSql.insert).toHaveBeenCalledTimes(1);
        expect(mockSql.insert).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO items"),
            expect.arrayContaining([
                "Test Item",
                "Test Category",
                "This is a test item.",
                100,
                10,
                "http://example.com/test-image.jpg",
                1,
            ])
        );

        // Validate response
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            success: true,
            item: {
                id: 1,
                name: "Test Item",
                category: "Test Category",
                description: "This is a test item.",
                price: 100,
                quantity: 10,
                image_url: "http://example.com/test-image.jpg",
                user_id: 1,
            },
        });
    });

    it("should handle missing required fields", async () => {
        const mockRequest = new Request("http://example.com", {
            method: "POST",
            body: JSON.stringify({
                // Missing required fields like name, category, etc.
                price: 100,
                quantity: 10,
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
                name: "Test Item",
                category: "Test Category",
                description: "This is a test item.",
                price: 100,
                quantity: 10,
                imageUrl: "http://example.com/test-image.jpg",
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
