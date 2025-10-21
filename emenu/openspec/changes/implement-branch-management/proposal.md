# Implement Branch Management & Menu System

## Why
The current hub navigation lacks dedicated branch management capabilities. Restaurant managers need a centralized interface to view all branches grouped by brand, access table layouts, and manage menus with brand-to-branch inheritance. This will streamline operations and provide better visibility across the restaurant portfolio.

## What Changes
- Create new `/hub/branches` page listing all branches grouped by brand
- Implement branch detail pages with visual table layout viewing
- Add menu management system with brand menu inheritance and per-branch customization
- Update hub navigation to point to new branch management interface
- Enable branches to select/deselect items from brand menu with custom pricing overrides

## Impact
- **New Capabilities**: branch-listing, table-layouts, menu-management
- **New Routes**: `/hub/branches`, `/hub/branches/[id]`
- **Updated Navigation**: Hub "Restaurants" link now points to `/hub/branches`
- **Data Integration**: Uses existing Directus collections (brands, branches, layouts, tables, brand_menus, menu_items, branch_menu_items)
- **Role-based Access**: Available to Administrator and Manager roles