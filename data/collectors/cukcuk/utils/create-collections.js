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
        field: 'started_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          options: {},
          display: 'datetime',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          note: 'When the sync operation started'
        },
        schema: {
          name: 'started_at',
          is_primary: false,
          default_value: null
        }
      },
      {
        field: 'completed_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          options: {},
          display: 'datetime',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          note: 'When the sync operation completed'
        },
        schema: {
          name: 'completed_at',
          is_primary: false,
          default_value: null
        }
      },
      {
        field: 'duration_seconds',
        type: 'integer',
        meta: {
          interface: 'numeric',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          note: 'Duration of sync operation in seconds'
        },
        schema: {
          name: 'duration_seconds',
          is_primary: false,
          data_type: 'integer',
          default_value: null
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
  },
  {
    name: 'tables',
    collection: {
      collection: 'tables',
      meta: {
        icon: 'table_restaurant',
        note: 'Restaurant tables with zone management',
        hidden: false,
        singleton: false,
        display_template: '{{name}} - {{zone_name}}',
        color: '#4CAF50'
      },
      schema: {
        name: 'tables'
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
          note: 'Unique table code'
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
          interface: 'input',
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
          note: 'CukCuk table ID'
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
        field: 'capacity',
        type: 'integer',
        meta: {
          interface: 'numeric',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 4
        },
        schema: {
          name: 'capacity',
          is_primary: false,
          data_type: 'integer',
          default_value: 4
        }
      },
      {
        field: 'zone_id',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          note: 'Zone/area ID'
        },
        schema: {
          name: 'zone_id',
          is_primary: false,
          length: 100,
          default_value: null
        }
      },
      {
        field: 'zone_name',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          note: 'Zone/area name'
        },
        schema: {
          name: 'zone_name',
          is_primary: false,
          length: 255,
          default_value: null
        }
      },
      {
        field: 'table_type',
        type: 'string',
        meta: {
          interface: 'dropdown',
          options: {
            choices: [
              { text: 'Standard', value: 'standard' },
              { text: 'Booth', value: 'booth' },
              { text: 'Private Room', value: 'private_room' },
              { text: 'Bar', value: 'bar' },
              { text: 'Outdoor', value: 'outdoor' }
            ]
          },
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 'standard'
        },
        schema: {
          name: 'table_type',
          is_primary: false,
          length: 50,
          default_value: 'standard'
        }
      },
      {
        field: 'shape',
        type: 'string',
        meta: {
          interface: 'dropdown',
          options: {
            choices: [
              { text: 'Rectangle', value: 'rectangle' },
              { text: 'Circle', value: 'circle' },
              { text: 'Square', value: 'square' },
              { text: 'Other', value: 'other' }
            ]
          },
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 'rectangle'
        },
        schema: {
          name: 'shape',
          is_primary: false,
          length: 20,
          default_value: 'rectangle'
        }
      },
      {
        field: 'position_x',
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
          name: 'position_x',
          is_primary: false,
          data_type: 'integer',
          default_value: 0
        }
      },
      {
        field: 'position_y',
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
          name: 'position_y',
          is_primary: false,
          data_type: 'integer',
          default_value: 0
        }
      },
      {
        field: 'width',
        type: 'integer',
        meta: {
          interface: 'numeric',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 80
        },
        schema: {
          name: 'width',
          is_primary: false,
          data_type: 'integer',
          default_value: 80
        }
      },
      {
        field: 'height',
        type: 'integer',
        meta: {
          interface: 'numeric',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 80
        },
        schema: {
          name: 'height',
          is_primary: false,
          data_type: 'integer',
          default_value: 80
        }
      },
      {
        field: 'rotation',
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
          name: 'rotation',
          is_primary: false,
          data_type: 'integer',
          default_value: 0
        }
      },
      {
        field: 'is_mergeable',
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
          name: 'is_mergeable',
          is_primary: false,
          default_value: true
        }
      },
      {
        field: 'is_reserved',
        type: 'boolean',
        meta: {
          interface: 'toggle',
          options: {},
          display: 'boolean',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: false
        },
        schema: {
          name: 'is_reserved',
          is_primary: false,
          default_value: false
        }
      },
      {
        field: 'is_available',
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
          name: 'is_available',
          is_primary: false,
          default_value: true
        }
      },
      {
        field: 'branch_id',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          note: 'Associated branch ID'
        },
        schema: {
          name: 'branch_id',
          is_primary: false,
          length: 100,
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
    name: 'menu_items',
    collection: {
      collection: 'menu_items',
      meta: {
        icon: 'restaurant_menu',
        note: 'Menu items with pricing and categorization',
        hidden: false,
        singleton: false,
        display_template: '{{name}} - {{price}} VND',
        color: '#FF9800'
      },
      schema: {
        name: 'menu_items'
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
          note: 'Unique menu item code'
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
          note: 'CukCuk menu item ID'
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
        field: 'price',
        type: 'decimal',
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
          name: 'price',
          is_primary: false,
          data_type: 'decimal',
          precision: 10,
          scale: 2,
          default_value: 0
        }
      },
      {
        field: 'category_code',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          note: 'Category code reference'
        },
        schema: {
          name: 'category_code',
          is_primary: false,
          length: 100,
          default_value: null
        }
      },
      {
        field: 'category_name',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          note: 'Category name reference'
        },
        schema: {
          name: 'category_name',
          is_primary: false,
          length: 255,
          default_value: null
        }
      },
      {
        field: 'unit_name',
        type: 'string',
        meta: {
          interface: 'input',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 'piece'
        },
        schema: {
          name: 'unit_name',
          is_primary: false,
          length: 50,
          default_value: 'piece'
        }
      },
      {
        field: 'print_group',
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
          name: 'print_group',
          is_primary: false,
          length: 100,
          default_value: null
        }
      },
      {
        field: 'barcode',
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
          name: 'barcode',
          is_primary: false,
          length: 100,
          default_value: null
        }
      },
      {
        field: 'image_url',
        type: 'string',
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
          name: 'image_url',
          is_primary: false,
          length: 500,
          default_value: null
        }
      },
      {
        field: 'sku',
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
          name: 'sku',
          is_primary: false,
          length: 100,
          default_value: null
        }
      },
      {
        field: 'track_inventory',
        type: 'boolean',
        meta: {
          interface: 'toggle',
          options: {},
          display: 'boolean',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: false
        },
        schema: {
          name: 'track_inventory',
          is_primary: false,
          default_value: false
        }
      },
      {
        field: 'allow_decimal',
        type: 'boolean',
        meta: {
          interface: 'toggle',
          options: {},
          display: 'boolean',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: false
        },
        schema: {
          name: 'allow_decimal',
          is_primary: false,
          default_value: false
        }
      },
      {
        field: 'is_available',
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
          name: 'is_available',
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
      },
      {
        field: 'nutritional_info',
        type: 'json',
        meta: {
          interface: 'code',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'full'
        },
        schema: {
          name: 'nutritional_info',
          is_primary: false,
          default_value: {}
        }
      },
      {
        field: 'allergen_info',
        type: 'json',
        meta: {
          interface: 'code',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'full'
        },
        schema: {
          name: 'allergen_info',
          is_primary: false,
          default_value: {}
        }
      },
      {
        field: 'preparation_time',
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
          name: 'preparation_time',
          is_primary: false,
          data_type: 'integer',
          default_value: 0
        }
      },
      {
        field: 'spice_level',
        type: 'integer',
        meta: {
          interface: 'slider',
          options: {
            min: 0,
            max: 5,
            step: 1
          },
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'half',
          default_value: 0
        },
        schema: {
          name: 'spice_level',
          is_primary: false,
          data_type: 'integer',
          default_value: 0
        }
      },
      {
        field: 'dietary_restrictions',
        type: 'json',
        meta: {
          interface: 'tags',
          options: {},
          display: 'raw',
          readonly: false,
          hidden: false,
          required: false,
          width: 'full'
        },
        schema: {
          name: 'dietary_restrictions',
          is_primary: false,
          default_value: []
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