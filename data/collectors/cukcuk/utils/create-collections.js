#!/usr/bin/env node

/**
 * Script to create Directus collections based on the data dictionary
 * This will create all the necessary collections for the SOL eMenu platform
 */

const axios = require('axios');
require('dotenv').config();

// Directus configuration
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

// Collection definitions based on data dictionary
const collections = [
  {
    name: 'branches',
    collection: {
      collection: 'branches',
      meta: {
        icon: 'store',
        note: 'Restaurant branch management with CukCuk integration',
        hidden: false,
        singleton: false,
        display_template: '{{name}} - {{code}}',
        color: '#7B1516'
      },
      schema: {
        name: 'branches'
      }
    },
    fields: [
      {
        field: 'name',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: true,
          sort: true,
          width: 'full'
        },
        schema: {
          name: 'name',
          is_primary: false,
          length: 255,
          default_value: null
        }
      },
      {
        field: 'code',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: true,
          sort: true,
          width: 'full',
          note: 'Unique branch code'
        },
        schema: {
          name: 'code',
          is_primary: false,
          length: 100,
          default_value: null,
          unique: true
        }
      },
      {
        field: 'description',
        type: 'text',
        meta: {
          interface: 'input-rich-text',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'full'
        },
        schema: {
          name: 'description',
          is_primary: false,
          default_value: null
        }
      },
      {
        field: 'external_id',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          note: 'CukCuk branch ID'
        },
        schema: {
          name: 'external_id',
          is_primary: false,
          length: 100,
          default_value: null
        }
      },
      {
        field: 'external_source',
        type: 'string',
        meta: {
          interface: 'dropdown',
          options: {
            choices: [
              { text: 'CukCuk', value: 'cukcuk' },
              { text: 'Manual', value: 'manual' }
            ]
          },
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 'cukcuk'
        },
        schema: {
          name: 'external_source',
          is_primary: false,
          length: 50,
          default_value: 'cukcuk'
        }
      },
      {
        field: 'is_active',
        type: 'boolean',
        meta: {
          interface: 'toggle',
          options: {},
          display: 'boolean',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: true
        },
        schema: {
          name: 'is_active',
          is_primary: false,
          default_value: true
        }
      },
      {
        field: 'address',
        type: 'text',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'full'
        },
        schema: {
          name: 'address',
          is_primary: false,
          default_value: null
        }
      },
      {
        field: 'phone',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half'
        },
        schema: {
          name: 'phone',
          is_primary: false,
          length: 50,
          default_value: null
        }
      },
      {
        field: 'email',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half'
        },
        schema: {
          name: 'email',
          is_primary: false,
          length: 255,
          default_value: null
        }
      },
      {
        field: 'sort',
        type: 'integer',
        meta: {
          interface: 'numeric',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 0
        },
        schema: {
          name: 'sort',
          is_primary: false,
          data_type: 'integer',
          default_value: 0
        }
      }
    ]
  },
  {
    name: 'categories',
    collection: {
      collection: 'categories',
      meta: {
        icon: 'category',
        note: 'Menu categories for food item organization',
        hidden: false,
        singleton: false,
        display_template: '{{name}}',
        color: '#FF6B35'
      },
      schema: {
        name: 'categories'
      }
    },
    fields: [
      {
        field: 'name',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: true,
          sort: true,
          width: 'full'
        },
        schema: {
          name: 'name',
          is_primary: false,
          length: 255,
          default_value: null
        }
      },
      {
        field: 'code',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: true,
          sort: true,
          width: 'full',
          note: 'Unique category code'
        },
        schema: {
          name: 'code',
          is_primary: false,
          length: 100,
          default_value: null,
          unique: true
        }
      },
      {
        field: 'description',
        type: 'text',
        meta: {
          interface: 'input-rich-text',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'full'
        },
        schema: {
          name: 'description',
          is_primary: false,
          default_value: null
        }
      },
      {
        field: 'external_id',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          note: 'CukCuk category ID'
        },
        schema: {
          name: 'external_id',
          is_primary: false,
          length: 100,
          default_value: null
        }
      },
      {
        field: 'external_source',
        type: 'string',
        meta: {
          interface: 'dropdown',
          options: {
            choices: [
              { text: 'CukCuk', value: 'cukcuk' },
              { text: 'Manual', value: 'manual' }
            ]
          },
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 'cukcuk'
        },
        schema: {
          name: 'external_source',
          is_primary: false,
          length: 50,
          default_value: 'cukcuk'
        }
      },
      {
        field: 'is_active',
        type: 'boolean',
        meta: {
          interface: 'toggle',
          options: {},
          display: 'boolean',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: true
        },
        schema: {
          name: 'is_active',
          is_primary: false,
          default_value: true
        }
      },
      {
        field: 'sort',
        type: 'integer',
        meta: {
          interface: 'numeric',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 0
        },
        schema: {
          name: 'sort',
          is_primary: false,
          data_type: 'integer',
          default_value: 0
        }
      }
    ]
  },
  {
    name: 'sync_logs',
    collection: {
      collection: 'sync_logs',
      meta: {
        icon: 'sync',
        note: 'Record of all CukCuk API synchronization activities',
        hidden: false,
        singleton: false,
        display_template: '{{sync_type}} - {{status}} - {{started_at}}',
        color: '#0066CC'
      },
      schema: {
        name: 'sync_logs'
      }
    },
    fields: [
      {
        field: 'sync_type',
        type: 'string',
        meta: {
          interface: 'dropdown',
          options: {
            choices: [
              { text: 'Branches', value: 'branches' },
              { text: 'Categories', value: 'categories' },
              { text: 'Menu Items', value: 'menu_items' },
              { text: 'Tables', value: 'tables' },
              { text: 'Full Sync', value: 'full' }
            ]
          },
          display: 'raw',
          readonly: false,
          hidden: false,
          required: true,
          width: 'half'
        },
        schema: {
          name: 'sync_type',
          is_primary: false,
          length: 50,
          default_value: null
        }
      },
      {
        field: 'source',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 'cukcuk'
        },
        schema: {
          name: 'source',
          is_primary: false,
          length: 50,
          default_value: 'cukcuk'
        }
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          interface: 'dropdown',
          options: {
            choices: [
              { text: 'Running', value: 'running' },
              { text: 'Completed', value: 'completed' },
              { text: 'Failed', value: 'failed' },
              { text: 'Partial', value: 'partial' }
            ]
          },
          display: 'raw',
          readonly: false,
          hidden: false,
          required: true,
          width: 'half'
        },
        schema: {
          name: 'status',
          is_primary: false,
          length: 20,
          default_value: 'running'
        }
      },
      {
        field: 'records_processed',
        type: 'integer',
        meta: {
          interface: 'numeric',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 0
        },
        schema: {
          name: 'records_processed',
          is_primary: false,
          data_type: 'integer',
          default_value: 0
        }
      },
      {
        field: 'records_created',
        type: 'integer',
        meta: {
          interface: 'numeric',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 0
        },
        schema: {
          name: 'records_created',
          is_primary: false,
          data_type: 'integer',
          default_value: 0
        }
      },
      {
        field: 'records_updated',
        type: 'integer',
        meta: {
          interface: 'numeric',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 0
        },
        schema: {
          name: 'records_updated',
          is_primary: false,
          data_type: 'integer',
          default_value: 0
        }
      },
      {
        field: 'records_failed',
        type: 'integer',
        meta: {
          interface: 'numeric',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 0
        },
        schema: {
          name: 'records_failed',
          is_primary: false,
          data_type: 'integer',
          default_value: 0
        }
      },
      {
        field: 'error_details',
        type: 'json',
        meta: {
          interface: 'code',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'full',
          note: 'Error details and stack traces'
        },
        schema: {
          name: 'error_details',
          is_primary: false,
          default_value: null
        }
      }
    ]
  }
];

