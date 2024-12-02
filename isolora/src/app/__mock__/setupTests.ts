// src/app/__mock__/setupTests.ts

import { mockSql } from './postgres';
import { mockBlob } from './blob';

// Mock the `@vercel/postgres` module
jest.mock('@vercel/postgres', () => ({
  sql: jest.fn().mockImplementation((template) => {
    if (template.includes('INSERT')) return mockSql.insert;
    if (template.includes('SELECT')) return mockSql.select;
    if (template.includes('DELETE')) return mockSql.delete;
    if (template.includes('CREATE TABLE')) return mockSql.createTable;
  }),
}));


// Mock the `@vercel/blob` module
jest.mock('@vercel/blob', () => ({
  put: mockBlob.put,
  del: mockBlob.del,
  sql: jest.fn() as jest.Mock,
}));
console.log('setupTests.ts is loaded');
