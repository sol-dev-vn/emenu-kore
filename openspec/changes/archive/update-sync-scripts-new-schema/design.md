## Context
The Directus schema has been refactored from hardcoded brand enums to dynamic Brand entities. The existing sync scripts were built around hardcoded brand mappings (`miwaku_premium`, `s79_teppanyaki`, etc.) and direct branch-to-menu-item relationships. The new architecture introduces:
- Brands as entities with logos and metadata
- Brand Menus as master menu containers
- Branch Menu Items for per-branch activation
- Brand-specific categories with thumbnails

### Technical Constraints
- Must maintain existing CukCuk API integration
- Need to migrate 34,351 existing menu items without data loss
- Real-time sync performance must be maintained
- Backward compatibility during migration period

## Goals / Non-Goals
- **Goals**:
  - Migrate sync scripts to work with new brand-centric schema
  - Maintain all existing sync functionality
  - Add support for brand logos, thumbnails, and image galleries
  - Implement proper error handling for new relationships
- **Non-Goals**:
  - Modify CukCuk API integration (keep existing API contracts)
  - Change sync frequency or timing logic
  - Add new sync features beyond schema migration

## Decisions
- **Decision**: Create brand mapping utility that converts hardcoded brand IDs to Brand entities
  - **Alternatives considered**:
    1. Keep hardcoded IDs with wrapper (rejected - defeats purpose of dynamic brands)
    2. Database migration script only (rejected - doesn't update ongoing sync)
    3. Gradual migration with dual-mode (rejected - adds complexity)
- **Decision**: Update sync to create Brand Menu for each Brand during initial sync
  - **Rationale**: Ensures every brand has a master menu container for menu items
- **Decision**: Implement Branch Menu Items creation during menu item sync
  - **Rationale**: Maintains existing branch-specific menu relationships while using new schema
- **Decision**: Add image upload handling to sync process
  - **Rationale**: New schema supports rich media; sync should populate these fields

## Risks / Trade-offs
- **Data migration risk**: 34,351 menu items must be migrated without data loss
  - **Mitigation**: Create backup before migration, implement rollback logic
- **Performance risk**: New relationship lookups may slow sync performance
  - **Mitigation**: Batch operations, add indexes, optimize queries
- **Complexity risk**: Multi-level relationships add complexity to sync logic
  - **Mitigation**: Clear error handling, logging, step-by-step validation
- **Downtime risk**: Migration may require temporary sync pause
  - **Mitigation**: Plan migration during low-traffic hours, communicate impact

## Migration Plan
1. **Preparation Phase**
   - Create brand mapping utility
   - Backup existing data
   - Test migration logic on small dataset

2. **Schema Migration Phase**
   - Run sync script with brand creation logic
   - Create Brand Menu entities for each Brand
   - Migrate existing menu items to Brand Menus
   - Create Branch Menu Items relationships

3. **Validation Phase**
   - Verify all menu items migrated correctly
   - Test branch-specific menu activation
   - Validate category assignments
   - Check image upload functionality

4. **Cleanup Phase**
   - Remove hardcoded brand references
   - Update documentation
   - Monitor sync performance

**Rollback Plan**:
- Restore from pre-migration backup
- Revert sync script changes
- Restore previous Directus schema if needed

## Open Questions
- Should we migrate all menu items in one batch or process by brand?
- How to handle sync failures during migration (partial success scenarios)?
- Do we need to maintain backward compatibility during transition?
- Should we add validation to prevent orphaned menu items without Brand assignments?