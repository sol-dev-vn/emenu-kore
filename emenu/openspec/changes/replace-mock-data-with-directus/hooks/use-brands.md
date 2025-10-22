# useBrands Hook

## Purpose
Custom React hook for fetching and managing brand data from Directus CMS.

## Features
- Automatic data fetching with caching
- Loading states and error handling
- Real-time data synchronization
- Optimistic updates with rollback
- Pagination support for large datasets

## Usage
```typescript
import { useBrands } from '@/hooks/use-brands';

const { brands, isLoading, error, refetch } = useBrands({
  activeOnly: true,
  includeBranches: true,
  includeStats: true
});
```

## API
```typescript
interface UseBrandsOptions {
  activeOnly?: boolean;
  includeBranches?: boolean;
  includeStats?: boolean;
  limit?: number;
  offset?: number;
}

interface UseBrandsReturn {
  brands: Brand[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  createBrand: (brand: Partial<Brand>) => Promise<Brand>;
  updateBrand: (id: string, updates: Partial<Brand>) => Promise<Brand>;
  deleteBrand: (id: string) => Promise<void>;
}
```

## Implementation Notes
- Uses React Query for caching and synchronization
- Implements automatic retry with exponential backoff
- Provides optimistic updates for better UX
- Handles offline mode with cached data