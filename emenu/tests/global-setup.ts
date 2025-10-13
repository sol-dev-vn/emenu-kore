import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');

  // Set up test database or other global state
  // This is where you might:
  // - Seed test data
  // - Set up test databases
  // - Configure global test services

  // Example: Set up test environment variables
  process.env.TEST_MODE = 'true';
  process.env.NODE_ENV = 'test';

  // Example: Wait for services to be ready
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for the application to be ready
    await page.goto(config.webServer?.url || 'http://localhost:3520');
    await page.waitForSelector('body', { timeout: 30000 });
    console.log('✅ Application is ready for testing');
  } catch (error) {
    console.error('❌ Failed to connect to application:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }

  console.log('✅ Global test setup completed');
}

export default globalSetup;