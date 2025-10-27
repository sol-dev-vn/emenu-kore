## MODIFIED Requirements

### Requirement: CSS Variable Color System
The application SHALL use standardized CSS variables as single source of truth for all colors.

#### Scenario: Brand color implementation
- **WHEN** styling any component
- **THEN** colors SHALL use existing CSS variables:
  - --background-color: #FFE4E1 (soft peach-red background)
  - --foreground-color: #9B1D20 (ruby red for accents)
  - --accent-color: #9B1D20 (ruby red for highlights)
  - --background-variant-color: #F5F5F5 (light gray-white for contrast)
  - --text-color: #333333 (dark gray for readability)
- **AND** SHALL NOT use hardcoded hex values in component styles
- **AND** SHALL prefer Tailwind brand classes over inline styles

#### Scenario: Color utility usage
- **WHEN** applying colors in components
- **THEN** developers SHALL use one of:
  - CSS variable classes: text-[var(--foreground-color)]
  - Brand Tailwind classes: bg-brand-primary, text-brand-nav
  - Color utility functions from styling-constants.ts
- **AND** SHALL NOT use default Tailwind colors (red-500, etc.)

### Requirement: Color Consistency Enforcement
The application SHALL maintain consistent brand color usage across all components.

#### Scenario: Error state colors
- **WHEN** displaying error messages or error boundaries
- **THEN** colors SHALL use brand ruby red (--foreground-color)
- **AND** SHALL NOT use default Tailwind red variants
- **AND** background colors SHALL use brand background variants

#### Scenario: Loading state colors
- **WHEN** showing loading indicators or skeleton screens
- **THEN** background colors SHALL use --background-color or --background-variant-color
- **AND** accent colors SHALL use brand colors
- **AND** SHALL NOT use hardcoded hex values

## ADDED Requirements

### Requirement: Color Utilities and Constants
The application SHALL provide centralized color utilities to prevent inconsistencies.

#### Scenario: Color utility functions
- **WHEN** developers need color manipulation
- **THEN** system SHALL provide utility functions in styling-constants.ts
- **AND** utilities SHALL work with existing CSS variables
- **AND** SHALL include TypeScript types for color safety
- **AND** SHALL support brand color variations (hover, focus, disabled states)

#### Scenario: Color validation
- **WHEN** adding new color usage
- **THEN** build process SHALL warn about hardcoded hex values
- **AND** SHALL provide automated checks for color consistency
- **AND** SHALL prefer CSS variables and brand classes

### Requirement: Migration from Hardcoded Colors
The application SHALL systematically eliminate all hardcoded color values.

#### Scenario: Hub component color updates
- **WHEN** updating hub components (ErrorBoundary, LoadingSkeleton, etc.)
- **THEN** replace all hardcoded hex values with CSS variables
- **AND** maintain visual consistency with existing design
- **AND** update background colors from #FFE4E1 to var(--background-color)
- **AND** update accent colors from #9B1D20 to var(--foreground-color)

#### Scenario: Navigation color standardization
- **WHEN** updating navigation and button components
- **THEN** replace default Tailwind red colors with brand equivalents
- **AND** use bg-brand-primary instead of bg-red-600
- **AND** use text-brand-primary instead of text-red-500
- **AND** maintain hover and focus states with brand color variations