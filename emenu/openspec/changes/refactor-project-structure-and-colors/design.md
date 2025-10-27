## Context

The project currently has multiple overlapping layout patterns and inconsistent color usage. The foundation exists with proper CSS variables and design tokens, but implementation is scattered and inconsistent. This creates maintenance overhead and potential branding inconsistencies.

Current state:
- 3+ layout patterns with duplicated functionality
- 40+ files with hardcoded color values
- Inconsistent authentication implementation patterns
- Mixed routing logic for layout selection

## Goals / Non-Goals

- Goals:
  - Exactly 2 layouts (PublicLayout + HubLayout)
  - 100% color consistency using CSS variables
  - Standardized authentication patterns
  - Simplified routing logic
  - Comprehensive color utilities for future development
- Non-Goals:
  - Complete redesign of existing UI components
  - Changes to core authentication business logic
  - Alteration of existing brand colors

## Decisions

- Decision: Consolidate to 2 layouts only (Public + Hub)
  - Reason: Eliminates complexity while maintaining necessary separation
  - Alternatives considered: Keep default layout, create auth-specific layout
- Decision: Use existing CSS variable system as single source of truth
  - Reason: Well-established system aligns with brand requirements
  - Alternatives considered: Create new design token system, use Tailwind only
- Decision: Migrate all hardcoded colors systematically
  - Reason: Ensures consistency and maintainability
  - Alternatives considered: Phase-out approach, targeted updates only
- Decision: Standardize HubAuthGuard usage across all hub routes
  - Reason: Single authentication pattern prevents security inconsistencies
  - Alternatives considered: Layout-level auth, page-level auth

## Risks / Trade-offs

- Risk: Breaking existing custom layouts in specific pages
  - Mitigation: Comprehensive testing and gradual migration strategy
- Risk: Color migration may introduce visual regressions
  - Mitigation: Visual testing and comparison before/after deployment
- Trade-off: Reduced flexibility for custom layouts per page
  - Mitigation: Enhancement of HubLayout to support configurable sections

## Migration Plan

1. **Phase 1**: Create enhanced color utilities and update CSS variables
2. **Phase 2**: Migrate hardcoded colors systematically (high priority files first)
3. **Phase 3**: Consolidate layout implementations and update routing logic
4. **Phase 4**: Standardize authentication patterns
5. **Phase 5**: Testing, documentation, and cleanup

## Open Questions

- Should we preserve any existing custom layouts for specific edge cases?
- Do we need automated testing to prevent future hardcoded color introduction?
- Should we create design system documentation beyond existing CSS variables?