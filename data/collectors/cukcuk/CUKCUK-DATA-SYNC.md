# CukCuk Data Synchronization Implementation Guide

## Overview
This document outlines the implementation requirements for synchronizing data from CukCuk POS system to the SOL eMenu Directus backend. The synchronization process runs as an automated daily job using the Node.js client with enhanced resume capabilities and comprehensive logging.

## Production Credentials

### CukCuk System Access
- **Admin Portal**: https://sol.cukcuk.vn/
- **Login**: get account details from [G.Keep](https://keep.google.com/#NOTE/1HXovf3NXHBzglkHVipEI0_kCyVh6Wq_ih9FWFEdrKs7usY2m5s2Oe_E9v61QXQ))
- **Company Domain**: sol

### API Configuration
```bash
CUKCUK_DOMAIN=sol
CUKCUK_APP_ID=CUKCUKOpenPlatform
CUKCUK_SECRET_KEY=328fa08d62aea5d9a547d1993b2d6a9a27871eb93e600ed5bceaf83fa61820e1
CUKCUK_COMPANY_CODE=sol
CUKCUK_API_BASE_URL=https://graphapi.cukcuk.vn
```

## Technical Implementation

### Required Libraries
- **@luutronghieu/cukcuk-api-client**: Node.js wrapper for CukCuk API
  - Documentation: https://socket.dev/npm/package/@luutronghieu/cukcuk-api-client/overview/1.2.0
  - API Reference: `data/collectors/cukcuk/docs/` folder
- **axios**: HTTP client for Directus API integration
- **dotenv**: Environment configuration management

### Directus Backend Configuration
```bash
DIRECTUS_URL=https://sol-kore.alphabits.team  # Production URL
DIRECTUS_API_TOKEN=your_directus_static_token
DIRECTUS_TIMEOUT=30000
```

### Session Logging
```bash
NODE_ENV=development
LOG_LEVEL=info
ENABLE_DETAILED_LOGGING=false
```

### Enhanced Session Logger
The sync system now includes comprehensive session logging that captures all console output during sync operations:

**Features**:
- **Dual Storage**: Logs are saved both to filesystem (`logs/data/cukcuk/`) and Directus (`session_log` field)
- **Real-time Capture**: All console output is captured with timestamps and session tracking
- **Session Statistics**: Tracks duration, log levels, and entry counts
- **Automatic Cleanup**: Removes log files older than 30 days

**Environment Variables**:
```bash
# Session Logger Configuration
SESSION_LOGGER_ENABLED=true
SESSION_LOG_DIR=logs/data/cukcuk
SESSION_LOG_RETENTION_DAYS=30
```

**Implementation**:
```javascript
// In sync.js, session logging is automatically started
const sessionLogger = new SessionLogger({
  sessionId: `sync-${new Date().toISOString()}`,
  enabled: true
});

await sessionLogger.start();
// ... sync operations ...
const sessionStats = await sessionLogger.stop();
```

## Data Synchronization Requirements

### 1. Branch Synchronization (Daily)
**API Endpoint**: Branch API (`data/collectors/cukcuk/docs/branches-api.markdown`)

**Implementation Logic**:
```javascript
// For each branch from CukCuk API:
const branchData = {
  name: branch.Name,
  code: branch.Code,
  external_id: branch.Id,
  external_source: 'cukcuk',
  is_base_depot: branch.IsBaseDepot,
  is_chain_branch: branch.IsChainBranch,
  is_active: true,
  description: `${branch.Name} - Imported from CukCuk`
};

// Update or insert into branches table with sync status tracking
const existingBranch = await this.apiClient.getDirectusItems('branches', {
  external_id: branch.Id,
  external_source: 'cukcuk'
});

if (existingBranch.data.length > 0) {
  await this.apiClient.updateDirectusItem('branches', existingBranch.data[0].id, {
    ...branchData,
    sync_status: 'synced',
    last_sync_at: new Date().toISOString()
  });
} else {
  await this.apiClient.createDirectusItem('branches', {
    ...branchData,
    sync_status: 'synced',
    last_sync_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}
```

**Target Table**: `branches` (see DATA_DICTIONARY.md:10-46)

**Schema Enhancements**:
- `sync_status`: Tracks synchronization status (pending, in_progress, synced, failed)
- `last_sync_at`: Timestamp of last synchronization
- `created_at`: Record creation timestamp
- `updated_at`: Record modification timestamp

### 2. Category Synchronization (Daily)
**API Endpoint**: Category API (`data/collectors/cukcuk/docs/categories-api.markdown`)

**Implementation Logic**:
```javascript
// For each category from CukCuk:
const categoryData = {
  name: category.Name,
  code: category.Code || category.Id,
  external_id: category.Id,
  external_source: 'cukcuk',
  parent_id: null, // Handle hierarchy later
  is_active: !category.Inactive,
  description: category.Description || `${category.Name} - Imported from CukCuk`
};

// Update or insert with sync status tracking
const existingCategory = await this.apiClient.getDirectusItems('categories', {
  external_id: category.Id,
  external_source: 'cukcuk'
});

if (existingCategory.data.length > 0) {
  await this.apiClient.updateDirectusItem('categories', existingCategory.data[0].id, {
    ...categoryData,
    sync_status: 'synced',
    last_sync_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
} else {
  await this.apiClient.createDirectusItem('categories', {
    ...categoryData,
    sync_status: 'synced',
    last_sync_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}
```

**Target Table**: `categories` (see DATA_DICTIONARY.md:104-128)

**Schema Enhancements**:
- `sync_status`: Tracks synchronization status (pending, in_progress, synced, failed)
- `last_sync_at`: Timestamp of last synchronization
- `created_at`: Record creation timestamp
- `updated_at`: Record modification timestamp

### 3. Menu Item Synchronization (Daily)
**API Endpoints**:
- Inventory Items API (`data/collectors/cukcuk/docs/inventory-items-api.markdown`)
- Menu API (`data/collectors/cukcuk/docs/menu-api.markdown`)

**Implementation Logic**:
```javascript
// For each menu item:
const menuItemData = {
  name: item.Name,
  code: item.Code || item.Id,
  external_id: item.Id,
  external_source: 'cukcuk',
  category_id: [mapped category id],
  price: parseFloat(item.Price) || 0,
  cost: parseFloat(item.Cost) || 0,
  is_active: !item.Inactive,
  is_available: item.IsAvailable !== false,
  image: item.ImageUrl,
  meta: {
    cukcuk_data: {
      unit: item.Unit,
      barcode: item.Barcode,
      tags: item.Tags,
      customFields: item.CustomFields
    }
  }
};

// Update or insert with sync status tracking
const existingItem = await this.apiClient.getDirectusItems('menu_items', {
  external_id: item.Id,
  external_source: 'cukcuk'
});

if (existingItem.data.length > 0) {
  await this.apiClient.updateDirectusItem('menu_items', existingItem.data[0].id, {
    ...menuItemData,
    sync_status: 'synced',
    last_sync_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
} else {
  await this.apiClient.createDirectusItem('menu_items', {
    ...menuItemData,
    sync_status: 'synced',
    last_sync_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}
```

**Target Table**: `menu_items` (see DATA_DICTIONARY.md:130-172)

**Schema Enhancements**:
- `sync_status`: Tracks synchronization status (pending, in_progress, synced, failed)
- `last_sync_at`: Timestamp of last synchronization
- `created_at`: Record creation timestamp
- `updated_at`: Record modification timestamp

### 4. Table and Zone Synchronization (Daily)
**API Endpoint**: Tables API (`data/collectors/cukcuk/docs/tables-api.markdown`)

**Implementation Logic**:
```javascript
// For each table:
const tableData = {
  map_object_id: table.MapObjectID,
  map_object_name: table.MapObjectName,
  area_id: table.AreaId,
  area_name: table.AreaName,
  branch_id: [mapped branch id],
  is_available: table.IsAvailable !== false,
  allow_merge_table: table.AllowMergeTable || false,
  external_sync_data: {
    capacity: table.Capacity,
    position: table.Position,
    status: table.Status
  },
  sync_status: 'synced'
};
```

**Target Tables**:
- `cukcuk_tables` (see DATA_DICTIONARY.md:683-711)
- `zones` (for new zones, see DATA_DICTIONARY.md:48-69)
- `tables` (for active tables, see DATA_DICTIONARY.md:71-102)

## Sync Process Implementation

### Enhanced Resume Functionality
The sync system now supports resume/checkpoint functionality that allows interrupted syncs to continue from where they left off:

**Resume Logic**:
```javascript
// For each sync type, check for partially synced records
const pendingItems = await this.apiClient.getDirectusItems('menu_items', {
  sync_status: { _in: ['pending', 'in_progress', 'failed'] },
  external_source: 'cukcuk'
}, null, { sort: ['last_sync_at'] });

// Only process items that haven't been successfully synced recently
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
const itemsToSync = pendingItems.data.filter(item =>
  !item.last_sync_at || item.last_sync_at < oneHourAgo
);
```

### Execution Order
1. **Branches** - Must sync first to provide branch references
2. **Categories** - Must sync before menu items for category mapping
3. **Menu Items** - Depends on categories and branches
4. **Tables** - Depends on branches

### Enhanced Error Handling Strategy
```javascript
// For each sync operation with status tracking:
try {
  // Set status to in_progress
  await this.apiClient.updateDirectusItem(collection, itemId, {
    sync_status: 'in_progress'
  });

  // Sync logic
  await syncOperation();

  // Set status to synced with timestamp
  await this.apiClient.updateDirectusItem(collection, itemId, {
    sync_status: 'synced',
    last_sync_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  await logSyncSuccess(type, stats);
} catch (error) {
  // Set status to failed
  await this.apiClient.updateDirectusItem(collection, itemId, {
    sync_status: 'failed',
    updated_at: new Date().toISOString()
  });

  await logSyncFailure(type, error);
  // Continue with next sync type unless critical
}
```

### Data Mapping Strategy
- **External IDs**: Use CukCuk IDs as `external_id` field
- **References**: Map foreign keys using external_id lookups
- **Hierarchy**: Maintain parent-child relationships for categories
- **Inactive Data**: Mark as inactive rather than deleting

### Enhanced API Client
The API client has been enhanced with comprehensive query options and better error handling:

**Enhanced Query Support**:
```javascript
// Enhanced getDirectusItems with query options
await this.apiClient.getDirectusItems('menu_items',
  { external_source: 'cukcuk' }, // filters
  100, // limit
  {
    sort: ['last_sync_at'], // sorting
    fields: ['id', 'name', 'sync_status', 'last_sync_at'] // field selection
  }
);
```

**Retry Logic**:
```javascript
// Built-in retry with exponential backoff
await this.apiClient.withRetry(async () => {
  // API operation that may fail
  return await this.directus.post(`/items/${collection}`, payload);
});
```

### Performance Considerations
- **Batch Processing**: Process records in batches of 100
- **Retry Logic**: Implement exponential backoff for failed requests
- **Connection Pooling**: Reuse HTTP connections
- **Memory Management**: Stream large datasets when possible
- **Resume Support**: Skip already synced records using `last_sync_at` timestamps
- **Query Optimization**: Use field selection and filtering to reduce payload size

## Enhanced Reporting and Monitoring

### Sync Logging Requirements
Create comprehensive reports after each sync job:

**Report Location**: `logs/data-sync/`
**File Format**: `DATASYNC-[TYPE]-DDMMYY.md`

**Report Structure**:
```markdown
# Data Sync Report - [TYPE] - [DATE]

## Executive Summary
[Brief status overview for management]
- Sync Status: ✅ Success / ⚠️ Partial / ❌ Failed
- Total Records: [number]
- Anomalies: [description if any]
- Recommended Actions: [if needed]

## Detailed Statistics
| Metric | Count |
|--------|-------|
| Records Processed | [number] |
| Records Created | [number] |
| Records Updated | [number] |
| Records Failed | [number] |
| Processing Time | [duration] |

## Sync Details
[Detailed breakdown of sync operations]

## Errors and Issues
[List any errors encountered]

## Next Steps
[Planned actions for next sync]
```

### Enhanced Monitoring Integration
```javascript
// In sync.js, comprehensive sync tracking is implemented:
const syncMetrics = {
  startTime: new Date(),
  endTime: null,
  recordsProcessed: 0,
  recordsCreated: 0,
  recordsUpdated: 0,
  recordsSkipped: 0, // Track resumed records
  recordsFailed: 0,
  errors: [],
  sessionStats: null // Session logger statistics
};

// Enhanced sync log creation with session data
await this.apiClient.createSyncLog({
  sync_type: type,
  status: 'completed' | 'failed' | 'partial',
  records_processed: syncMetrics.recordsProcessed,
  records_created: syncMetrics.recordsCreated,
  records_updated: syncMetrics.recordsUpdated,
  records_skipped: syncMetrics.recordsSkipped,
  records_failed: syncMetrics.recordsFailed,
  error_details: syncMetrics.errors,
  session_log: sessionLogger.getSessionLog(), // Full session log
  session_stats: sessionLogger.getStats() // Session statistics
});
```

### Session Log Integration
All sync operations are automatically captured by the SessionLogger:

**Features**:
- **Complete Console Capture**: All console.log/error/warn/info/debug calls
- **Dual Storage**: File system + Directus database storage
- **Session Statistics**: Duration, log levels, entry counts
- **Timestamp Tracking**: Precise timing for all operations
- **Automatic Cleanup**: Old log file management

**Log Storage**:
- **File System**: `logs/data/cukcuk/YYYY-MM-DD_session-id.log`
- **Directus**: `sync_logs.session_log` field (rich text format)
- **Directus**: `sync_logs.session_stats` field (JSON metadata)

## Deployment Configuration

### Environment Setup
```bash
# .env file configuration
NODE_ENV=production
LOG_LEVEL=info

# CukCuk Configuration
CUKCUK_DOMAIN=sol
CUKCUK_APP_ID=CUKCUKOpenPlatform
CUKCUK_SECRET_KEY=328fa08d62aea5d9a547d1993b2d6a9a27871eb93e600ed5bceaf83fa61820e1
CUKCUK_COMPANY_CODE=sol

# Directus Configuration
DIRECTUS_URL=https://sol-kore.alphabits.team
DIRECTUS_API_TOKEN=your_production_token
DIRECTUS_TIMEOUT=30000

# Session Logger Configuration
SESSION_LOGGER_ENABLED=true
SESSION_LOG_DIR=logs/data/cukcuk
SESSION_LOG_RETENTION_DAYS=30

# Sync Configuration
SYNC_ENABLE_BRANCHES=true
SYNC_ENABLE_CATEGORIES=true
SYNC_ENABLE_MENU_ITEMS=true
SYNC_ENABLE_TABLES=true
SYNC_RETRY_ATTEMPTS=3
SYNC_BATCH_SIZE=100
```

### PM2 Process Configuration
```json
{
  "apps": [{
    "name": "cukcuk-sync",
    "script": "data/collectors/cukcuk/sync-data.js",
    "cron": "0 2 * * *",
    "instances": 1,
    "autorestart": true,
    "max_memory_restart": "500M",
    "error_file": "logs/cukcuk-sync-error.log",
    "out_file": "logs/cukcuk-sync-out.log",
    "log_file": "logs/cukcuk-sync-combined.log",
    "time": true
  }]
}
```

## e-Menu Integration

### Table-Specific URL Format
```
https://sol.cukcuk.vn/order-online/self-order?branchID=[BRANCH_ID]&idTable=[TABLE_ID]
```

**Example**:
```
https://sol.cukcuk.vn/order-online/self-order?branchID=588D3DC0-2373-492E-99D9-0898411796EE&idTable=7E1A3640-EC7E-4D1F-AE96-1A604CCF3864
```

### QR Code Generation
- Generate QR codes for all active tables
- Use table_code as QR identifier
- Store QR code image paths in `tables.qr_code_image`
- Store full URLs in `tables.qr_code_url`

## Schema Enhancements and New Features

### Enhanced Collection Schema
The following collections have been enhanced with new fields for improved sync tracking:

#### Standard Fields Added to All Collections
- **`created_at`**: Record creation timestamp (readonly, system managed)
- **`updated_at`**: Record modification timestamp (readonly, system managed)
- **`sync_status`**: Current synchronization status
  - Values: `pending`, `in_progress`, `synced`, `failed`
  - Default: `pending`
- **`last_sync_at`**: Timestamp of last synchronization attempt
- **`external_id`**: External system identifier (CukCuk ID)
- **`external_source`**: Source system name (`cukcuk`)

#### Enhanced Collections
1. **`branches`** - Branch/restaurant locations
2. **`categories`** - Menu categories with hierarchy support
3. **`menu_items`** - Products with pricing and inventory
4. **`tables`** - Dining table management
5. **`layouts`** - Table layout configurations

### Sync Status Management
The sync system maintains detailed status tracking for all records:

**Status Flow**:
```
pending → in_progress → synced/failed
    ↑           ↓
    └───── resume ←─┘
```

**Resume Logic**:
- Records with `last_sync_at` older than 1 hour are resynced
- Failed records are automatically retried
- In-progress records are reset to pending on restart

### Session Logger Implementation
New comprehensive logging system captures all sync operations:

**Key Features**:
- Real-time console output capture
- Dual storage (filesystem + Directus)
- Session statistics and metrics
- Automatic log cleanup
- HTML formatting for rich text display

**Usage**:
```javascript
const sessionLogger = new SessionLogger({
  sessionId: `sync-${Date.now()}`,
  enabled: true
});

await sessionLogger.start();
// ... sync operations ...
const stats = await sessionLogger.stop();
```

## Implementation Checklist

### Phase 1: Core Infrastructure ✅ COMPLETED
- [x] Set up CukCuk API client integration
- [x] Configure Directus API client
- [x] Implement enhanced error handling and logging
- [x] Set up environment configuration
- [x] Add Session Logger implementation
- [x] Enhance API client with query options

### Phase 2: Data Synchronization ✅ COMPLETED
- [x] Implement branch synchronization with status tracking
- [x] Implement category synchronization with status tracking
- [x] Implement menu item synchronization with status tracking
- [x] Implement table synchronization with status tracking
- [x] Add data validation and mapping
- [x] Implement resume/checkpoint functionality
- [x] Add timestamp tracking (created_at, updated_at, last_sync_at)

### Phase 3: Monitoring and Reporting ✅ COMPLETED
- [x] Implement enhanced sync logging to Directus
- [x] Create session logger with dual storage
- [x] Set up comprehensive error tracking
- [x] Configure session statistics collection
- [x] Add sync status monitoring

### Phase 4: Deployment ✅ COMPLETED
- [x] Configure enhanced sync script
- [x] Set up environment configuration
- [x] Test sync with resume functionality
- [x] Validate backfill operations
- [x] Verify schema enhancements

## Security Considerations

### API Credentials
- Store CukCuk credentials in environment variables
- Rotate Directus API tokens regularly
- Use HTTPS for all API communications
- Implement rate limiting for API calls

### Data Privacy
- Sanitize sensitive data before logging
- Implement data retention policies
- Encrypt sensitive configuration
- Audit data access patterns

## Troubleshooting Guide

### Common Issues
1. **CukCuk Authentication Failed**
   - Verify domain and credentials
   - Check network connectivity
   - Validate API secret

2. **Directus Connection Issues**
   - Verify API token validity
   - Check server URL and port
   - Review network firewall rules

3. **Data Mapping Errors**
   - Validate external ID references
   - Check for missing parent records
   - Review data type conversions

4. **Performance Issues**
   - Monitor memory usage
   - Optimize batch sizes
   - Implement pagination for large datasets

### Debug Mode
```bash
# Enable debug logging
DEBUG=cukcuk-sync:* node sync-data.js
```

## Next Steps

1. **Immediate**: Set up development environment with test credentials
2. **Week 1**: Implement branch and category synchronization
3. **Week 2**: Implement menu item and table synchronization
4. **Week 3**: Add reporting and monitoring
5. **Week 4**: Production deployment and testing

## References

- [Data Schema](../../DATA_DICTIONARY.md)
- [CukCuk API Documentation](docs/)
- [Directus API Reference](https://docs.directus.io/)
- [SOL eMenu Architecture](../../README.md)


