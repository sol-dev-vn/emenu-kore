/**
 * QR Code Utility Functions
 * Helper functions for QR code validation and processing
 */

export interface QRUrlInfo {
  isValid: boolean;
  tableId: string | null;
  baseUrl: string | null;
  error?: string;
}

export interface TableData {
  id: string;
  name: string;
  code: string;
  capacity: number;
  zone: string;
  branch_id: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

export interface BranchData {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  hours: string;
  currency: string;
  timezone: string;
}

/**
 * Validates and extracts information from a QR code URL
 */
export function validateQRUrl(url: string): QRUrlInfo {
  try {
    if (!url || typeof url !== 'string') {
      return {
        isValid: false,
        tableId: null,
        baseUrl: null,
        error: 'Invalid URL format'
      };
    }

    const urlObj = new URL(url);

    // Check if the path is correct for QR scanning
    if (!urlObj.pathname.includes('/qr')) {
      return {
        isValid: false,
        tableId: null,
        baseUrl: urlObj.origin,
        error: 'Invalid QR code URL path'
      };
    }

    // Extract table ID from query parameters
    const tableId = urlObj.searchParams.get('table');

    if (!tableId) {
      return {
        isValid: false,
        tableId: null,
        baseUrl: urlObj.origin,
        error: 'Missing table ID in URL'
      };
    }

    // Validate table ID format
    if (!validateTableId(tableId)) {
      return {
        isValid: false,
        tableId: null,
        baseUrl: urlObj.origin,
        error: 'Invalid table ID format'
      };
    }

    return {
      isValid: true,
      tableId,
      baseUrl: urlObj.origin
    };

  } catch (error) {
    return {
      isValid: false,
      tableId: null,
      baseUrl: null,
      error: error instanceof Error ? error.message : 'URL parsing error'
    };
  }
}

/**
 * Validates table ID format
 */
export function validateTableId(tableId: string): boolean {
  if (!tableId || typeof tableId !== 'string') {
    return false;
  }

  // Table ID should be 2-20 characters, alphanumeric only
  const tableIdRegex = /^[A-Za-z0-9]{2,20}$/;
  return tableIdRegex.test(tableId);
}

/**
 * Normalizes table ID (converts to uppercase)
 */
export function normalizeTableId(tableId: string): string {
  return tableId ? tableId.toUpperCase().trim() : '';
}

/**
 * Generates a QR code URL for a given table
 */
export function generateQRUrl(baseUrl: string, tableId: string): string {
  if (!baseUrl || !tableId) {
    throw new Error('Base URL and table ID are required');
  }

  const normalizedTableId = normalizeTableId(tableId);
  const url = new URL('/qr', baseUrl);
  url.searchParams.set('table', normalizedTableId);

  return url.toString();
}

/**
 * Validates table data structure
 */
export function validateTableData(data: any): data is TableData {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.code === 'string' &&
    typeof data.capacity === 'number' &&
    typeof data.zone === 'string' &&
    typeof data.branch_id === 'string' &&
    ['available', 'occupied', 'reserved', 'maintenance'].includes(data.status)
  );
}

/**
 * Validates branch data structure
 */
export function validateBranchData(data: any): data is BranchData {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.code === 'string' &&
    typeof data.address === 'string' &&
    typeof data.phone === 'string' &&
    typeof data.hours === 'string' &&
    typeof data.currency === 'string' &&
    typeof data.timezone === 'string'
  );
}

/**
 * Creates a fallback table data object for error scenarios
 */
export function createFallbackTableData(tableId: string): TableData {
  return {
    id: `fallback-${tableId.toLowerCase()}`,
    name: `Table ${tableId}`,
    code: normalizeTableId(tableId),
    capacity: 4,
    zone: 'General',
    branch_id: 'fallback-branch',
    status: 'available'
  };
}

/**
 * Creates a fallback branch data object for error scenarios
 */
export function createFallbackBranchData(): BranchData {
  return {
    id: 'fallback-branch',
    name: 'SOL Restaurant',
    code: 'SOL-MAIN',
    address: 'Address not available',
    phone: 'Contact staff for assistance',
    hours: 'Available during restaurant hours',
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh'
  };
}

/**
 * Checks if a table is available for ordering
 */
export function isTableAvailable(table: TableData): boolean {
  return table.status === 'available';
}

/**
 * Gets table availability status with user-friendly text
 */
export function getTableAvailabilityText(table: TableData): string {
  switch (table.status) {
    case 'available':
      return 'Available for ordering';
    case 'occupied':
      return 'Currently occupied';
    case 'reserved':
      return 'Reserved for guest';
    case 'maintenance':
      return 'Under maintenance';
    default:
      return 'Status unknown';
  }
}

/**
 * Formats table and branch information for display
 */
export function formatTableInfo(table: TableData, branch: BranchData): string {
  return `Table: ${table.name} | Branch: ${branch.name}`;
}

/**
 * Generates welcome message for QR menu
 */
export function generateWelcomeMessage(table: TableData, branch: BranchData): string {
  return `Welcome to ${branch.name}`;
}

/**
 * Checks if a URL is a valid QR code URL for the SOL eMenu system
 */
export function isSOLQRUrl(url: string): boolean {
  const validation = validateQRUrl(url);
  return validation.isValid && validation.baseUrl !== null;
}

/**
 * Extracts table ID from various URL formats
 */
export function extractTableIdFromUrl(url: string): string | null {
  const validation = validateQRUrl(url);
  return validation.isValid ? validation.tableId : null;
}

/**
 * Sanitizes and validates user-provided table IDs
 */
export function sanitizeTableId(tableId: string): string | null {
  if (!tableId || typeof tableId !== 'string') {
    return null;
  }

  const sanitized = tableId.trim().toUpperCase();
  return validateTableId(sanitized) ? sanitized : null;
}