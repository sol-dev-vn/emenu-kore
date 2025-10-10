# CukCuk Data Synchronization Implementation Guide

## Overview
This document outlines the implementation requirements for synchronizing data from CukCuk POS system to the SOL eMenu Directus backend. The synchronization process runs as an automated daily job using the Node.js client.

## Production Credentials

### CukCuk System Access
- **Admin Portal**: https://sol.cukcuk.vn/
- **Login**: get account details from [G.Keep](https://keep.google.com/#NOTE/1HXovf3NXHBzglkHVipEI0_kCyVh6Wq_ih9FWFEdrKs7usY2m5s2Oe_E9v61QXQ))
- **Company Domain**: sol

### API Configuration
```bash
CUKCUK_DOMAIN=sol
CUKCUK_APP_ID=CUKCUKOpenPlatform
CUKCUK_APP_SECRET=328fa08d62aea5d9a547d1993b2d6a9a27871eb93e600ed5bceaf83fa61820e1
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
DIRECTUS_URL=http://localhost:11111  # Or production URL
DIRECTUS_API_TOKEN=your_directus_token
DIRECTUS_TIMEOUT=30000
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

// Update or insert into branches table
// Sync branch settings (VAT, service rates)
```

**Target Table**: `branches` (see DATA_DICTIONARY.md:10-46)

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
```

**Target Table**: `categories` (see DATA_DICTIONARY.md:104-128)

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
```

**Target Table**: `menu_items` (see DATA_DICTIONARY.md:130-172)

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

### Execution Order
1. **Branches** - Must sync first to provide branch references
2. **Categories** - Must sync before menu items for category mapping
3. **Menu Items** - Depends on categories and branches
4. **Tables** - Depends on branches

### Error Handling Strategy
```javascript
// For each sync operation:
try {
  // Sync logic
  await logSyncSuccess(type, stats);
} catch (error) {
  await logSyncFailure(type, error);
  // Continue with next sync type unless critical
}
```

### Data Mapping Strategy
- **External IDs**: Use CukCuk IDs as `external_id` field
- **References**: Map foreign keys using external_id lookups
- **Hierarchy**: Maintain parent-child relationships for categories
- **Inactive Data**: Mark as inactive rather than deleting

### Performance Considerations
- **Batch Processing**: Process records in batches of 100
- **Retry Logic**: Implement exponential backoff for failed requests
- **Connection Pooling**: Reuse HTTP connections
- **Memory Management**: Stream large datasets when possible

## Reporting and Monitoring

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

### Monitoring Integration
```javascript
// In sync-data.js, implement:
const syncMetrics = {
  startTime: new Date(),
  endTime: null,
  recordsProcessed: 0,
  recordsCreated: 0,
  recordsUpdated: 0,
  recordsFailed: 0,
  errors: []
};

// Log to Directus sync_logs table
await directus.createSyncLog({
  sync_type: type,
  status: 'completed' | 'failed' | 'partial',
  records_processed: syncMetrics.recordsProcessed,
  records_created: syncMetrics.recordsCreated,
  records_updated: syncMetrics.recordsUpdated,
  records_failed: syncMetrics.recordsFailed,
  error_details: syncMetrics.errors
});
```

## Deployment Configuration

### Environment Setup
```bash
# .env file configuration
NODE_ENV=production
LOG_LEVEL=info

# CukCuk Configuration
CUKCUK_DOMAIN=sol
CUKCUK_APP_ID=CUKCUKOpenPlatform
CUKCUK_APP_SECRET=328fa08d62aea5d9a547d1993b2d6a9a27871eb93e600ed5bceaf83fa61820e1
CUKCUK_COMPANY_CODE=sol

# Directus Configuration
DIRECTUS_URL=https://your-directus-instance.com
DIRECTUS_API_TOKEN=your_production_token

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

## Implementation Checklist

### Phase 1: Core Infrastructure
- [ ] Set up CukCuk API client integration
- [ ] Configure Directus API client
- [ ] Implement error handling and logging
- [ ] Set up environment configuration

### Phase 2: Data Synchronization
- [ ] Implement branch synchronization
- [ ] Implement category synchronization
- [ ] Implement menu item synchronization
- [ ] Implement table synchronization
- [ ] Add data validation and mapping

### Phase 3: Monitoring and Reporting
- [ ] Implement sync logging to Directus
- [ ] Create markdown report generation
- [ ] Set up error notification system
- [ ] Configure monitoring dashboard

### Phase 4: Deployment
- [ ] Configure PM2 process
- [ ] Set up cron scheduling
- [ ] Configure log rotation
- [ ] Test production deployment

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


