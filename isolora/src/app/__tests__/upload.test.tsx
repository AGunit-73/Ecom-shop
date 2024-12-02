// src/app/__tests__/upload.test.tsx
import { POST } from "@/app/api/product/upload/route";
import { mockBlob } from "@/app/__mock__/blob"; // Import the mockBlob for assertions

// Mocking `NextResponse.json`
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body: any, { status }: { status: number }) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      status,
      json: async () => body,
    })),
  },
}));

describe("POST /api/product/upload", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("should handle missing filename", async () => {
    const mockRequest = new Request("http://localhost/api/product/upload?filename=", {
      method: "POST",
      body: "image-data", // Mock image data
    });

    const response = await POST(mockRequest);

    const responseBody = await response.json();
    expect(response.status).toBe(400);
    expect(responseBody).toEqual({ error: "Filename is required" });
  });

  it("should handle missing file data", async () => {
    const mockRequest = new Request("http://localhost/api/product/upload?filename=test-image.jpg", {
      method: "POST",
      body: null, // Simulating missing file data
    });

    const response = await POST(mockRequest);

    const responseBody = await response.json();
    expect(response.status).toBe(400);
    expect(responseBody).toEqual({ error: "File data is missing" });
  });

  it("should handle upload failure", async () => {
    const mockRequest = new Request("http://localhost/api/product/upload?filename=test-image.jpg", {
      method: "POST",
      body: "image-data",
    });

    // Simulate a 
    //failure in the 
    //upload process
    (mockBlob.put as jest.Mock).mockRejectedValueOnce(new Error("Upload failed"));

    const response = await POST(mockRequest);

    const responseBody = await response.json();
    expect(response.status).toBe(500);
    expect(responseBody).toEqual({ error: "Upload failed" });
  });
});
