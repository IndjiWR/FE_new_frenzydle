import type { Config } from 'jest';

const config: Config = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.d.ts',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/test-setup.ts',
  ],
  coverageReporters: ['lcov', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  resolver: '@nx/jest/plugins/resolver',
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: './tsconfig.base.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  setupFilesAfterEnv: ['jest-preset-angular/setup-jest', '@testing-library/jest-dom'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/libs/shared/$1/src/lib',
    '^@games/dragonball/(.*)$': '<rootDir>/libs/games/dragonball/$1/src/lib',
  },
};

export default config;