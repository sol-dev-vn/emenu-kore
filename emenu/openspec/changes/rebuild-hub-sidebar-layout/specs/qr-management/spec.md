## ADDED Requirements
### Requirement: QR Code Management Interface
The system SHALL provide a QR code generation and management interface for restaurant tables.

#### Scenario: Branch selection for QR codes
- **WHEN** user accesses /hub/qr page
- **THEN** system SHALL display a branch selector dropdown

#### Scenario: Table QR codes display
- **WHEN** user selects a branch
- **THEN** system SHALL display all tables for that branch as QR codes in a grid layout

#### Scenario: QR code format specification
- **WHEN** generating QR codes for tables
- **THEN** each QR code SHALL contain URL: https://www.sol.com.vn/?tid=[table-id]

#### Scenario: QR code error correction
- **WHEN** generating QR codes
- **THEN** medium error correction level SHALL be used for reliability

#### Scenario: Print all QR codes
- **WHEN** user clicks "Print All" button
- **THEN** system SHALL generate A4 formatted print layout with all table QR codes

#### Scenario: Download QR codes PDF
- **WHEN** user clicks "Download PDF" button
- **THEN** system SHALL generate and download A4 PDF with all table QR codes

#### Scenario: Individual table QR code
- **WHEN** viewing QR code grid
- **THEN** each QR code SHALL display table name/number below the code

### Requirement: QR Code Batch Operations
The system SHALL support batch operations for QR code management.

#### Scenario: Select multiple tables
- **WHEN** user wants to generate QR codes for specific tables
- **THEN** system SHALL allow selection of multiple tables

#### Scenario: Print selected QR codes
- **WHEN** user selects specific tables and clicks print
- **THEN** system SHALL generate print layout with only selected table QR codes

#### Scenario: QR code preview
- **WHEN** user hovers over a QR code
- **THEN** system SHALL show larger preview with table details

## ADDED Requirements
### Requirement: QR Code Detection Logic
The system SHALL detect and handle QR code table IDs from URL parameters.

#### Scenario: URL parameter detection
- **WHEN** user accesses the home page with ?tid=[table-id] parameter
- **THEN** system SHALL automatically extract the table ID from URL

#### Scenario: QR code navigation
- **WHEN** table ID is detected in URL
- **THEN** system SHALL redirect user to /qr/[table-id] page

#### Scenario: Invalid table ID handling
- **WHEN** invalid or non-existent table ID is provided
- **THEN** system SHALL display error message and redirect to home page

### Requirement: Table Status Display
The system SHALL display current table status information to users.

#### Scenario: Table information display
- **WHEN** user navigates to /qr/[table-id]
- **THEN** system SHALL display table name, branch location, and current status

#### Scenario: Table status indicators
- **WHEN** viewing table status
- **THEN** system SHALL show availability status (Available, Occupied, Reserved)

#### Scenario: Open eMenu button
- **WHEN** table is available
- **THEN** system SHALL display "Open eMenu" button that links to menu interface

#### Scenario: Menu access
- **WHEN** user clicks "Open eMenu" button
- **THEN** system SHALL navigate to menu interface (dummy link for now)

#### Scenario: Mobile responsive table status
- **WHEN** viewing on mobile device
- **THEN** table status display SHALL be optimized for mobile viewing