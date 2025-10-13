# Menu Items Restoration Guide

This guide explains how to restore menu items from raw JSON data to the Directus backend.

## Overview

The `restore-menu-items.js` script restores menu items from the raw data file `data/raw/items_raw_001.json` to the Directus backend. It processes data in batches of 100 records with proper branch and category mapping.

## Prerequisites

1. **Environment Variables**: Make sure your `.env` file contains the required Directus configuration:
   ```env
   DIRECTUS_URL=https://your-directus-instance.com
   DIRECTUS_API_TOKEN=your-directus-api-token
   ```

2. **Existing Data**: The script assumes that branches and categories have already been synchronized to Directus, as it needs to map CukCuk external IDs to Directus primary keys.

## Usage

### Basic Usage

```bash
# Navigate to the cukcuk collector directory
cd data/collectors/cukcuk

# Run restoration with default data file
node restore-menu-items.js

# Or specify a custom data file
node restore-menu-items.js ../data/raw/items_raw_001.json
```

### What the Script Does

1. **Initialization**: Tests Directus connection and validates configuration
2. **Load Raw Data**: Reads the JSON file containing menu items
3. **Build Mappings**: Gets existing branches and categories from Directus for mapping
4. **Batch Processing**: Processes menu items in batches of 100 records:
   - Maps CukCuk data to Directus format using existing `DataMapper`
   - Checks if menu item already exists (by `external_id`)
   - Creates new items or updates existing ones
   - Sets `sync_status` to 'synced' and updates `last_sync_at`
5. **Logging**: Creates detailed logs and summary statistics
6. **Restoration Log**: Creates a sync log entry in Directus for tracking

### Data Structure

The raw data file should have this structure:
```json
{
  "metadata": {
    "export_date": "2025-10-12T16:23:40.129Z",
    "total_items": 34351,
    "branches": 30,
    "source": "cukcuk-api",
    "version": "1.0"
  },
  "menu_items": [
    {
      "id": "4265c737-cd06-4130-a61a-475f8547ddf3",
      "name": "Item Name",
      "branch_id": "11111111-1111-1111-1111-111111111111",
      "branch_name": "Kho tổng",
      "price": 0,
      "code": "13120039",
      "external_id": "4265c737-cd06-4130-a61a-475f8547ddf3",
      "CategoryID": "00000000-0000-0000-0000-000000000000",
      // ... other CukCuk fields
    }
  ]
}
```

## Features

### Branch and Category Mapping
- Automatically builds mappings from existing Directus data
- Maps CukCuk `BranchId` to Directus `branch_id` using external_id → primary_key mapping
- Maps CukCuk `CategoryID` to Directus `category_id` using external_id → primary_key mapping

### Batch Processing
- Processes 100 records at a time to avoid API overload
- 1-second delay between batches for API stability
- Detailed progress logging and error tracking

### Error Handling
- Graceful handling of individual record failures
- Failed items are marked with `sync_status: 'failed'`
- Detailed error logging with batch-level statistics
- Graceful shutdown on SIGINT/SIGTERM

### Sync Tracking
- Each record gets `sync_status: 'synced'` and `last_sync_at` timestamp
- Creates restoration log in `sync_logs` collection
- Performance metrics and batch statistics

## Output

The script provides detailed logging including:
- Connection status
- Mapping statistics
- Batch progress
- Error details
- Final summary with counts

Example output:
```
🎉 All menu items restored successfully!
Restoration Summary
Total Duration: 245s
Total Processed: 34351
Total Created: 34351
Total Updated: 0
Total Failed: 0
Total Batches: 344
```

## Troubleshooting

### Common Issues

1. **Missing Branch/Category Mapping**: If branches or categories don't exist in Directus, the script will log warnings but continue processing.

2. **API Connection Issues**: Check your `DIRECTUS_URL` and `DIRECTUS_API_TOKEN` environment variables.

3. **Rate Limiting**: The script includes delays between batches, but if you encounter rate limiting, increase the delay.

4. **Duplicate Records**: The script uses `external_id` to identify existing records and will update rather than create duplicates.

### Manual Control

You can stop the script at any time with Ctrl+C (SIGINT). It will print a summary of the work completed before shutting down.

## Integration

This restoration script is designed to work with the existing sync infrastructure:
- Uses the same `ApiClient` as the main sync script
- Uses the same `DataMapper` for consistent data transformation
- Creates logs in the same `sync_logs` collection
- Follows the same error handling patterns

## Next Steps

After restoration:
1. Verify the data in Directus
2. Check the sync logs for any errors
3. Run regular sync operations to keep data updated
4. Consider running the restoration script with `--dry-run` option (if implemented) for testing