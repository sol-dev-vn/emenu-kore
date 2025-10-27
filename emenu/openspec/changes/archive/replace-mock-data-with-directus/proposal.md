## Why
The application currently uses mock data throughout the hub management pages, which prevents real-time data synchronization and limits the platform's ability to manage actual restaurant operations. Replacing mock data with Directus CMS integration will enable live data management, proper brand-branch-menu relationships, and real-time updates across all hub pages.

## What Changes
- Replace all mock data implementations with Directus SDK integration
- Implement proper data fetching for brands, branches, menu items, layouts, and tables
- Create data access layers (hooks/services) for centralized data management
- Update UI components to handle real data with loading states and error handling
- Implement caching strategy for optimal performance
- Add real-time data synchronization capabilities

## Impact
- **Affected specs**: Brand Management, Menu Management, Layout Management, Table Management
- **Affected code**:
  - `src/components/hub/BrandGroupedList.tsx`
  - `src/components/hub/BrandGroup.tsx`
  - `src/app/hub/branches/page.tsx`
  - `src/app/hub/menus/page.tsx`
  - `src/app/hub/layouts/page.tsx`
  - `src/hooks/` (new data access hooks)
  - `src/services/` (new Directus service layer)