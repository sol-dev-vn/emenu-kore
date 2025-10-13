## MODIFIED Requirements
### Requirement: Category Synchronization
The system SHALL synchronize categories from CukCuk POS to Brand-specific categories in Directus.

#### Scenario: Category Brand assignment
- **WHEN** processing category from CukCuk API
- **THEN** system assigns category to appropriate Brand based on branch mappings
- **AND** maintains category name, code, and description
- **AND** sets Brand relationship for category filtering

#### Scenario: Category hierarchy preservation
- **WHEN** processing category with parent relationships
- **THEN** system maintains parent-child relationships
- **AND** ensures both parent and child belong to same Brand
- **AND** validates Brand assignment consistency

## ADDED Requirements
### Requirement: Brand-Specific Category Creation
The system SHALL create categories within Brand context for proper menu organization.

#### Scenario: Brand category initialization
- **WHEN** creating categories for a Brand
- **THEN** system creates categories within Brand context
- **AND** assigns unique category codes within Brand scope
- **AND** maintains global category relationships

#### Scenario: Category thumbnail management
- **WHEN** category has image information
- **THEN** system downloads and uploads category thumbnail
- **AND** assigns thumbnail to category entity
- **AND** organizes thumbnails in brand-specific folders

### Requirement: Category Migration
The system SHALL migrate existing global categories to Brand-specific categories.

#### Scenario: Global category migration
- **WHEN** migrating existing category structure
- **THEN** system creates Brand-specific category copies
- **AND** preserves category hierarchy and metadata
- **AND** assigns categories to appropriate Brands based on usage

#### Scenario: Category relationship validation
- **WHEN** migrating category relationships
- **THEN** system validates menu item category assignments
- **AND** updates menu items to use new Brand-specific categories
- **AND** handles orphaned categories gracefully