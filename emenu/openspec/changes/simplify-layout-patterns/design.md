## Context

The current layout system has evolved organically and contains multiple overlapping layout approaches with unnecessary complexity. The VisualEditingLayout adds maintenance overhead with limited usage, and both Root Layout and HubLayout contain code duplication that violates D.R.Y. principles.

## Goals / Non-Goals

- **Goals**:
  - Simplify layout system by removing unused/unnecessary components (VisualEditingLayout)
  - Apply D.R.Y. principles to eliminate code duplication
  - Create consistent styling patterns across all page types
  - Improve maintainability through shared utilities and components
  - Establish clear separation of concerns in layout logic
- **Non-Goals**:
  - Changing visual design or branding
  - Removing core functionality (only removing visual editing feature)
  - Changing routing structure
  - Affecting user-facing features

## Decisions

- **Decision**: Remove VisualEditingLayout entirely to simplify the system
- **Rationale**: Visual editing adds complexity with limited value and maintenance overhead
- **Decision**: Refactor Root Layout to use simple, clear path-based routing
- **Rationale**: Complex conditional logic makes the code hard to understand and maintain
- **Decision**: Break down HubLayout into smaller, reusable components following D.R.Y.
- **Rationale**: Current HubLayout has duplicate code and mixed concerns
- **Alternatives considered**:
  - Keep VisualEditingLayout (adds unnecessary complexity)
  - Create unified BaseLayout (over-engineering for current needs)
  - Minimal changes only (doesn't address underlying issues)

## Risks / Trade-offs

- **Risk**: Removing visual editing may break any unknown dependencies
  - **Mitigation**: Comprehensive search for visual editing usage before removal
- **Risk**: Refactoring may introduce temporary regressions
  - **Mitigation**: Comprehensive testing of each layout type
- **Trade-off**: More files with smaller components vs fewer large components
  - **Mitigation**: Clear organization and naming conventions

## Migration Plan

1. Remove VisualEditingLayout and related functionality completely
2. Simplify Root Layout logic with clear routing
3. Refactor HubLayout into smaller, focused components
4. Create shared utilities for common patterns
5. Update all page components to use simplified layouts
6. Comprehensive testing at each step

## Open Questions

- Are there any unknown dependencies on visual editing functionality?
- What is the preferred approach for organizing the smaller layout components?