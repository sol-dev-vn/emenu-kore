## Why

The current codebase has multiple overlapping layout patterns and inconsistent structure approaches across different page types. This creates unnecessary complexity, maintenance overhead, and potential inconsistencies in user experience.

## What Changes

- Simplify the root layout.tsx logic to use consistent layout routing with clear separation of concerns
- Refactor HubLayout to follow D.R.Y. principles and remove code duplication
- **REMOVED**: VisualEditingLayout component entirely - remove visual editing functionality
- Standardize page layout patterns across public, auth, hub, and customer-facing pages
- Create shared layout utilities and components to reduce repetitive styling and structure code
- Extract common styling patterns into reusable utilities following D.R.Y. principles

## Impact

- Affected specs: `ui/layout-systems`
- Affected code: `src/app/layout.tsx`, `src/components/hub/HubLayout.tsx`, `src/components/layout/VisualEditingLayout.tsx` (REMOVED), multiple page components
- Reduces layout complexity by ~50% while maintaining all core functionality
- Removes visual editing feature entirely for simplification
- Improves maintainability through D.R.Y. principles and consistent patterns