## Context
The current hub management system uses static mock data across all pages, which limits the platform's ability to manage real restaurant operations. The system needs to integrate with Directus CMS to provide live data management, real-time updates, and proper data relationships between brands, branches, menus, and layouts.

## Goals / Non-Goals
- **Goals**:
  - Replace all mock data with Directus SDK integration
  - Provide real-time data synchronization
  - Maintain responsive UI with proper loading states
  - Implement proper error handling and recovery
  - Create reusable data access patterns
- **Non-Goals**:
  - Complete rewrite of existing UI components
  - Changes to Directus schema or data structure
  - Real-time collaboration features
  - Advanced analytics dashboards

## Decisions
- **Decision**: Use React hooks pattern for data access with `useQuery` style caching
  - **Rationale**: Provides consistent data fetching patterns, automatic caching, and loading states
  - **Alternatives considered**: Service classes, Redux store, Context API
- **Decision**: Implement optimistic updates with rollback on error
  - **Rationale**: Better user experience for data modifications
  - **Alternatives considered**: Pessimistic updates, read-only mode
- **Decision**: Use Directus SDK with TypeScript support
  - **Rationale**: Type safety, automatic query generation, built-in error handling
  - **Alternatives considered**: Raw REST API, GraphQL, custom SDK

## Data Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│     Brands      │◄───┤   Branches       │◄───┤     Tables      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Brand Menus   │◄───┤ Branch Menu Items│◄───┤   Table Layouts │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Component Integration Strategy
1. **Data Layer**: Custom hooks for each data type
2. **Service Layer**: Directus SDK with caching
3. **UI Layer**: Existing components with data integration
4. **Error Handling**: Global error boundaries and retry logic

## Performance Considerations
- **Caching**: React Query style data caching with 5-minute stale time
- **Pagination**: Implement for large datasets (brands with many branches)
- **Lazy Loading**: Load branch data on demand when brand expanded
- **Optimistic Updates**: Immediate UI updates with server sync

## Migration Strategy
1. **Phase 1**: Implement data layer and hooks without UI changes
2. **Phase 2**: Update components one by one with error handling
3. **Phase 3**: Add real-time features and optimizations
4. **Phase 4**: Testing and performance tuning

## Risk Mitigation
- **Risk**: Directus API downtime → **Mitigation**: Local caching with offline mode
- **Risk**: Slow data loading → **Mitigation**: Progressive loading with skeleton states
- **Risk**: Data inconsistency → **Mitigation**: Automatic refresh and conflict resolution
- **Risk**: Complex error states → **Mitigation**: Global error handling with user-friendly messages

## Open Questions
- Should we implement real-time subscriptions via WebSocket or polling?
- How to handle large menu datasets (500+ items per brand)?
- What's the optimal cache invalidation strategy?
- Should we implement data transformation layer for UI-specific data shaping?