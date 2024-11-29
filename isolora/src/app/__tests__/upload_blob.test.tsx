import { POST } from "@/app/api/product/upload/route";
import { put } from "@vercel/blob";

// Mocking `put` and `NextResponse.json`
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
    jest.clearAllMocks();
  });

  it("should upload an image successfully", async () => {
    // Mock the Request object with a URL containing the filename
    const mockRequest = new Request("http://localhost/api/product/upload?filename=test-image.jpg", {
      method: "POST",
      body: "image-data", // Simulating the image data
    });

    // Mock the `put` function to return a successful response
    (put as jest.Mock).mockResolvedValue({ url: "http://example.com/test-image.jpg" });

    // Call the POST function
    const response = await POST(mockRequest);

    // Validate the `put` function call
    expect(put).toHaveBeenCalledWith("test-image.jpg", "image-data", { access: "public" });

    // Validate the response
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url: "http://example.com/test-image.jpg" });
  });

  it("should handle missing filename", async () => {
    // Mock the Request object with an empty filename
    const mockRequest = new Request("http://localhost/api/product/upload?filename=", {
      method: "POST",
      body: "image-data",
    });

    const response = await POST(mockRequest);

    // Validate the response
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Filename is required" });
  });

  it("should handle missing file data", async () => {
    // Mock the Request object with missing file data
    const mockRequest = new Request("http://localhost/api/product/upload?filename=test-image.jpg", {
      method: "POST",
      body: null,
    });

    const response = await POST(mockRequest);

    // Validate the response
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "File data is missing" });
  });
});
