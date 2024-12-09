import { POST } from "@/app/api/product/upload/route";
import { put } from "@vercel/blob";

// Mock `put` and `NextResponse.json`
jest.mock("@vercel/blob", () => ({
  put: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body: any, init?: { status?: number }) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}));

describe("POST /api/product/upload", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("should upload an image successfully", async () => {
    const mockFileData = Buffer.from("image-data"); // Mock binary data
    const mockRequest = new Request("http://localhost/api/product/upload?filename=test-image.jpg", {
      method: "POST",
      body: mockFileData, // Simulate binary data
      headers: { "Content-Type": "application/octet-stream" }, // Ensure correct content type
    });

    // Mock the `put` function to return a successful response
    (put as jest.Mock).mockResolvedValue({ url: "http://example.com/test-image.jpg" });

    const response = await POST(mockRequest);

    // Validate the `put` function call
    expect(put).toHaveBeenCalledWith("test-image.jpg", mockFileData, { access: "public" });

    // Validate the response
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url: "http://example.com/test-image.jpg" });
  });

  it("should handle blob upload failure", async () => {
    const mockFileData = Buffer.from("image-data"); // Mock binary data
    const mockRequest = new Request("http://localhost/api/product/upload?filename=test-image.jpg", {
      method: "POST",
      body: mockFileData, // Simulate binary data
      headers: { "Content-Type": "application/octet-stream" }, // Ensure correct content type
    });

    // Mock the `put` function to simulate a failure
    (put as jest.Mock).mockRejectedValue(new Error("Blob upload failed"));

    const response = await POST(mockRequest);

    // Validate the response
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Blob upload failed" });
  });

  it("should handle missing filename", async () => {
    const mockFileData = Buffer.from("image-data"); // Mock binary data
    const mockRequest = new Request("http://localhost/api/product/upload?filename=", {
      method: "POST",
      body: mockFileData, // Simulate binary data
      headers: { "Content-Type": "application/octet-stream" }, // Ensure correct content type
    });

    const response = await POST(mockRequest);

    // Validate the response
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Filename is required" });
  });

  it("should handle missing file data", async () => {
    const mockRequest = new Request("http://localhost/api/product/upload?filename=test-image.jpg", {
      method: "POST",
      body: null, // Simulate missing file data
    });

    const response = await POST(mockRequest);

    // Validate the response
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "File data is missing" });
  });
});
