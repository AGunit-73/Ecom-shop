/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const config: Config = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "C:\\Users\\91990\\AppData\\Local\\Temp\\jest",

  // Automatically clear mock calls, instances, contexts, and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  // coverageProvider: "babel",

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // Automatically reset mock state before every test
  // resetMocks: false,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // Automatically restore mock state and implementation before every test
  // restoreMocks: false,

  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,

  // The test environment that will be used for testing
  testEnvironment: 'jsdom', // Required for Fetch API compatibility with Next.js

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Path alias for the `@` symbol
  },

  // The paths to modules that run some code to configure or set up the testing framework before each test
  setupFiles: ['whatwg-fetch'], // Fetch API polyfill

  // Configure setup after environment initialization
  setupFilesAfterEnv: ['<rootDir>/src/app/__mock__/setupTests.ts'], // Path to your mock setup file

  // Adds a location field to test results
  // testLocationInResults: false,

  // Automatically reset the mock state before every test
  // resetMocks: false,
};

export default createJestConfig(config);


