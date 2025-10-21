## ADDED Requirements
### Requirement: Visual Table Layout Display
The system SHALL provide visual representation of restaurant table layouts for branch management.

#### Scenario: View branch table layout
- **WHEN** user navigates to a branch detail page and selects the Layout tab
- **THEN** the restaurant's table layout SHALL be displayed visually
- **AND** tables SHALL be positioned according to their actual coordinates
- **AND** tables SHALL be grouped by zones with visual indicators
- **AND** table status SHALL be shown using color coding (green=available, red=occupied, yellow=reserved)

#### Scenario: Interactive table information display
- **WHEN** user hovers over a table in the layout
- **THEN** table information SHALL appear in a tooltip (name, capacity, zone)
- **AND** current session status SHALL be displayed if active
- **AND** QR code URL SHALL be shown for customer access

#### Scenario: Table detail modal
- **WHEN** user clicks on a table in the layout
- **THEN** a modal SHALL open with detailed table information
- **AND** modal SHALL show table name, capacity, zone, and current status
- **AND** QR code SHALL be displayed for scanning
- **AND** current session information SHALL be shown if table is occupied

#### Scenario: Multiple layout support
- **WHEN** a branch has multiple dining layouts (restaurant, bar, outdoor)
- **THEN** layout selector tabs SHALL be displayed
- **AND** user SHALL switch between different layout views
- **AND** selected layout SHALL persist in URL parameters
- **AND** layout switching SHALL be smooth and responsive

### Requirement: Zone Organization and Visualization
The system SHALL provide clear organization of tables by zones within the layout.

#### Scenario: Zone boundary visualization
- **WHEN** viewing a table layout
- **THEN** zone boundaries SHALL be visually indicated
- **AND** each zone SHALL have a distinct background color or border
- **AND** zone names SHALL be clearly labeled

#### Scenario: Zone table grouping
- **WHEN** tables are assigned to zones
- **THEN** tables SHALL be visually grouped within their zones
- **AND** zone assignment SHALL be maintained in all layout views
- **AND** zone information SHALL be accessible in table details

#### Scenario: Zone statistics display
- **WHEN** viewing a branch layout
- **THEN** zone statistics SHALL be displayed (table count, total capacity)
- **AND** current availability per zone SHALL be shown
- **AND** zone occupancy rates SHALL be calculated and displayed

## MODIFIED Requirements
### Requirement: Branch Detail Page Structure
The system SHALL provide comprehensive branch information with integrated layout viewing.

#### Scenario: Branch detail page layout
- **WHEN** user navigates to `/hub/branches/[branch-id]`
- **THEN** branch header SHALL display basic information (name, address, contact)
- **AND** tabbed interface SHALL organize different sections (Layout, Menu, Settings)
- **AND** Layout tab SHALL be selected by default
- **AND** breadcrumb navigation SHALL show navigation path

#### Scenario: Layout tab functionality
- **WHEN** user selects the Layout tab
- **THEN** table layout viewer SHALL be displayed
- **AND** layout controls SHALL allow switching between different layouts
- **AND** layout statistics SHALL be shown (total tables, capacity, zones)
- **AND** real-time table status SHALL be updated if data is available