// src/app/__mock__/blob.ts
export const mockBlob = {
  put: jest.fn().mockResolvedValue({
    url: 'http://example.com/uploaded-image.jpg',
  }),

  del: jest.fn().mockResolvedValue({
    success: true,
  }),
};

// Mock the actual import for Vercel Blob storage methods
jest.mock('@vercel/blob', () => ({
  put: mockBlob.put,
  del: mockBlob.del,
}));
