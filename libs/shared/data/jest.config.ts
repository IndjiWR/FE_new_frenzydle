import type { Config } from 'jest';

const config: Config = {
  displayName: 'shared-data',
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  coverageDirectory: '../../../coverage/libs/shared/data',
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
    '^@shared/ui$': '<rootDir>/../ui/src/index.ts',
    '^@shared/data$': '<rootDir>/src/index.ts',
    '^@shared/feature$': '<rootDir>/../feature/src/index.ts',
    '^@games/dragonball/(.*)$': '<rootDir>/../../../libs/games/dragonball/$1/src/index.ts',
  },
};

export default config;