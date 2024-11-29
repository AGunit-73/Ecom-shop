// src/app/__mock__/postgres.ts
export const mockSql = {
  insert: jest.fn(),
  select: jest.fn(),
  delete: jest.fn(), // This is crucial for testing the DELETE functionality
  createTable: jest.fn(),
};

// Mock the actual SQL implementation
jest.mock("@vercel/postgres", () => ({
  sql: jest.fn((template: TemplateStringsArray, ...values: any[]// eslint-disable-line @typescript-eslint/no-explicit-any
) => {
    const query = template.join("?");
    if (query.includes("DELETE FROM items")) {
      return mockSql.delete(query, values);
    }
    if (query.includes("INSERT")) {
      return mockSql.insert(query, values);
    }
    if (query.includes("SELECT")) {
      return mockSql.select(query, values);
    }
    if (query.includes("CREATE TABLE")) {
      return mockSql.createTable(query, values);
    }
  }),
}));
