module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'html', 'lcov'],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  moduleFileExtensions: ['js', 'json', 'node']
};
