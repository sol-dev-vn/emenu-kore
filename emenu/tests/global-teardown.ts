import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');

  // Clean up global test state
  // This is where you might:
  // - Clean up test databases
  // - Remove test data
  // - Stop test services

  // Example: Clean up environment variables
  delete process.env.TEST_MODE;
  delete process.env.NODE_ENV;

  console.log('✅ Global test teardown completed');
}

export default globalTeardown;