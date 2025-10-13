## ADDED Requirements
### Requirement: Data Seeding Script Execution
The system SHALL provide a data seeding script to populate default brand records.

#### Scenario: Automated brand record creation
- **WHEN** seeding script is executed
- **THEN** system creates all 7 Brand entities with proper metadata
- **AND** creates Brand Menu for each Brand
- **AND** establishes Brand-Branch relationships
- **AND** populates sample categories for each Brand

#### Scenario: Seeding script configuration
- **WHEN** running the seeding process
- **THEN** system loads brand configuration from predefined data
- **AND** handles image uploads for logos and thumbnails
- **AND** creates folder structure for file organization
- **AND** provides progress feedback and error handling

### Requirement: Sample Menu Items Creation
The system SHALL create sample menu items to demonstrate brand functionality.

#### Scenario: Brand-specific menu items
- **WHEN** creating sample data
- **THEN** system creates menu items appropriate for each Brand:
  - Kohaku Sushi: California Roll, Salmon Sashimi, Tuna Roll
  - S79 Teppanyaki: Beef Teppanyaki, Chicken Teppanyaki, Seafood Set
  - Miwaku Premium: Lobster Thermidor, Wagyu Steak, Caviar
- **AND** assigns menu items to appropriate Brand Menus
- **AND** sets realistic pricing and descriptions
- **AND** includes placeholder images

#### Scenario: Branch Menu Items relationships
- **WHEN** creating sample menu items
- **THEN** system creates Branch Menu Items for key branches
- **AND** sets activation status for each branch
- **AND** includes branch-specific pricing variations
- **AND** demonstrates per-branch menu control

### Requirement: Image and File Management
The system SHALL handle image uploads and file organization during seeding.

#### Scenario: Brand logo uploads
- **WHEN** creating Brand entities
- **THEN** system uploads placeholder brand logos
- **AND** organizes logos in brand-logo folders
- **AND** sets proper file metadata and permissions
- **AND** handles upload failures gracefully

#### Scenario: Category thumbnail uploads
- **WHEN** creating categories
- **THEN** system uploads placeholder category thumbnails
- **AND** organizes thumbnails by brand
- **AND** sets appropriate image sizes and formats
- **AND** validates thumbnail display functionality

### Requirement: Data Integrity Validation
The system SHALL validate data integrity after seeding process.

#### Scenario: Relationship validation
- **WHEN** seeding process completes
- **THEN** system validates all Brand relationships exist
- **AND** checks for orphaned menu items or categories
- **AND** verifies Brand Menu accessibility
- **AND** ensures proper foreign key constraints

#### Scenario: Data completeness check
- **WHEN** seeding finishes
- **THEN** system verifies all required records created
- **AND** checks for missing metadata
- **AND** validates image uploads and file references
- **AND** generates seeding completion report

### Requirement: Seeding Script Utilities
The system SHALL provide utilities for managing seeded data.

#### Scenario: Seeding reset functionality
- **WHEN** user needs to reset seeded data
- **THEN** system provides reset script option
- **AND** removes only seeded records (preserves user data)
- **AND** handles cascading deletions properly
- **AND** provides backup before reset

#### Scenario: Selective seeding options
- **WHEN** running seeding script
- **THEN** system allows selective seeding by entity type
- **AND** provides options for brands-only, categories-only, or full seeding
- **AND** supports incremental seeding additions
- **AND** includes dry-run mode for preview