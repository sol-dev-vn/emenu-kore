/**
 * Type definitions for color system
 */

export type BrandColorVariant =
  | 'primary'
  | 'primary-light'
  | 'primary-soft'
  | 'primary-medium'
  | 'primary-dark'
  | 'primary-darker'
  | 'background'
  | 'text'
  | 'nav';

export type ColorState =
  | 'default'
  | 'hover'
  | 'active'
  | 'focus'
  | 'disabled'
  | 'error'
  | 'warning'
  | 'success';

export type ColorIntensity =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950';

export type ColorFormat =
  | 'text'
  | 'bg'
  | 'border'
  | 'ring'
  | 'shadow'
  | 'fill'
  | 'stroke';

export interface ColorToken {
  variant: BrandColorVariant;
  intensity?: ColorIntensity;
  format: ColorFormat;
  state?: ColorState;
  opacity?: number;
}

export interface BrandColorPalette {
  primary: string;
  primaryLight: string;
  primarySoft: string;
  primaryMedium: string;
  primaryDark: string;
  primaryDarker: string;
  background: string;
  text: string;
  nav: string;
}

export interface SemanticColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeColors {
  brand: BrandColorPalette;
  semantic: SemanticColors;
  neutral: {
    white: string;
    black: string;
    gray: Record<ColorIntensity, string>;
  };
}

/**
 * Color utility functions
 */
export class ColorUtils {
  /**
   * Generate a color class string from a color token
   */
  static generateClass(token: ColorToken): string {
    const { variant, intensity, format, state, opacity } = token;

    let base = `${format}`;

    // Add brand prefix for brand colors
    if (variant.startsWith('primary')) {
      base += '-brand-primary';
    } else if (variant === 'background') {
      base += '-brand-background';
    } else if (variant === 'text') {
      base += '-brand-text';
    } else if (variant === 'nav') {
      base += '-brand-nav';
    } else {
      base += `-${variant}`;
    }

    // Add intensity if specified
    if (intensity) {
      base += `-${intensity}`;
    }

    // Add opacity if specified
    if (opacity && opacity !== 100) {
      base += `/${opacity}`;
    }

    // Add state if specified
    if (state && state !== 'default') {
      base = `${state}:${base}`;
    }

    return base;
  }

  /**
   * Validate if a color class follows the brand guidelines
   */
  static isValidBrandColor(colorClass: string): boolean {
    const brandColorPattern = /^(text|bg|border|ring|shadow|fill|stroke)-(brand|accent|background|foreground)/;
    const allowedColorPatterns = [
      brandColorPattern,
      /^(text|bg|border|ring|shadow|fill|stroke)-(gray|slate|zinc|neutral|stone|white|black|transparent|current|inherit)/,
      /^(text|bg|border|ring|shadow|fill|stroke)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)/,
    ];

    return allowedColorPatterns.some(pattern => pattern.test(colorClass));
  }

  /**
   * Get contrasting text color for a background
   */
  static getContrastColor(backgroundColor: string): 'light' | 'dark' {
    // This is a simplified version - in a real implementation you'd
    // calculate the actual luminance of the color
    const lightColors = ['#FFE4E1', '#FFFFFF', '#F5F5F5', '#FAD4D1'];
    return lightColors.includes(backgroundColor.toUpperCase()) ? 'dark' : 'light';
  }

  /**
   * Generate CSS custom property name
   */
  static generateCSSProperty(token: ColorToken): string {
    const { variant, state } = token;

    let property = '--brand';

    if (variant.startsWith('primary')) {
      property += '-primary';
      if (variant !== 'primary') {
        property += `-${variant.replace('primary-', '')}`;
      }
    } else {
      property += `-${variant}`;
    }

    if (state && state !== 'default') {
      property += `-${state}`;
    }

    return property;
  }
}