const { chromium } = require('playwright');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3520';

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
  console.log('🔍 Checking hub portal links for 404 errors...\n');
  
  let browser;
  let context;
  let page;
  
  try {
    // Launch browser
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    
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
    
    // Final summary
    console.log('\n🎉 Link checking completed!');
    console.log('========================');
    
    if (failed.length === 0) {
      console.log('✅ All hub portal links are working correctly.');
    } else {
      console.log(`❌ ${failed.length} link(s) failed. Please check the errors above.`);
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