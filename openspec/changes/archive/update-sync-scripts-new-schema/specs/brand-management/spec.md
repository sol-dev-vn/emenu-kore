## ADDED Requirements
### Requirement: Brand Entity Creation
The system SHALL create Brand entities from hardcoded brand mappings during synchronization.

#### Scenario: Brand entity initialization
- **WHEN** sync process encounters hardcoded brand ID for first time
- **THEN** system creates Brand entity with proper metadata
- **AND** sets brand name, color, description from configuration
- **AND** assigns unique identifier for Brand relationships

#### Scenario: Brand metadata population
- **WHEN** creating Brand entity
- **THEN** system populates contact information if available
- **AND** sets brand colors for UI theming
- **AND** configures website URL and social media links
- **AND** handles brand logo upload if image available

### Requirement: Brand Menu Creation
The system SHALL create Brand Menu entities for each Brand to contain master menu items.

#### Scenario: Default Brand Menu creation
- **WHEN** new Brand entity is created
- **THEN** system creates corresponding Brand Menu entity
- **AND** sets default currency to VND
- **AND** configures tax rate and service rate from brand settings
- **AND** sets Brand Menu as active for synchronization

#### Scenario: Brand Menu configuration
- **WHEN** creating Brand Menu
- **THEN** system configures menu-specific settings
- **AND** sets display name and description
- **AND** configures pricing defaults and tax settings
- **AND** establishes relationship to parent Brand

### Requirement: Brand Relationship Management
The system SHALL maintain proper relationships between Brands and related entities.

#### Scenario: Brand-Branch relationship assignment
- **WHEN** processing branch data
- **THEN** system assigns Branch to appropriate Brand
- **AND** validates Brand entity exists
- **AND** handles Brand assignment failures gracefully
- **AND** logs relationship creation for audit purposes

#### Scenario: Brand-Category relationship assignment
- **WHEN** processing category data
- **THEN** system assigns Category to appropriate Brand
- **AND** maintains category hierarchy within Brand context
- **AND** handles category thumbnail assignment
- **AND** validates Brand assignment consistency