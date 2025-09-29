module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1'
  }
};

