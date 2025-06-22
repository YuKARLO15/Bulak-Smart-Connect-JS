module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|ts)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/*.e2e-spec.ts',
  ],
  coverageDirectory: '../coverage',
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/test/.*\\.e2e-spec\\.ts$'],
  globals: {
    'ts-jest': {
      tsconfig: {
        // Allow any for test files to avoid crypto typing issues
        compilerOptions: {
          strict: false,
        },
      },
    },
  },
};