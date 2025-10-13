import { chromium } from 'playwright';

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

async function runTests() {
  console.log('🚀 Starting authentication and link testing...\n');
  
  let browser;
  let context;
  let page;
  
  try {
    // Launch browser
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    
    // Test 1: Authentication
    console.log('🔐 Testing authentication with admin credentials...');
    
    // Navigate to login page
    await page.goto(`${BASE_URL}/auth/login`);
    
    // Wait for page to load
    await page.waitForSelector('h2');
    const loginTitle = await page.textContent('h2');
    console.log(`  Login page title: ${loginTitle}`);
    
    // Fill in login form
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    
    // Check current URL
    const currentUrl = page.url();
    console.log(`  Current URL after login: ${currentUrl}`);
    
    // Check if we're on the hub page or still on login
    if (currentUrl.includes('/hub')) {
      // Verify successful login
      const dashboardTitle = await page.textContent('h1');
      console.log(`  Dashboard title: ${dashboardTitle}`);
      
      if (dashboardTitle && dashboardTitle.includes('Dashboard')) {
        console.log('✅ Authentication successful');
      } else {
        // Check for error messages
        const errorElement = await page.locator('.text-red-800, .error-message').first();
        if (await errorElement.count() > 0) {
          const errorMessage = await errorElement.textContent();
          console.log(`  Error message: ${errorMessage}`);
        }
        
        // Take a screenshot for debugging
        await page.screenshot({ path: 'test-results/screenshots/dashboard-error.png' });
        console.log('❌ Authentication failed - Dashboard not loaded correctly');
        return;
      }
    } else if (currentUrl.includes('/auth/login')) {
      // Still on login page, check for error messages
      const errorElement = await page.locator('.text-red-800, .error-message').first();
      if (await errorElement.count() > 0) {
        const errorMessage = await errorElement.textContent();
        console.log(`  Login error: ${errorMessage}`);
      } else {
        console.log('  Login failed but no error message shown');
      }
      
      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-results/screenshots/login-error.png' });
      console.log('❌ Authentication failed - Still on login page');
      return;
    } else {
      // Unexpected URL
      console.log(`❌ Authentication failed - Redirected to unexpected URL: ${currentUrl}`);
      return;
    }
    
    // Get authentication cookies for subsequent tests
    const cookies = await context.cookies();
    
    // Test 2: Check all hub portal links for 404 errors
    console.log('\n🔍 Checking all hub portal links for 404 errors...');
    
    const results = [];
    
    for (const route of HUB_ROUTES) {
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
      }
    }
    
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
    
    // Test 3: Check navigation links on hub dashboard
    console.log('\n🔗 Checking navigation links on hub dashboard...');
    
    // Navigate back to hub
    await page.goto(`${BASE_URL}/hub`);
    
    // Wait for page to load
    await page.waitForSelector('h1');
    
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
        const newPage = await context.newPage();
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
    
    const successfulLinks = linkResults.filter(r => r.success);
    const failedLinks = linkResults.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successfulLinks.length}`);
    console.log(`❌ Failed: ${failedLinks.length}`);
    
    if (failedLinks.length > 0) {
      console.log('\n❌ Failed Links:');
      failedLinks.forEach(link => {
        console.log(`  - ${link.href}: ${link.error} (${link.status})`);
      });
    }
    
    // Final summary
    console.log('\n🎉 All tests completed!');
    console.log('====================');
    
    const totalSuccessful = successful.length + successfulLinks.length;
    const totalFailed = failed.length + failedLinks.length;
    
    console.log(`Total successful: ${totalSuccessful}`);
    console.log(`Total failed: ${totalFailed}`);
    
    if (totalFailed === 0) {
      console.log('✅ All tests passed! The admin user can authenticate and all hub portal links are working correctly.');
    } else {
      console.log(`❌ ${totalFailed} test(s) failed. Please check the errors above.`);
    }
    
  } catch (error) {
    console.error('Test execution failed:', error);
  } finally {
    // Clean up
    if (page) await page.close();
    if (context) await context.close();
    if (browser) await browser.close();
  }
}

// Run the tests
runTests().catch(console.error);