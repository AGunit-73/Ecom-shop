// src/app/__mock__/postgres.ts

// Define types for the mock SQL methods
type SqlMethod = (query: string, values: (string | number | boolean | null)[]) => Promise<any>;

export const mockSql: Record<string, jest.MockedFunction<SqlMethod>> = {
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createTable: jest.fn(),
};

// Mock the `@vercel/postgres` module
jest.mock("@vercel/postgres", () => ({
  sql: jest.fn((template: TemplateStringsArray, ...values: (string | number | boolean | null)[]) => {
    const query = template.join("?");
    
    if (query.includes("DELETE FROM cart WHERE user_id =")) {
      return mockSql.delete(query, values);
    }
    if (query.includes("INSERT")) {
      return mockSql.insert(query, values);
    }
    if (query.includes("SELECT")) {
      return mockSql.select(query, values);
    }
    if (query.includes("UPDATE")) {
      return mockSql.update(query, values);
    }
    if (query.includes("CREATE TABLE")) {
      return mockSql.createTable(query, values);
    }
    
    // Default case for unsupported queries
    throw new Error(`Unhandled query: ${query}`);
  }),
}));
