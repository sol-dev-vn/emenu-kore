## MODIFIED Requirements
### Requirement: Menu Items Synchronization
The system SHALL synchronize menu items from CukCuk POS to Directus using Brand relationships instead of Branch relationships.

#### Scenario: Brand Menu creation during sync
- **WHEN** sync process starts for a brand
- **THEN** system creates Brand Menu entity if it doesn't exist
- **AND** sets default currency, tax rate, and service rate from configuration

#### Scenario: Menu item migration to Brand Menu
- **WHEN** processing menu items from CukCuk API
- **THEN** system assigns menu items to Brand Menu instead of Branch
- **AND** preserves all existing menu item metadata and pricing

#### Scenario: Branch Menu Items creation
- **WHEN** menu item is synced for a specific branch
- **THEN** system creates Branch Menu Item relationship
- **AND** sets activation status based on branch availability
- **AND** preserves custom pricing if exists

## ADDED Requirements
### Requirement: Brand Entity Synchronization
The system SHALL create and synchronize Brand entities from hardcoded brand mappings.

#### Scenario: Brand creation from hardcoded mappings
- **WHEN** sync encounters hardcoded brand ID (e.g., 'miwaku_premium')
- **THEN** system creates corresponding Brand entity with proper metadata
- **AND** sets brand color, description, and contact information
- **AND** handles brand logo upload if available

#### Scenario: Brand relationship validation
- **WHEN** processing branch or menu item data
- **THEN** system validates Brand relationship exists
- **AND** creates missing Brand entities automatically
- **AND** logs Brand creation for audit purposes

### Requirement: Category Brand Assignment
The system SHALL assign Categories to Brands during synchronization.

#### Scenario: Category migration to Brand
- **WHEN** syncing categories from CukCuk API
- **THEN** system assigns category to appropriate Brand based on branch mappings
- **AND** creates brand-specific category structure
- **AND** handles category thumbnails if available

#### Scenario: Subcategory relationships
- **WHEN** processing category hierarchy
- **THEN** system maintains parent-child relationships within Brand context
- **AND** ensures subcategories belong to same Brand as parent

### Requirement: Media Upload Synchronization
The system SHALL handle image and thumbnail uploads during synchronization.

#### Scenario: Menu item thumbnail upload
- **WHEN** menu item has image_url in CukCuk data
- **THEN** system downloads and uploads image to Directus files
- **AND** assigns image as menu item thumbnail
- **AND** handles download failures gracefully

#### Scenario: Brand logo upload
- **WHEN** brand has logo information available
- **THEN** system downloads and uploads logo to Directus files
- **AND** assigns logo to Brand entity
- **AND** sets proper folder organization

## REMOVED Requirements
### Requirement: Branch-Only Menu Item Assignment
**Reason**: New architecture uses Brand Menu as primary menu container, Branch Menu Items for activation
**Migration**: Existing branch-menu relationships will be converted to Brand Menu relationships with Branch Menu Items for activation

### Requirement: Hardcoded Brand Mapping
**Reason**: Brands are now dynamic entities in Directus
**Migration**: Hardcoded brand mappings will be converted to Brand entities with proper relationships