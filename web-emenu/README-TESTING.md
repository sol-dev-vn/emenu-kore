# Testing Guide for SOL eMenu

## 🚀 Quick Start

To run all tests:
```bash
npm test
```

To run tests in watch mode (useful during development):
```bash
npm run test:watch
```

To run tests with coverage report:
```bash
npm run test:coverage
```

To run tests for CI/CI (continuous integration):
```bash
npm run test:ci
```

## 📋 Test Suite Overview

### 1. QR Code Validation Tests (`qr-validation.test.ts`)
- **Purpose**: Tests QR code URL format validation and table ID parsing
- **Coverage**: URL validation, table ID normalization, parameter extraction
- **Commands**:
  ```bash
  npm test -- qr-validation.test.ts
  ```

### 2. API Endpoint Tests (`api-endpoints.test.ts`)
- **Purpose**: Tests table and branch API endpoints used in QR scanning
- **Coverage**: Table lookup, branch lookup, error handling, data validation
- **Commands**:
  ```bash
  npm test -- api-endpoints.test.ts
  ```

### 3. QR Menu Component Tests (`qr-menu-simple.test.tsx`)
- **Purpose**: Tests basic QR menu functionality and component behavior
- **Coverage**: Component rendering, user interactions, error states
- **Commands**:
  ```bash
  npm test -- qr-menu-simple.test.tsx
  ```

## 🔧 Running Specific Tests

### Run a single test file:
```bash
# QR validation tests
npm test src/lib/__tests__/qr-validation.test.ts

# API endpoint tests
npm test src/lib/__tests__/api-endpoints.test.ts

# QR menu component tests
npm test src/lib/__tests__/qr-menu-simple.test.tsx
```

### Run tests matching a pattern:
```bash
# Run all QR-related tests
npm test -- --testNamePattern="QR"

# Run all API-related tests
npm test -- --testNamePattern="API"

# Run validation tests only
npm test -- --testNamePattern="validation"
```

### Run tests with specific output:
```bash
# Verbose output
npm test -- --verbose

# Run tests and show only failing tests
npm test -- --verbose=false

# Run tests with custom reporter
npm test -- --notify=true
```

## 📊 Understanding Test Results

### Test Output Legend:
- ✅ **PASS**: Test passed successfully
- ❌ **FAIL**: Test failed with an error
- ⏱️ **SKIP**: Test was skipped (usually due to .skip modifier)

### Coverage Metrics:
- **% Stmts**: Percentage of statements covered
- **% Branch**: Percentage of conditional branches covered
- **% Funcs**: Percentage of functions covered
- **% Lines**: Percentage of lines covered

### Coverage Thresholds:
Current thresholds are set to 70% for all metrics. These can be adjusted in `jest.config.js`.

## 🐛 Debugging Tests

### Running tests in debug mode:
```bash
# Run tests with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Or using VS Code debugging
# Add this to your .vscode/launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Common debugging techniques:
1. **Use `console.log`** for simple debugging
2. **Use `--verbose` flag** to see detailed test output
3. **Use `--runInBand`** to run tests sequentially (helps with debugging race conditions)
4. **Use `--testNamePattern`** to run specific failing tests

## 📝 Writing New Tests

### Test File Naming Convention:
- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.integration.test.ts`
- End-to-end tests: `*.e2e.test.ts`

### Test Structure:
```typescript
describe('Feature Name', () => {
  describe('Specific Functionality', () => {
    test('should do something specific', () => {
      // Arrange
      const input = 'test input';

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe('expected output');
    });
  });
});
```

### Best Practices:
1. **Arrange, Act, Assert** pattern
2. **Descriptive test names** that explain what the test does
3. **Test one thing** per test
4. **Use meaningful assertions**
5. **Mock external dependencies**
6. **Clean up** after each test

## 🔧 Configuration

### Jest Configuration (`jest.config.js`):
- **testEnvironment**: `jsdom` for React component testing
- **moduleNameMapper**: Maps `@/` imports to `src/` directory
- **setupFilesAfterEnv**: Runs `jest.setup.js` before each test
- **coverageThreshold**: Sets minimum coverage requirements

### Test Setup (`jest.setup.js`):
- **Mocks Next.js router** and navigation
- **Mocks fetch API** for API testing
- **Mocks ResizeObserver** and **IntersectionObserver**
- **Configures console error handling**

## 📚 Additional Testing Resources

### Official Documentation:
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/testing)

### Useful Libraries:
- **@testing-library/user-event**: Simulate user interactions
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **msw**: Mock Service Worker for API mocking
- **@storybook/jest**: Storybook integration testing

## 🚀 CI/CD Integration

### GitHub Actions Example:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
```

### Test Commands for CI:
```bash
# Run tests once without interactive features
npm run test:ci

# Generate coverage report for CI
npm run test:coverage
```

## 🐛 Troubleshooting

### Common Issues:

1. **Module not found errors**:
   - Check `moduleNameMapper` in jest.config.js
   - Verify import paths are correct
   - Ensure file extensions are included

2. **Test timeouts**:
   - Increase timeout with `jest.setTimeout(10000)`
   - Check for infinite loops or unresolved promises

3. **Mock not working**:
   - Ensure mocks are placed before imports
   - Check mock implementation matches the actual API
   - Clear mocks between tests with `jest.clearAllMocks()`

4. **Coverage not reporting**:
   - Check `collectCoverageFrom` configuration
   - Ensure test files match the pattern
   - Verify files are not in `testPathIgnorePatterns`

### Getting Help:
- Check Jest documentation for specific errors
- Review console output for detailed error messages
- Use `--verbose` flag for more information
- Check GitHub issues for common problems

---

**Happy Testing! 🎉**