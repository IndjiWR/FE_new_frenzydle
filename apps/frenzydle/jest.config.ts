import type { Config } from 'jest';

const config: Config = {
  displayName: 'frenzydle',
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  coverageDirectory: '../../coverage/apps/frenzydle',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'html'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: 'apps/frenzydle/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!@angular|@nx|rxjs|@ngx-translate)'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../../libs/shared/$1/src/index.ts',
    '^@games/dragonball/(.*)$': '<rootDir>/../../libs/games/dragonball/$1/src/index.ts',
  },
  collectCoverageFrom: [
    '**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/*.d.ts',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/test-setup.ts',
    '!**/main.ts',
    '!**/environment*.ts',
    '!**/jest.config.ts',
    '!**/index.ts',
    '!**/app.config.ts',
    '!**/app.routes.ts',
  ],
};

export default config;