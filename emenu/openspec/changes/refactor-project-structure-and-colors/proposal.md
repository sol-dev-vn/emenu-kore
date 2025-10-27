## Why

The current codebase has significant inconsistencies in layout implementations and color usage patterns, creating unnecessary complexity and maintenance overhead. Multiple layout patterns exist across different page types, with hardcoded colors scattered throughout 40+ component files, leading to inconsistent branding and poor maintainability.

## What Changes

- **Consolidate to exactly 2 layouts**: `PublicLayout` for homepage/public pages and `HubLayout` for all admin functionality
- **Standardize authentication** using `HubAuthGuard` consistently across all hub routes
- **Eliminate all hardcoded color values** and migrate to standardized CSS variable system using shadcn UI design tokens
- **Remove duplicate layout patterns** and consolidate page structure logic using shadcn UI components
- **Update routing logic** to ensure clean separation between public and hub areas
- **Migrate to shadcn UI components** for consistent design system: `Card`, `Button`, `Badge`, `Alert`, `Separator`, `Skeleton`, `Avatar`, `Dialog`, `Tabs`, `Form` components
- **Create reusable color utilities** using shadcn UI's `cn()` utility and CSS variable system
- **Document layout patterns** and color standards for future development

## Impact

- Affected specs: `ui/layout-systems`, `ui/color-system`
- Affected code: `src/app/layout.tsx`, all page components, 40+ component files with hardcoded colors
- **shadcn UI Integration**: Replace custom UI patterns with standardized shadcn components for consistency
- **Color System Migration**: Move from hardcoded Tailwind classes to shadcn's CSS variable system with brand-specific overrides
- **Component Standardization**: Use shadcn's `Card`, `Button`, `Badge`, `Alert`, `Skeleton`, `Avatar`, `Dialog`, `Tabs`, and form components throughout
- **Utility Functions**: Leverage shadcn's `cn()` utility for conditional styling and class merging
- Reduces layout complexity by ~60% through consolidation and D.R.Y principles
- Eliminates color inconsistencies across entire application
- Establishes consistent branding foundation for future development
- Improves maintainability through standardized patterns and utilities