/**
 * QR Code Validation Tests
 * Tests for QR code format validation and table ID parsing
 */

describe('QR Code Validation', () => {
  describe('URL Format Validation', () => {
    test('should validate correct QR URL format', () => {
      const validUrls = [
        'https://sol-emu.vn/qr?table=A01',
        'https://sol-emu.vn/qr?table=B02',
        'https://sol-emu.vn/qr?table=C01',
        'https://localhost:3000/qr?table=A01',
        'http://localhost:3000/qr?table=TABLE01'
      ];

      validUrls.forEach(url => {
        expect(validateQRUrl(url)).toBe(true);
      });
    });

    test('should reject invalid QR URL formats', () => {
      const invalidUrls = [
        'https://sol-emu.vn/qr',
        'https://sol-emu.vn/menu',
        'not-a-url',
        ''
      ];

      invalidUrls.forEach(url => {
        expect(validateQRUrl(url)).toBe(false);
      });
    });

    test('should handle case sensitivity in table IDs', () => {
      const urls = [
        'https://sol-emu.vn/qr?table=a01',
        'https://sol-emu.vn/qr?table=A01',
        'https://sol-emu.vn/qr?table=Aa01'
      ];

      expect(extractTableId(urls[0])).toBe('a01');
      expect(extractTableId(urls[1])).toBe('A01');
      expect(extractTableId(urls[2])).toBe('Aa01');
    });
  });

  describe('Table ID Validation', () => {
    test('should validate standard table ID formats', () => {
      const validTableIds = [
        'A01', 'A02', 'A03',
        'B01', 'B02', 'B03',
        'C01', 'C02', 'C03',
        'TABLE01', 'TABLE02',
        'VIP01', 'BAR01'
      ];

      validTableIds.forEach(tableId => {
        expect(validateTableId(tableId)).toBe(true);
      });
    });

    test('should reject invalid table ID formats', () => {
      const invalidTableIds = [
        '',
        'A',
        '1',
        'A',
        'A-01', // Contains hyphen
        'A_01', // Contains underscore
        'A 01', // Contains space
        'A!01', // Contains special character
        'very-long-table-id-that-exceeds-reasonable-length'
      ];

      invalidTableIds.forEach(tableId => {
        expect(validateTableId(tableId)).toBe(false);
      });
    });

    test('should normalize table IDs', () => {
      const normalizations = [
        ['a01', 'A01'],
        ['b02', 'B02'],
        ['A01', 'A01'],
        ['table01', 'TABLE01']
      ];

      normalizations.forEach(([input, expected]) => {
        expect(normalizeTableId(input)).toBe(expected);
      });
    });
  });

  describe('URL Parsing', () => {
    test('should extract table ID from URL query parameters', () => {
      const testCases = [
        ['https://sol-emu.vn/qr?table=A01', 'A01'],
        ['https://sol-emu.vn/qr?table=B02&other=value', 'B02'],
        ['https://sol-emu.vn/qr?table=C01#section', 'C01'],
        ['https://sol-emu.vn/qr?other=value&table=D01', 'D01']
      ];

      testCases.forEach(([url, expectedTableId]) => {
        expect(extractTableId(url)).toBe(expectedTableId);
      });
    });

    test('should handle URL encoded table IDs', () => {
      const encodedUrls = [
        'https://sol-emu.vn/qr?table=A%2001', // A 01
        'https://sol-emu.vn/qr?table=TABLE%2001' // TABLE 01
      ];

      expect(extractTableId(encodedUrls[0])).toBe('A 01');
      expect(extractTableId(encodedUrls[1])).toBe('TABLE 01');
    });

    test('should return null for malformed URLs', () => {
      const malformedUrls = [
        'https://sol-emu.vn/qr',
        'https://sol-emu.vn/qr?invalid=A01',
        'not-a-url'
      ];

      malformedUrls.forEach(url => {
        expect(extractTableId(url)).toBeNull();
      });
    });
  });
});

// Test utility functions
function validateQRUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname === '/qr' && urlObj.searchParams.has('table');
  } catch {
    return false;
  }
}

function extractTableId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('table');
  } catch {
    return null;
  }
}

function validateTableId(tableId: string): boolean {
  if (!tableId || tableId.length < 2) return false;
  return /^[A-Za-z0-9]+$/.test(tableId);
}

function normalizeTableId(tableId: string): string {
  return tableId.toUpperCase();
}