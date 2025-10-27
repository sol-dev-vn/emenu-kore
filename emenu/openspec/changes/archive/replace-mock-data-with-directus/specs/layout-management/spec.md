## ADDED Requirements

### Requirement: Layout Data Integration
The system SHALL fetch and display real table layout data from Directus instead of mock layout data.

#### Scenario: Layout loading and display
- **WHEN** user navigates to Table Layouts page
- **THEN** system loads all layouts with their associated branches
- **AND** displays layout names, branch assignments, and table counts
- **AND** shows layout status and last modification information from Directus

#### Scenario: Layout details with real table data
- **WHEN** viewing specific layout details
- **THEN** system displays actual table configurations
- **AND** shows real table counts, zones, and capacity information
- **AND** displays table shapes and positions from layout data
- **AND** includes layout modification history and user information

### Requirement: Table Configuration Integration
The system SHALL manage real table configurations with capacity, zones, and QR code assignments.

#### Scenario: Table configuration display
- **WHEN** layout is viewed or edited
- **THEN** all table data reflects actual table configurations
- **AND** table capacities, zones, and types are accurate
- **AND** table positions and shapes are displayed correctly
- **AND** QR code URLs are generated using real table IDs

#### Scenario: Table availability and status
- **WHEN** table status changes (occupied, available, maintenance)
- **THEN** system updates table status in real-time
- **AND** reflects changes in layout interface
- **AND** updates QR code availability accordingly

### Requirement: QR Code Generation Integration
The system SHALL generate QR codes using real table data and branch information.

#### Scenario: QR code generation
- **WHEN** generating QR codes for tables
- **THEN** system uses real table IDs and branch information
- **AND** generates correct QR code URLs format: `http://sol-menu.alphabits.team/qr/[table-id]`
- **AND** includes table numbers and branch branding as configured
- **AND** supports PDF generation with actual table layouts

#### Scenario: QR code management
- **WHEN** managing QR codes
- **THEN** system tracks generation history with real table data
- **AND** shows QR code status and usage statistics
- **AND** allows regeneration with updated table information

## MODIFIED Requirements

### Requirement: Layout Management Interface
The system SHALL provide layout management interface using real data with proper loading and error states.

#### Scenario: Layout listing and filtering
- **WHEN** viewing layout listings
- **THEN** all layout data comes from Directus with accurate branch associations
- **AND** search and filtering work with real layout names and branches
- **AND** layout statistics reflect actual table configurations
- **AND** sorting works with real modification dates and user data

#### Scenario: Layout template selection
- **WHEN** using layout templates
- **THEN** templates generate layouts with realistic table counts
- **AND** zone configurations match actual restaurant needs
- **AND** template customization works with real table types and capacities

### Requirement: Layout Statistics and Monitoring
The system SHALL display real layout statistics based on actual table and usage data.

#### Scenario: Layout performance metrics
- **WHEN** viewing layout statistics
- **THEN** system shows actual table counts and capacity utilization
- **AND** displays real QR code scan data and usage patterns
- **AND** reflects actual modification history and user activity
- **AND** provides accurate last update timestamps

#### Scenario: Branch-specific layout information
- **WHEN** viewing layouts by branch
- **THEN** system filters layouts by actual branch relationships
- **AND** displays branch-specific table configurations
- **AND** shows branch contact and operational information
- **AND** maintains accurate layout assignment per branch