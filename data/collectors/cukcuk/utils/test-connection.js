#!/usr/bin/env node

/**
 * Test script for CukCuk and Directus API connections
 * This script will help us diagnose connection issues before running the full sync
 */

const path = require('path');
const dotenv = require('dotenv');
// Load env from project root, fallback to cukcuk collector directory
const rootEnv = dotenv.config();
if (rootEnv.error) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

const { CukCukClient } = require('@luutronghieu/cukcuk-api-client');
const axios = require('axios');

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

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logSection(message) {
  log(`\n=== ${message} ===`, colors.cyan);
}

// Configuration check
function checkConfiguration() {
  logSection('Configuration Check');

  const requiredVars = [
    'CUKCUK_DOMAIN',
    'CUKCUK_APP_ID',
    'CUKCUK_SECRET_KEY',
    'CUKCUK_COMPANY_CODE'
  ];

  const optionalVars = [
    'DIRECTUS_URL',
    'DIRECTUS_API_TOKEN'
  ];

  let missingRequired = [];
  let missingOptional = [];

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingRequired.push(varName);
    }
  });

  optionalVars.forEach(varName => {
    if (!process.env[varName]) {
      missingOptional.push(varName);
    }
  });

  if (missingRequired.length > 0) {
    logError(`Missing required environment variables: ${missingRequired.join(', ')}`);
    return false;
  }

  if (missingOptional.length > 0) {
    logWarning(`Missing optional environment variables: ${missingOptional.join(', ')}`);
  }

  logSuccess('Configuration check passed');
  return true;
}

// Test CukCuk API connection
async function testCukCukConnection() {
  logSection('Testing CukCuk API Connection');

  try {
    logInfo('Initializing CukCuk API client...');

    const cukcukConfig = {
      appId: process.env.CUKCUK_APP_ID,
      domain: process.env.CUKCUK_DOMAIN,
      secretKey: process.env.CUKCUK_SECRET_KEY,
      companyCode: process.env.CUKCUK_COMPANY_CODE,
      baseUrl: process.env.CUKCUK_API_BASE_URL || 'https://graphapi.cukcuk.vn'
    };

    logInfo('Configuration:');
    Object.entries(cukcukConfig).forEach(([key, value]) => {
      if (key === 'secretKey') {
        logInfo(`  ${key}: ${value ? '***configured***' : 'not set'}`);
      } else {
        logInfo(`  ${key}: ${value || 'not set'}`);
      }
    });

    const client = new CukCukClient(cukcukConfig);

    logInfo('Attempting authentication...');
    const loginResponse = await client.account.login({
      Domain: process.env.CUKCUK_DOMAIN,
      AppId: process.env.CUKCUK_APP_ID,
      LoginTime: new Date().toISOString(),
    });
    logSuccess('CukCuk authentication successful');

    // Test API calls
    logInfo('Testing API calls...');

    try {
      logInfo('Fetching branches...');
      const branchesResult = await client.branches.getAll({ includeInactive: false });
      const branches = branchesResult.Data || branchesResult.data || branchesResult;
      const branchCount = Array.isArray(branches) ? branches.length : (branches?.length || 0);
      logSuccess(`Found ${branchCount} branches`);

      if (branchCount > 0) {
        const firstBranch = Array.isArray(branches) ? branches[0] : branches[0];
        logInfo('Sample branch:', {
          id: firstBranch.Id,
          name: firstBranch.Name,
          code: firstBranch.Code
        });
      }
    } catch (error) {
      logError(`Failed to fetch branches: ${error.message}`);
    }

    try {
      logInfo('Fetching categories...');
      const categoriesResult = await client.categories.getList({
        includeInactive: false,
      });
      const categories = categoriesResult.Data || categoriesResult.data || categoriesResult;
      const categoryCount = Array.isArray(categories) ? categories.length : (categories?.length || 0);
      logSuccess(`Found ${categoryCount} categories`);

      if (categoryCount > 0) {
        const firstCategory = Array.isArray(categories) ? categories[0] : categories[0];
        logInfo('Sample category:', {
          id: firstCategory.Id,
          name: firstCategory.Name,
          code: firstCategory.Code
        });
      }
    } catch (error) {
      logError(`Failed to fetch categories: ${error.message}`);
    }

    return true;

  } catch (error) {
    logError(`CukCuk connection failed: ${error.message}`);
    if (error.stack) {
      logInfo('Stack trace:', error.stack);
    }
    return false;
  }
}

// Test Directus API connection
async function testDirectusConnection() {
  logSection('Testing Directus API Connection');

  const directusUrl = process.env.DIRECTUS_URL;
  const directusToken = process.env.DIRECTUS_API_TOKEN;

  if (!directusUrl) {
    logWarning('DIRECTUS_URL not configured, skipping Directus test');
    return false;
  }

  if (!directusToken) {
    logWarning('DIRECTUS_API_TOKEN not configured, testing without authentication');
  }

  try {
    logInfo(`Testing connection to: ${directusUrl}`);

    // Test server info
    try {
      const response = await axios.get(`${directusUrl}/server/info`, {
        headers: directusToken ? {
          'Authorization': `Bearer ${directusToken}`
        } : {},
        timeout: 10000
      });

      logSuccess('Directus server info retrieved successfully');
      logInfo('Server info:', {
        project: response.data.project?.project_name || 'Unknown',
        version: response.data.project?.version || 'Unknown',
        environment: response.data.server?.environment || 'Unknown'
      });
    } catch (error) {
      logError(`Failed to get server info: ${error.message}`);
      if (error.response?.status === 401) {
        logError('Authentication failed - check your DIRECTUS_API_TOKEN');
      }
      return false;
    }

    // Test collections access (if token is provided)
    if (directusToken) {
      try {
        const response = await axios.get(`${directusUrl}/items/branches`, {
          headers: {
            'Authorization': `Bearer ${directusToken}`
          },
          params: {
            limit: 1
          },
          timeout: 10000
        });

        logSuccess('Directus branches collection access successful');
        logInfo(`Found ${response.data.data.length} branches in collection`);
      } catch (error) {
        logError(`Failed to access branches collection: ${error.message}`);
        if (error.response?.status === 403) {
          logError('Permission denied - check token permissions');
        }
        return false;
      }
    } else {
      logWarning('Cannot test collection access without authentication token');
    }

    return true;

  } catch (error) {
    logError(`Directus connection failed: ${error.message}`);
    return false;
  }
}

// Main test function
async function runTests() {
  log('SOL eMenu - CukCuk Data Sync Connection Test', colors.cyan);
  log('===============================================', colors.cyan);

  const configOk = checkConfiguration();
  if (!configOk) {
    logError('Configuration check failed. Please set up the required environment variables.');
    process.exit(1);
  }

  const cukcukOk = await testCukCukConnection();
  const directusOk = await testDirectusConnection();

  logSection('Test Summary');

  if (cukcukOk) {
    logSuccess('CukCuk API connection: ✅ PASSED');
  } else {
    logError('CukCuk API connection: ❌ FAILED');
  }

  if (directusOk) {
    logSuccess('Directus API connection: ✅ PASSED');
  } else {
    logError('Directus API connection: ❌ FAILED');
  }

  if (cukcukOk && directusOk) {
    logSuccess('\n🎉 All connections successful! You can run the sync job now.');
    logInfo('Run: npm start or node sync.js');
  } else {
    logError('\n❌ Some connections failed. Please fix the issues above before running the sync job.');
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  runTests().catch(error => {
    logError(`Test script failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { runTests };