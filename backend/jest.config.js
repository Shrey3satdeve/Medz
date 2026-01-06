// jest.config.js
module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    setupFiles: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(nanoid)/)'
    ],
    collectCoverageFrom: [
        'src/**/*.js',
        'controllers/**/*.js',
        'routes/**/*.js',
        'services/**/*.js',
        'middleware/**/*.js',
        '!**/__tests__/**',
        '!**/node_modules/**'
    ],
    testMatch: [
        '**/__tests__/**/*.test.js'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 75,
            lines: 80,
            statements: 80
        }
    },
    testTimeout: 10000,
    verbose: true
};
