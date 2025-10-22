/**
 * Shared styling constants and utilities for consistent design
 */

export const COLORS = {
  primary: '#9B1D20',        // Ruby red
  background: '#FFE4E1',     // Soft peach-red complement
  text: '#333333',           // Dark gray for readability
  secondary: '#F5F5F5',      // Light gray-white for contrast
} as const;

export const GRADIENTS = {
  background: 'bg-gradient-to-br from-white via-gray-50 to-gray-100',
  primary: 'from-red-800 to-red-900',
} as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

/**
 * Get responsive className for different screen sizes
 */
export function getResponsiveClasses(base: string, mobile?: string, tablet?: string, desktop?: string): string {
  const classes = [base];

  if (mobile) classes.push(mobile);
  if (tablet) classes.push(tablet);
  if (desktop) classes.push(desktop);

  return classes.join(' ');
}

/**
 * Get spacing utility classes
 */
export const SPACING = {
  xs: '1',
  sm: '2',
  md: '4',
  lg: '6',
  xl: '8',
  '2xl': '12',
  '3xl': '16',
} as const;

/**
 * Common layout classes
 */
export const LAYOUT_CLASSES = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  sidebar: 'w-64 bg-white shadow-lg',
  mainContent: 'flex-1 min-h-screen',
  header: 'bg-white shadow-sm border-b sticky top-0 z-30',
} as const;