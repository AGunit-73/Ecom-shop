// src/app/__mock__/postgres.ts
export const mockSql = {
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createTable: jest.fn(),
};

// Ensure `delete` is properly mocked and resolves a valid result
jest.mock("@vercel/postgres", () => ({
  sql: jest.fn((template: TemplateStringsArray, ...values: any[]) => {
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
  }),
}))