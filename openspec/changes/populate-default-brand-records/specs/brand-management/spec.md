## ADDED Requirements
### Requirement: Default Brand Entity Creation
The system SHALL create default Brand entities for all SOL restaurant brands during initial data seeding.

#### Scenario: Brand entity initialization
- **WHEN** data seeding process runs
- **THEN** system creates 7 Brand entities from predefined configuration
- **AND** sets brand names: Miwaku Premium, S79 Japanese Teppanyaki, Kohaku Sashimi & Yakiniku, Kohaku Sushi, Kohaku Udon & Ramen, Date Nariya, Machida Shoten
- **AND** configures brand-specific colors and descriptions

#### Scenario: Brand metadata configuration
- **WHEN** creating Brand entities
- **THEN** system sets brand colors for UI theming
- **AND** adds contact information and website URLs
- **AND** configures brand-specific settings
- **AND** uploads placeholder brand logos

### Requirement: Brand Menu Initialization
The system SHALL create Brand Menu entities for each Brand during data seeding.

#### Scenario: Default Brand Menu creation
- **WHEN** Brand entities are created
- **THEN** system creates corresponding Brand Menu for each Brand
- **AND** sets default currency to VND
- **AND** configures tax rate (10%) and service rate (5%)
- **AND** establishes Brand-to-Brand Menu relationships

#### Scenario: Brand Menu configuration
- **WHEN** creating Brand Menus
- **THEN** system configures menu display settings
- **AND** sets menu availability status
- **AND** configures pricing and tax defaults
- **AND** enables menu for synchronization

### Requirement: Brand-Branch Relationship Assignment
The system SHALL assign existing Branches to appropriate Brands during data seeding.

#### Scenario: Branch Brand assignment
- **WHEN** processing existing branch data
- **THEN** system assigns branches to Brands based on hardcoded brand_id mappings
- **AND** updates branch-brand relationships
- **AND** validates assignment consistency
- **AND** logs relationship changes for audit

#### Scenario: Brand hierarchy validation
- **WHEN** all Brand relationships are established
- **THEN** system validates all branches have Brand assignments
- **AND** checks for orphaned branches
- **AND** verifies Brand Menu availability
- **AND** ensures proper data integrity