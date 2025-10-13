## Why
The Directus schema has been refactored from hardcoded brands to dynamic brand entities, requiring comprehensive updates to sync scripts to work with the new brand-centric architecture. The existing sync logic relies on hardcoded brand mappings and branch-to-menu relationships that no longer exist.

## What Changes
- **BREAKING**: Update sync scripts to use new Brand and Brand Menu entities
- Modify data mapping logic to create Brand entities from hardcoded mappings
- Update menu item sync to create Brand Menu relationships instead of Branch relationships
- Add category migration to Brand-specific categories
- Implement Branch Menu Items creation for per-branch activation
- Update sync status tracking to work with new schema relationships
- Add image upload handling for logos, thumbnails, and galleries

## Impact
- **Affected specs**: menu-synchronization, brand-management, category-management
- **Affected code**:
  - `data/collectors/cukcuk/sync.js` - Main sync logic
  - `data/collectors/cukcuk/utils/data-mapper.js` - Data mapping utilities
  - `data/collectors/cukcuk/utils/api-client.js` - API client for brand/menu data
  - `data/collectors/cukcuk/restore-menu-items.js` - Restoration script
- **Data migration**: Need to migrate existing 34,351 menu items to new schema
- **Business operations**: Critical for maintaining real-time menu synchronization across 30+ restaurants