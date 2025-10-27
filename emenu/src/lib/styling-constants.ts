/**
 * Shared styling constants and utilities for consistent design
 */

export const COLORS = {
  primary: '#9B1D20',        // Ruby red - Main brand color
  background: '#FFFFFF',     // Clean white background for better contrast
  text: '#1F2937',           // Dark gray for better readability
  secondary: '#F9FAFB',      // Light gray for subtle contrast
  // Extended color palette
  primaryLight: '#FEF2F2',   // Very light red tint (replaces peach)
  primarySoft: '#FEE2E2',    // Soft red background (better contrast)
  primaryMedium: '#DC2626',  // Medium red for better visibility
  primaryDark: '#7F1D1D',    // Dark red for strong contrast
  primaryDarker: '#450A0A',  // Darkest red for high contrast
} as const;

export const GRADIENTS = {
  background: 'bg-gradient-to-br from-white via-gray-50 to-gray-100',
  brand: 'bg-gradient-to-br from-brand-primary via-[#7f1d1d] to-[#450a0a]',
  brandSubtle: 'bg-gradient-to-br from-brand-background via-[#fee2e2] to-white',
  primary: 'from-red-600 to-red-800',
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

/**
 * Brand color utilities using CSS variables
 */
export const BRAND_COLORS = {
  // Using CSS variables for dynamic theming
  primary: 'text-brand-primary',
  background: 'bg-brand-background',
  text: 'text-brand-text',
  nav: 'bg-brand-nav',
  // Background variants
  backgroundMuted: 'bg-background/50',
  backgroundVariant: 'bg-background/variant',
  // Text variants
  textMuted: 'text-brand-text/70',
  textSubtle: 'text-brand-text/50',
  // Accent colors
  accent: 'text-accent',
  accentBg: 'bg-accent',
  accentBorder: 'border-accent',
  accentBorderSoft: 'border-accent/20',
  accentBorderMedium: 'border-accent/30',
  // Interactive states
  hoverAccent: 'hover:text-accent hover:bg-accent/10',
  focusAccent: 'focus:ring-accent focus:border-accent',
  // Error and success states using brand colors
  error: 'text-brand-primary',
  errorBg: 'bg-brand-primary/10',
  errorBorder: 'border-brand-primary',
  success: 'text-green-600',
  successBg: 'bg-green-50',
  successBorder: 'border-green-200',
} as const;

/**
 * Color validation utility - prevents hardcoded colors
 */
export function validateColor(colorClass: string): boolean {
  // List of allowed color patterns
  const allowedPatterns = [
    /^text-(brand|accent|background|foreground|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black|transparent|current|inherit)/,
    /^bg-(brand|accent|background|foreground|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black|transparent|current|inherit)/,
    /^border-(brand|accent|background|foreground|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black|transparent|current|inherit)/,
    /^ring-(brand|accent|background|foreground|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)/,
    /^shadow-(brand|accent|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black|transparent|current|inherit)/,
  ];

  // Check if color class matches any allowed pattern
  return allowedPatterns.some(pattern => pattern.test(colorClass));
}

/**
 * Get safe color class - throws error if invalid color is used
 */
export function getSafeColorClass(colorClass: string): string {
  if (!validateColor(colorClass)) {
    throw new Error(`Invalid or hardcoded color detected: ${colorClass}. Please use brand colors or CSS variables.`);
  }
  return colorClass;
}

/**
 * Common brand color combinations
 */
export const BRAND_COMBINATIONS = {
  card: 'bg-background/95 backdrop-blur-sm border-accent/20',
  button: 'bg-accent hover:bg-accent/90 text-white focus:ring-accent',
  buttonOutline: 'border-accent/30 text-brand-text hover:bg-accent/10',
  input: 'bg-background/50 border-accent/30 text-brand-text placeholder:text-brand-text/50 focus:border-accent',
  sidebar: 'bg-white border-accent/10',
  header: 'bg-white/95 backdrop-blur-sm border-accent/20',
} as const;