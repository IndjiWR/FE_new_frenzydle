import type { Config } from 'jest';

const config: Config = {
  displayName: 'shared-ui',
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  coverageDirectory: '../../../coverage/libs/shared/ui',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'html'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!@angular|@nx|rxjs|@ngx-translate)'],
  moduleNameMapper: {
    '^@shared/data$': '<rootDir>/../../shared/data/src/index.ts',
    '^@shared/ui$': '<rootDir>/src/index.ts',
    '^@shared/feature$': '<rootDir>/../../shared/feature/src/index.ts',
  },
};

export default config;