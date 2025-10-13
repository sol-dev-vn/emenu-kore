import { chromium } from '@playwright/test';
import type { FullConfig, Browser, BrowserContext, Page } from '@playwright/test';
import path from 'path';

// Configuration constants for better maintainability
const CONFIG = {
  APP_READY_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000,
  HEALTH_CHECK_ENDPOINT: '/api/health',
  ENVIRONMENT: {
    TEST_MODE: 'true',
    NODE_ENV: 'test',
    LOG_LEVEL: process.env.CI ? 'error' : 'info'
  }
} as const;

// Test state management interface
interface TestState {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  startTime: number;
}

/**
 * Validates the application is ready for testing
 * @param page - Playwright page instance
 * @param config - Playwright configuration
 */
async function validateApplicationReadiness(page: Page, config: FullConfig): Promise<void> {
  const baseUrl = config.webServer?.url || 'http://localhost:3520';
  
  // First check if the main page loads
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  
  // Check for a health endpoint if available
  try {
    const response = await page.request.get(`${baseUrl}${CONFIG.HEALTH_CHECK_ENDPOINT}`, {
      timeout: 5000
    });
    if (!response.ok()) {
      console.warn(`Health check failed with status: ${response.status()}`);
    }
  } catch (error) {
    // Health endpoint might not exist, which is acceptable
    console.log('Health check endpoint not available, continuing with basic readiness check');
  }
  
  // Wait for critical elements to be available
  await page.waitForSelector('body', { 
    timeout: CONFIG.APP_READY_TIMEOUT,
    state: 'attached'
  });
  
  // Additional check for app-specific elements
  const criticalSelectors = [
    '[data-testid="app-root"]',
    '#app',
    '.app-container',
    'main'
  ];
  
  for (const selector of criticalSelectors) {
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
      console.log(`✅ Found critical element: ${selector}`);
      break; // Found at least one critical element
    } catch {
      // Continue trying other selectors
    }
  }
}

/**
 * Sets up test environment variables
 */
function setupEnvironmentVariables(): void {
  Object.entries(CONFIG.ENVIRONMENT).forEach(([key, value]) => {
    process.env[key] = value;
    console.log(`🔧 Set environment variable: ${key}=${value}`);
  });
}

/**
 * Verifies that Playwright browsers are installed
 * @throws Error if browsers are not installed
 */
async function verifyBrowserInstallation(): Promise<void> {
  try {
    const { execSync } = await import('child_process');
    
    // Try to get browser information to verify installation
    execSync('npx playwright install --dry-run chromium', { stdio: 'pipe' });
    console.log('✅ Playwright browsers verified');
  } catch (error) {
    throw new Error(
      'Playwright browsers are not installed. Please run:\n' +
      '  npx playwright install\n' +
      'This will download the necessary browser binaries for testing.'
    );
  }
}

/**
 * Cleans up browser resources with error handling
 * @param testState - Current test state
 */
async function cleanupBrowserResources(testState: TestState): Promise<void> {
  // Cleanup page
  if (testState.page) {
    try {
      await testState.page.close();
      console.log('🧹 Cleaned up page');
    } catch (error) {
      console.error('❌ Failed to cleanup page:', error);
    }
  }
  
  // Cleanup context
  if (testState.context) {
    try {
      await testState.context.close();
      console.log('🧹 Cleaned up context');
    } catch (error) {
      console.error('❌ Failed to cleanup context:', error);
    }
  }
  
  // Cleanup browser
  if (testState.browser) {
    try {
      await testState.browser.close();
      console.log('🧹 Cleaned up browser');
    } catch (error) {
      console.error('❌ Failed to cleanup browser:', error);
    }
  }
}

/**
 * Main global setup function with improved error handling and logging
 * @param config - Playwright configuration
 */
async function globalSetup(config: FullConfig): Promise<void> {
  const testState: TestState = { startTime: Date.now() };
  console.log('🚀 Starting global test setup...');
  
  try {
    // Verify browser installation first
    await verifyBrowserInstallation();
    
    // Set up environment variables
    setupEnvironmentVariables();
    
    // Initialize browser with better configuration
    testState.browser = await chromium.launch({
      headless: process.env.CI === 'true',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    testState.context = await testState.browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'playwright-test-setup'
    });
    
    testState.page = await testState.context.newPage();
    
    // Add error handling for page errors
    testState.page.on('pageerror', (error) => {
      console.error('❌ Page error during setup:', error);
    });
    
    // Add console logging from the page
    testState.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error('📄 Page console error:', msg.text());
      } else if (process.env.LOG_LEVEL === 'debug') {
        console.log(`📄 Page console [${msg.type()}]:`, msg.text());
      }
    });
    
    // Retry mechanism for application readiness
    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
      try {
        console.log(`🔍 Checking application readiness (attempt ${attempt}/${CONFIG.MAX_RETRIES})`);
        await validateApplicationReadiness(testState.page, config);
        console.log('✅ Application is ready for testing');
        break;
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Application readiness check failed (attempt ${attempt}/${CONFIG.MAX_RETRIES}):`, error);
        
        if (attempt < CONFIG.MAX_RETRIES) {
          console.log(`⏳ Waiting ${CONFIG.RETRY_DELAY}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
        }
      }
    }
    
    if (lastError && testState.page.url() === 'about:blank') {
      throw new Error(`Failed to connect to application after ${CONFIG.MAX_RETRIES} attempts: ${lastError.message}`);
    }
    
    // Store global state for tests
    (global as any).testState = {
      browser: testState.browser,
      context: testState.context,
      setupTime: Date.now() - testState.startTime
    };
    
    console.log(`✅ Global test setup completed in ${Date.now() - testState.startTime}ms`);
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    
    // Ensure cleanup on failure
    await cleanupBrowserResources(testState);
    
    // Provide more descriptive error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check for specific Playwright browser installation issue
    if (errorMessage.includes("Executable doesn't exist") || errorMessage.includes("ms-playwright")) {
      throw new Error(
        `Playwright browsers not installed. Please run: npx playwright install\n` +
        `Original error: ${errorMessage}`
      );
    }
    
    throw new Error(`Global setup failed: ${errorMessage}`);
  } finally {
    // Always cleanup resources after setup is complete
    await cleanupBrowserResources(testState);
  }
}

export default globalSetup;