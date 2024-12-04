// src/app/__mock__/next-response.ts
export const NextResponse = {
  json: jest.fn().mockImplementation((data, options) => {
    return new Response(JSON.stringify(data), options);
  }),
};
