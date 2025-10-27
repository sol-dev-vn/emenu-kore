# Build Brand Menu Functionality - Directus Integration

## Summary
Develop comprehensive brand menu functionality that integrates with the existing Directus database to display real menu items and categories, replacing the current mock data implementation.

## Why
The current brand menu implementation at `/hub/brands/menu` uses static mock data and has significant limitations:

### Current Issues:
1. **No real data**: Uses hardcoded mock arrays instead of Directus integration
2. **No menu item viewing**: Limited to basic menu statistics (items count, categories)
3. **Missing functionality**: No ability to view, edit, or manage actual menu items
4. **Poor UX**: Users can't access actual menu data they need to manage
5. **Data inconsistency**: Mock data doesn't reflect real restaurant offerings

### Target Solution:
- Connect to real Directus `brand_menus`, `menu_items`, and `menu_categories` collections
- Display actual menu items with full details and images
- Implement search, filtering, and pagination for large menus
- Add menu item management capabilities
- Provide real-time data synchronization

## User Requirements
- Replace mock brand menu data with Directus API integration
- Display list of actual menu items from database with categories
- Show menu item details including images, prices, descriptions
- Add filtering and search capabilities for menu management
- Implement proper error handling and loading states
- Support brand-specific menu configurations and pricing

## Current State Analysis
The brand menu page currently shows:
- Static mock data for 7 brand menus
- Basic statistics only (item count, category count)
- No access to individual menu items
- Simple View/Edit buttons with no actual functionality
- No integration with existing Directus schema

## Target State
Dynamic brand menu system with:
- Real data from Directus `brand_menus` collection
- Expandable categories from `menu_categories` collection
- Detailed menu items from `menu_items` collection
- Full CRUD operations for menu management
- Search, filter, and pagination capabilities
- Brand-specific pricing and currency support