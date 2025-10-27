### Requirement: Layout System
The application SHALL provide consistent layout patterns for all page types.

#### Scenario: Public layout usage
- **WHEN** user accesses public-facing pages
- **THEN** system SHALL apply appropriate public layout

#### Scenario: Hub layout usage
- **WHEN** user accesses admin pages
- **THEN** system SHALL apply hub layout with authentication

#### Scenario: Layout selection
- **WHEN** routing to any page
- **THEN** system SHALL use layout selection logic
- **AND** SHALL apply consistent patterns