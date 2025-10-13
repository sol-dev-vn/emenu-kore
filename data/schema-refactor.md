# Directus Menu Schema Refactor

## New Architecture Overview

### 📊 Current State Analysis
- **Hardcoded brands**: 7 brands + 1 warehouse brand
- **34,351 menu items**: All linked directly to branches
- **Categories**: Global across all brands
- **No image support**: Limited file handling

### 🎯 New Architecture Goals
1. **Dynamic Brands**: Brands as full Directus entities
2. **Master Menus**: Centralized menu management per brand
3. **Branch Control**: Per-branch activation/deactivation
4. **Rich Media**: Logo, thumbnail, and image support
5. **Brand-Specific Categories**: Categories belong to brands

## 📋 New Collections Structure

### 1. Brands Collection (New)
```typescript
interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: DirectusFile; // Brand logo
  brand_color: string; // Primary brand color
  secondary_color: string; // Secondary brand color
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  is_active: boolean;
  sort: number;
  date_created: string;
  date_updated: string;
}
```

### 2. Brand Menus Collection (New)
```typescript
interface BrandMenu {
  id: string;
  brand: Brand; // M2O relationship
  name: string;
  description?: string;
  is_active: boolean;
  default_currency: string;
  tax_rate: number;
  service_rate: number;
  sort: number;
  date_created: string;
  date_updated: string;
}
```

### 3. Categories Collection (Refactored)
```typescript
interface Category {
  id: string;
  brand: Brand; // M2O relationship (new)
  brand_menu: BrandMenu; // M2O relationship (new)
  name: string;
  slug: string;
  description?: string;
  thumbnail: DirectusFile; // Category thumbnail (new)
  display_order: number;
  is_active: boolean;
  parent?: Category; // Self-referencing for subcategories
  sort: number;
  date_created: string;
  date_updated: string;
}
```

### 4. Menu Items Collection (Refactored)
```typescript
interface MenuItem {
  id: string;
  brand_menu: BrandMenu; // M2O relationship (changed from branch)
  category: Category; // M2O relationship
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  cost?: number;
  sku?: string;
  barcode?: string;
  thumbnail: DirectusFile; // Menu item thumbnail (new)
  images: DirectusFile[]; // Multiple images (new)
  allergens: string[];
  dietary_info: string[];
  nutrition_info: object;
  preparation_time: number;
  spice_level: number;
  is_available: boolean;
  is_featured: boolean;
  sort: number;
  external_id?: string;
  external_source?: string;
  date_created: string;
  date_updated: string;
}
```

### 5. Branch Menu Items Collection (New)
```typescript
interface BranchMenuItem {
  id: string;
  branch: Branch; // M2O relationship
  menu_item: MenuItem; // M2O relationship
  is_active: boolean; // Branch-specific activation
  custom_price?: number; // Optional branch-specific pricing override
  availability_note?: string;
  sort: number;
  date_created: string;
  date_updated: string;
}
```

### 6. Branches Collection (Enhanced)
```typescript
interface Branch {
  id: string;
  brand: Brand; // M2O relationship (new)
  name: string;
  slug: string;
  description?: string;
  thumbnail: DirectusFile; // Branch thumbnail (new)
  address: string;
  phone?: string;
  email?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  opening_hours: object;
  is_active: boolean;
  sort: number;
  external_id?: string;
  external_source?: string;
  date_created: string;
  date_updated: string;
}
```

## 🔗 Relationship Diagram

```
Brands (1) ──────── (N) Brand Menus (1) ──────── (N) Menu Items
  │                                          │                 │
  │                                          │                 └── (1) Categories
  │                                          │
  │                                          │
  └── (N) Branches (1) ─── (N) Branch Menu Items (N) ─── (1) Menu Items
```

## 📸 File Upload Support

### File Collections
- **Brand Logos**: Stored in `directus_files`, linked via `brand.logo`
- **Category Thumbnails**: Stored in `directus_files`, linked via `category.thumbnail`
- **Menu Item Thumbnails**: Stored in `directus_files`, linked via `menu_item.thumbnail`
- **Menu Item Images**: Multiple images stored in `directus_files`, linked via `menu_item.images`
- **Branch Thumbnails**: Stored in `directus_files`, linked via `branch.thumbnail`

### Folder Structure Recommendation
```
directus_files/
├── brands/
│   └── logos/
├── categories/
│   └── thumbnails/
├── menu_items/
│   ├── thumbnails/
│   └── images/
└── branches/
    └── thumbnails/
```

## 🔄 Data Migration Plan

### Phase 1: Create New Collections
1. Create Brands collection
2. Create Brand Menus collection
3. Create Branch Menu Items collection
4. Add new fields to existing collections

### Phase 2: Migrate Existing Data
1. Create Brand entities from hardcoded list
2. Create default Brand Menu for each Brand
3. Migrate Menu Items to Brand Menus
4. Assign Categories to Brands
5. Create Branch Menu Items for existing branch-menu relationships

### Phase 3: Update Application Code
1. Update sync scripts to work with new schema
2. Update frontend to use new data structure
3. Add image upload functionality
4. Update API endpoints

## 🎯 Benefits of New Architecture

1. **Dynamic Brand Management**: Add/remove brands without code changes
2. **Centralized Menu Control**: Master menu items managed at brand level
3. **Flexible Branch Operations**: Branches can activate/deactivate items
4. **Rich Media Support**: Images, logos, and thumbnails throughout
5. **Scalable Structure**: Easy to add new brands and expand menu offerings
6. **Brand Consistency**: Categories and items consistent across brand
7. **Performance Optimized**: Reduced redundancy and improved query efficiency