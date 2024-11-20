import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app directory
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Maps aliases like "@/some-path"
    '^../src/app/context/usercontext$': '<rootDir>/src/app/context/usercontext.tsx', 
    '^../src/components/(.*)$': '<rootDir>/src/app/components/$1', // Corrects paths for components
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Ensure the file exists
};

export default createJestConfig(config);
