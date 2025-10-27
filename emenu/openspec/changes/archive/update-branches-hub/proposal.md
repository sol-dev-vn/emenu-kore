## Why
Simplify the branches hub page to provide a cleaner, more focused view of branches grouped by brand without unnecessary complexity for restaurant managers.

## What Changes

### Branch Management Hub
- Remove "Add Branch" feature and button
- Remove search and filter components from the branches page
- Remove stats bar from branch management page
- Simplify branch information display to show only: name, code, total tables, and active tables
- Remove branch status indicators (active/maintenance)
- Remove Edit functionality from branch cards
- Group all branches by brand with expanded view showing all branches

### Menu Management Hub
- Remove stats bar from menu management page
- Reorganize to show 2 clear sections: Brand Menus and Branch Menus
- Each brand has one brand menu containing all menu items for that brand
- Create default brand menu for each brand if not already exists
- Branch menus are selectable subsets of items from the brand menu
- Improve clarity of menu hierarchy and relationships

### Table Layouts Hub
- Remove stats bar from table layouts page
- Simplify interface to focus on layout management

## Impact
- Affected specs: hub-branches, menu-management, table-layouts
- Affected code:
  - `/src/app/hub/branches/page.tsx` - Main branches page, remove stats
  - `/src/components/hub/BranchCard.tsx` - Simplified branch card component
  - `/src/components/hub/BrandGroupedList.tsx` - Remove search functionality
  - `/src/components/hub/BrandGroup.tsx` - Update brand grouping display
  - `/src/app/hub/menus/page.tsx` - Reorganize into 2 sections, remove stats
  - `/src/app/hub/layouts/page.tsx` - Remove stats bar
  - Create default brand menu functionality