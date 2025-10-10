#!/usr/bin/env node

/**
 * Simple sync test to verify data flow from CukCuk to Directus
 * This script will test syncing a few sample records to ensure everything works
 */

const { CukCukClient } = require('@luutronghieu/cukcuk-api-client');
const axios = require('axios');
require('dotenv').config();

// Configuration
const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logSection(message) {
  log(`\n=== ${message} ===`, colors.cyan);
}

// Directus API client
const directus = axios.create({
  baseURL: DIRECTUS_URL,
  headers: {
    'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// CukCuk client
const cukcukConfig = {
  secretKey: process.env.CUKCUK_SECRET_KEY,
};

// Sync branches
async function syncBranches() {
  try {
    logSection('Syncing Branches from CukCuk to Directus');

    // Initialize CukCuk client
    const client = new CukCukClient(cukcukConfig);

    // Authenticate
    logInfo('Authenticating with CukCuk...');
    const loginResponse = await client.account.login({
      Domain: process.env.CUKCUK_DOMAIN,
      AppId: process.env.CUKCUK_APP_ID,
      LoginTime: new Date().toISOString(),
    });
    logSuccess('CukCuk authentication successful');

    // Get branches from CukCuk
    logInfo('Fetching branches from CukCuk...');
    const branchesResult = await client.branches.getAll({ includeInactive: false });
    const branches = branchesResult.Data || branchesResult.data || branchesResult;
    const branchCount = Array.isArray(branches) ? branches.length : (branches?.length || 0);
    logSuccess(`Found ${branchCount} branches in CukCuk`);

    if (branchCount === 0) {
      logWarning('No branches found in CukCuk');
      return { created: 0, updated: 0, failed: 0 };
    }

    // Process only first 5 branches for testing
    const testBranches = Array.isArray(branches) ? branches.slice(0, 5) : [branches[0]];
    logInfo(`Processing first ${testBranches.length} branches for testing...`);

    let created = 0, updated = 0, failed = 0;

    for (const branch of testBranches) {
      try {
        // Check if branch already exists in Directus
        const existingResponse = await directus.get('/items/branches', {
          params: {
            filter: {
              external_id: { _eq: branch.Id }
            }
          }
        });

        const existing = existingResponse.data.data;
        const branchData = {
          name: branch.Name,
          code: branch.Code || branch.Id,
          description: `${branch.Name} - Imported from CukCuk`,
          external_id: branch.Id,
          external_source: 'cukcuk',
          is_active: !branch.Inactive,
          address: branch.Address || '',
          phone: branch.Phone || '',
          is_base_depot: branch.IsBaseDepot || false,
          is_chain_branch: branch.IsChainBranch || false,
          sort: 0
        };

        if (existing && existing.length > 0) {
          // Update existing branch
          logInfo(`Updating existing branch: ${branch.Name}`);
          await directus.patch(`/items/branches/${existing[0].id}`, branchData);
          updated++;
          logSuccess(`✓ Updated: ${branch.Name}`);
        } else {
          // Create new branch
          logInfo(`Creating new branch: ${branch.Name}`);
          await directus.post('/items/branches', branchData);
          created++;
          logSuccess(`✓ Created: ${branch.Name}`);
        }
      } catch (branchError) {
        failed++;
        logError(`Failed to sync branch "${branch.Name}": ${branchError.message}`);
      }
    }

    return { created, updated, failed };

  } catch (error) {
    logError(`Branch sync failed: ${error.message}`);
    return { created: 0, updated: 0, failed: 1 };
  }
}

// Sync categories
async function syncCategories() {
  try {
    logSection('Syncing Categories from CukCuk to Directus');

    // Initialize CukCuk client
    const client = new CukCukClient(cukcukConfig);

    // Authenticate
    await client.account.login({
      Domain: process.env.CUKCUK_DOMAIN,
      AppId: process.env.CUKCUK_APP_ID,
      LoginTime: new Date().toISOString(),
    });

    // Get categories from CukCuk
    logInfo('Fetching categories from CukCuk...');
    const categoriesResult = await client.categories.getList({
      includeInactive: false,
    });
    const categories = categoriesResult.Data || categoriesResult.data || categoriesResult;
    const categoryCount = Array.isArray(categories) ? categories.length : (categories?.length || 0);
    logSuccess(`Found ${categoryCount} categories in CukCuk`);

    if (categoryCount === 0) {
      logWarning('No categories found in CukCuk');
      return { created: 0, updated: 0, failed: 0 };
    }

    // Process only first 5 categories for testing
    const testCategories = Array.isArray(categories) ? categories.slice(0, 5) : [categories[0]];
    logInfo(`Processing first ${testCategories.length} categories for testing...`);

    let created = 0, updated = 0, failed = 0;

    for (const category of testCategories) {
      try {
        // Check if category already exists in Directus
        const existingResponse = await directus.get('/items/categories', {
          params: {
            filter: {
              external_id: { _eq: category.Id }
            }
          }
        });

        const existing = existingResponse.data.data;
        const categoryData = {
          name: category.Name,
          code: category.Code || category.Id,
          description: category.Description || `${category.Name} - Imported from CukCuk`,
          external_id: category.Id,
          external_source: 'cukcuk',
          is_active: !category.Inactive,
          sort: 0
        };

        if (existing && existing.length > 0) {
          // Update existing category
          logInfo(`Updating existing category: ${category.Name}`);
          await directus.patch(`/items/categories/${existing[0].id}`, categoryData);
          updated++;
          logSuccess(`✓ Updated: ${category.Name}`);
        } else {
          // Create new category
          logInfo(`Creating new category: ${category.Name}`);
          await directus.post('/items/categories', categoryData);
          created++;
          logSuccess(`✓ Created: ${category.Name}`);
        }
      } catch (categoryError) {
        failed++;
        logError(`Failed to sync category "${category.Name}": ${categoryError.message}`);
      }
    }

    return { created, updated, failed };

  } catch (error) {
    logError(`Category sync failed: ${error.message}`);
    return { created: 0, updated: 0, failed: 1 };
  }
}

// Create sync log
async function createSyncLog(syncType, status, stats) {
  try {
    const syncLog = {
      sync_type: syncType,
      source: 'cukcuk',
      status: status,
      records_processed: stats.created + stats.updated + stats.failed,
      records_created: stats.created,
      records_updated: stats.updated,
      records_failed: stats.failed,
      error_details: stats.failed > 0 ? { message: 'Some records failed to sync' } : null
    };

    await directus.post('/items/sync_logs', syncLog);
    logSuccess(`Sync log created for ${syncType}`);
  } catch (error) {
    logError(`Failed to create sync log: ${error.message}`);
  }
}

// Main test function
async function runSyncTest() {
  log('SOL eMenu - CukCuk to Directus Sync Test', colors.cyan);
  log('=========================================', colors.cyan);

  // Test connections
  try {
    logInfo('Testing Directus connection...');
    const response = await directus.get('/server/info');
    logSuccess(`✓ Connected to Directus: ${response.data.project?.project_name || 'SOL Membership ID'}`);
  } catch (error) {
    logError(`Directus connection failed: ${error.message}`);
    return;
  }

  // Sync branches
  const branchStats = await syncBranches();
  await createSyncLog('branches', branchStats.failed > 0 ? 'partial' : 'completed', branchStats);

  // Sync categories
  const categoryStats = await syncCategories();
  await createSyncLog('categories', categoryStats.failed > 0 ? 'partial' : 'completed', categoryStats);

  // Summary
  logSection('Sync Test Summary');
  logSuccess(`Branches: ${branchStats.created} created, ${branchStats.updated} updated, ${branchStats.failed} failed`);
  logSuccess(`Categories: ${categoryStats.created} created, ${categoryStats.updated} updated, ${categoryStats.failed} failed`);

  const totalCreated = branchStats.created + categoryStats.created;
  const totalUpdated = branchStats.updated + categoryStats.updated;
  const totalFailed = branchStats.failed + categoryStats.failed;

  if (totalFailed === 0) {
    logSuccess(`🎉 Sync test completed successfully!`);
    logInfo(`Total: ${totalCreated} created, ${totalUpdated} updated, ${totalFailed} failed`);
    logInfo('You can now run the full sync job with confidence.');
  } else {
    logWarning(`Sync test completed with ${totalFailed} errors.`);
    logInfo('Check the sync logs in Directus for details.');
  }
}

// Run the test
if (require.main === module) {
  runSyncTest().catch(error => {
    logError(`Sync test failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { runSyncTest };