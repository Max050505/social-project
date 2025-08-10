import { Config } from 'jest';
import { defaults } from 'ts-jest/presets';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    ...defaults.transform,
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], 
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy', 
  },
};

export default config;