// Create a collection
async function createCollection(collectionData) {
  try {
    logInfo(`Creating collection: ${collectionData.name}`);

    // Create the collection
    const collectionResponse = await directus.post('/collections', collectionData.collection);
    logSuccess(`Collection '${collectionData.name}' created successfully`);

    // Create fields
    for (const field of collectionData.fields) {
      try {
        logInfo(`Creating field: ${field.field} in collection ${collectionData.name}`);
        await directus.post(`/fields/${collectionData.name}`, field);
        logSuccess(`Field '${field.field}' created successfully`);
      } catch (fieldError) {
        logError(`Failed to create field '${field.field}': ${fieldError.message}`);
        // Continue with other fields even if one fails
      }
    }

    return true;
  } catch (error) {
    logError(`Failed to create collection '${collectionData.name}': ${error.message}`);
    if (error.response?.data) {
      logError(`Error details: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

// Main execution function
async function createAllCollections() {
  logSection('Creating Directus Collections for SOL eMenu');

  if (!DIRECTUS_URL || !DIRECTUS_API_TOKEN) {
    logError('Missing Directus configuration. Please check DIRECTUS_URL and DIRECTUS_API_TOKEN in .env file.');
    process.exit(1);
  }

  // Test connection first
  try {
    logInfo('Testing Directus connection...');
    const response = await directus.get('/server/info');
    logSuccess(`Connected to Directus: ${response.data.project?.project_name || 'Unknown'}`);
  } catch (error) {
    logError(`Failed to connect to Directus: ${error.message}`);
    process.exit(1);
  }

  let successCount = 0;
  let totalCount = collections.length;

  for (const collection of collections) {
    const success = await createCollection(collection);
    if (success) {
      successCount++;
    }
    // Add a small delay between collections to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  logSection('Summary');
  logSuccess(`Successfully created ${successCount} out of ${totalCount} collections`);

  if (successCount === totalCount) {
    logSuccess('🎉 All collections created successfully!');
    logInfo('You can now run the CukCuk sync job to populate the collections with data.');
  } else {
    logError('Some collections failed to create. Please check the errors above.');
  }
}

// Run the script
if (require.main === module) {
  createAllCollections().catch(error => {
    logError(`Script failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { createAllCollections };