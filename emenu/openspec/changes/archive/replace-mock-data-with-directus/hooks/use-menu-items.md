# useMenuItems Hook

## Purpose
Custom React hook for fetching and managing menu items and menu configurations from Directus CMS.

## Features
- Brand menu and branch menu item management
- Menu item availability and pricing
- Category-based organization
- Real-time menu synchronization

## Usage
```typescript
import { useMenuItems } from '@/hooks/use-menu-items';

const { menuItems, brandMenus, branchMenus, isLoading, error } = useMenuItems({
  brandId: 'brand-uuid',
  branchId: 'branch-id',
  includeCategories: true
});
```

## API
```typescript
interface UseMenuItemsOptions {
  brandId?: string;
  branchId?: string;
  includeCategories?: boolean;
  includeAvailability?: boolean;
  activeOnly?: boolean;
}

interface UseMenuItemsReturn {
  menuItems: MenuItem[];
  brandMenus: BrandMenu[];
  branchMenus: BranchMenuItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  createMenuItem: (item: Partial<MenuItem>) => Promise<MenuItem>;
  updateMenuItem: (id: number, updates: Partial<MenuItem>) => Promise<MenuItem>;
  deleteMenuItem: (id: number) => Promise<void>;
  updateBranchMenuItem: (id: string, updates: Partial<BranchMenuItem>) => Promise<BranchMenuItem>;
}
```

## Implementation Notes
- Manages brand menu to branch menu relationships
- Handles custom pricing and availability per branch
- Supports bulk operations for menu management
- Implements menu item validation and business rules