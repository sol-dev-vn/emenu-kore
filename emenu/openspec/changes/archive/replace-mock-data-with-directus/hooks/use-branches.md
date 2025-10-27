# useBranches Hook

## Purpose
Custom React hook for fetching and managing branch data from Directus CMS with brand relationships.

## Features
- Branch data fetching with brand filtering
- Real-time table count calculations
- Branch statistics and active session tracking
- Multi-branch operations support

## Usage
```typescript
import { useBranches } from '@/hooks/use-branches';

const { branches, isLoading, error, refetch } = useBranches({
  brandId: 'brand-uuid',
  includeTables: true,
  includeStats: true
});
```

## API
```typescript
interface UseBranchesOptions {
  brandId?: string;
  includeTables?: boolean;
  includeStats?: boolean;
  activeOnly?: boolean;
  limit?: number;
}

interface UseBranchesReturn {
  branches: Branch[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  createBranch: (branch: Partial<Branch>) => Promise<Branch>;
  updateBranch: (id: number, updates: Partial<Branch>) => Promise<Branch>;
  deleteBranch: (id: number) => Promise<void>;
  getBranchStats: (branchId: number) => BranchStats;
}
```

## Implementation Notes
- Calculates real-time table counts from tables collection
- Includes active session data for occupancy statistics
- Supports bulk operations for multiple branches
- Provides branch-specific configuration management