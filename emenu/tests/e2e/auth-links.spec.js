const { test, expect } = require('@playwright/test');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3520';
const ADMIN_EMAIL = 'dev@sol.com.vn';
const ADMIN_PASSWORD = 'adminuser';

// List of all hub portal routes to check
const HUB_ROUTES = [
  '/hub',
  '/hub/tables',
  '/hub/qr-codes',
  '/hub/qr-analytics',
  '/hub/menu',
  '/hub/reports',
  '/hub/profile',
  '/hub/settings'
];

test.describe('Authentication and Link Testing', () => {
  let authCookies;

  test.beforeAll(async ({ browser }) => {
    console.log('Starting authentication and link testing...');
  });

  test('should authenticate with admin credentials', async ({ page, context }) => {
    console.log(`\n🔐 Testing authentication with ${ADMIN_EMAIL}`);
    
    // Navigate to login page
    await page.goto(`${BASE_URL}/auth/login`);
    
    // Wait for page to load
    await expect(page.locator('h2')).toContainText('Staff Hub Login');
    
    // Fill in login form
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to hub
    await page.waitForURL(`${BASE_URL}/hub`);
    
    // Verify successful login
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Get authentication cookies for subsequent tests
    authCookies = await context.cookies();
    
    console.log('✅ Authentication successful');
  });

  test('should check all hub portal links for 404 errors', async ({ browser }) => {
    console.log('\n🔍 Checking all hub portal links for 404 errors...');
    
    const results = [];
    
    // Create a new context with auth cookies
    const context = await browser.newContext();
    await context.addCookies(authCookies);
    
    for (const route of HUB_ROUTES) {
      const page = await context.newPage();
      const url = `${BASE_URL}${route}`;
      
      try {
        console.log(`  Checking ${route}...`);
        
        // Navigate to the route
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
        
        // Check response status
        const status = response.status();
        
        if (status === 404) {
          console.log(`  ❌ ${route} returned 404 Not Found`);
          results.push({ route, status, success: false, error: '404 Not Found' });
        } else if (status >= 400) {
          console.log(`  ⚠️ ${route} returned ${status} ${response.statusText()}`);
          results.push({ route, status, success: false, error: `${status} ${response.statusText()}` });
        } else {
          // Check for common 404 indicators in the page content
          const has404Content = await page.locator('text=/404|not found|page not found/i').count() > 0;
          
          if (has404Content) {
            console.log(`  ❌ ${route} contains 404 content despite ${status} status`);
            results.push({ route, status, success: false, error: 'Page contains 404 content' });
          } else {
            console.log(`  ✅ ${route} is accessible (${status})`);
            results.push({ route, status, success: true });
          }
        }
        
        // Take screenshot for failed routes
        if (status >= 400 || await page.locator('text=/404|not found|page not found/i').count() > 0) {
          await page.screenshot({ path: `test-results/screenshots/${route.replace(/\//g, '-')}-error.png` });
        }
        
      } catch (error) {
        console.log(`  ❌ ${route} failed to load: ${error.message}`);
        results.push({ route, status: 'Error', success: false, error: error.message });
        
        // Take screenshot for errors
        try {
          await page.screenshot({ path: `test-results/screenshots/${route.replace(/\//g, '-')}-error.png` });
        } catch (screenshotError) {
          console.log(`    Could not take screenshot: ${screenshotError.message}`);
        }
      } finally {
        await page.close();
      }
    }
    
    await context.close();
    
    // Print summary
    console.log('\n📊 Link Test Summary:');
    console.log('==================');
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    
    if (failed.length > 0) {
      console.log('\n❌ Failed Routes:');
      failed.forEach(route => {
        console.log(`  - ${route.route}: ${route.error} (${route.status})`);
      });
    }
    
    // Assert that all routes should be accessible
    expect(failed.length).toBe(0);
  });

  test('should check navigation links on hub dashboard', async ({ page }) => {
    console.log('\n🔗 Checking navigation links on hub dashboard...');
    
    // Navigate to hub with authentication
    await page.goto(`${BASE_URL}/hub`);
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Find all navigation links
    const navLinks = await page.locator('nav a, .sidebar a, a[href*="/hub/"]').all();
    
    console.log(`Found ${navLinks.length} navigation links`);
    
    const linkResults = [];
    
    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      
      // Skip external links and anchors
      if (!href || href.startsWith('http') || href.startsWith('#')) {
        continue;
      }
      
      const fullUrl = href.startsWith('/') ? `${BASE_URL}${href}` : `${BASE_URL}/${href}`;
      
      try {
        console.log(`  Checking link: ${href}`);
        
        // Create a new page to check the link without affecting the current page
        const newPage = await page.context().newPage();
        const response = await newPage.goto(fullUrl, { waitUntil: 'domcontentloaded' });
        
        const status = response.status();
        
        if (status === 404) {
          console.log(`    ❌ Link returned 404 Not Found`);
          linkResults.push({ href, status, success: false, error: '404 Not Found' });
        } else if (status >= 400) {
          console.log(`    ⚠️ Link returned ${status} ${response.statusText()}`);
          linkResults.push({ href, status, success: false, error: `${status} ${response.statusText()}` });
        } else {
          console.log(`    ✅ Link is accessible (${status})`);
          linkResults.push({ href, status, success: true });
        }
        
        await newPage.close();
        
      } catch (error) {
        console.log(`    ❌ Link failed to load: ${error.message}`);
        linkResults.push({ href, status: 'Error', success: false, error: error.message });
      }
    }
    
    // Print summary
    console.log('\n📊 Navigation Link Test Summary:');
    console.log('===============================');
    
    const successful = linkResults.filter(r => r.success);
    const failed = linkResults.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    
    if (failed.length > 0) {
      console.log('\n❌ Failed Links:');
      failed.forEach(link => {
        console.log(`  - ${link.href}: ${link.error} (${link.status})`);
      });
    }
    
    // Assert that all navigation links should be accessible
    expect(failed.length).toBe(0);
  });

  test('should verify user session persists across hub pages', async ({ page }) => {
    console.log('\n🔄 Verifying user session persistence...');
    
    // Navigate to hub with authentication
    await page.goto(`${BASE_URL}/hub`);
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Check for user information on the dashboard
    const userDisplayName = await page.locator('text=/Welcome back/i').textContent();
    console.log(`  User is logged in: ${userDisplayName}`);
    
    // Navigate to tables page
    await page.click('a[href="/hub/tables"]');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify still logged in
    await expect(page.locator('h1')).toContainText('Table Management');
    
    // Navigate back to dashboard
    await page.click('a[href="/hub"]');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify still logged in
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    console.log('✅ User session persists across hub pages');
  });

  test.afterAll(async () => {
    console.log('\n🎉 All tests completed!');
  });
});