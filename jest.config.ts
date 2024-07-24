import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: "node",
  setupFilesAfterEnv: ["./src/__tests__/setup.ts"],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist',
    '/src/__tests__/'
  ],
};

export default config;