# useTableLayouts Hook

## Purpose
Custom React hook for fetching and managing table layouts and configurations from Directus CMS.

## Features
- Layout management with table configurations
- QR code generation and tracking
- Zone-based table organization
- Real-time table status updates

## Usage
```typescript
import { useTableLayouts } from '@/hooks/use-table-layouts';

const { layouts, tables, isLoading, error } = useTableLayouts({
  branchId: 'branch-id',
  includeTables: true,
  includeQRCodes: true
});
```

## API
```typescript
interface UseTableLayoutsOptions {
  branchId?: string;
  includeTables?: boolean;
  includeQRCodes?: boolean;
  activeOnly?: boolean;
}

interface UseTableLayoutsReturn {
  layouts: Layout[];
  tables: Table[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  createLayout: (layout: Partial<Layout>) => Promise<Layout>;
  updateLayout: (id: number, updates: Partial<Layout>) => Promise<Layout>;
  deleteLayout: (id: number) => Promise<void>;
  generateQRCodes: (layoutId: number, options: QRCodeOptions) => Promise<QRCodes[]>;
  updateTableStatus: (tableId: number, status: TableStatus) => Promise<Table>;
}
```

## Implementation Notes
- Manages complex table positioning and zone configurations
- Handles QR code generation with proper URL formatting
- Supports template-based layout creation
- Implements real-time table status synchronization