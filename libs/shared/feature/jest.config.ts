import type { Config } from 'jest';

const config: Config = {
  displayName: 'shared-feature',
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  coverageDirectory: '../../../coverage/libs/shared/feature',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'html'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/../../../tsconfig.base.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!@angular|@nx|rxjs|@ngx-translate)'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../../$1/src/index.ts',
    '^@games/dragonball/(.*)$': '<rootDir>/../../../libs/games/dragonball/$1/src/index.ts',
  },
};

export default config;