## ADDED Requirements

### Requirement: Brand Data Integration
The system SHALL fetch and display real brand data from Directus CMS instead of using mock data.

#### Scenario: Successful brand data loading
- **WHEN** user navigates to Branch Management page
- **THEN** system loads all active brands from Directus with proper sorting
- **AND** displays brand information including name, description, logo, and branch count
- **AND** shows loading states during data fetching

#### Scenario: Brand data loading error
- **WHEN** Directus API is unavailable or returns error
- **THEN** system displays appropriate error message
- **AND** provides retry functionality
- **AND** maintains previously loaded data if available

### Requirement: Branch Data Integration
The system SHALL fetch and display real branch data from Directus with proper brand relationships.

#### Scenario: Branch data with brand association
- **WHEN** brands are loaded successfully
- **THEN** system fetches all active branches for each brand
- **AND** displays branch information including name, code, table count, and active tables
- **AND** groups branches under their respective brands

#### Scenario: Real-time branch updates
- **WHEN** branch data changes in Directus (new branch, updated info, etc.)
- **THEN** system automatically refreshes branch data
- **AND** updates UI without requiring page refresh
- **AND** maintains user context during updates

### Requirement: Table Count Integration
The system SHALL calculate and display real table counts for each branch based on actual table data.

#### Scenario: Accurate table statistics
- **WHEN** branch data is displayed
- **THEN** system calculates total tables per branch from tables collection
- **AND** determines active tables based on current sessions or availability
- **AND** displays real-time table occupancy statistics

#### Scenario: Table count updates
- **WHEN** table status changes (occupied, available, maintenance)
- **THEN** system updates active table counts immediately
- **AND** reflects changes in branch statistics
- **AND** maintains accurate totals across all branches

## MODIFIED Requirements

### Requirement: Brand Group Display
The system SHALL display brands grouped with their branches using real data from Directus instead of mock data.

#### Scenario: Brand hierarchy display
- **WHEN** brand data is loaded
- **THEN** system displays each brand with all associated branches
- **AND** shows real brand logos from Directus files
- **AND** includes accurate branch counts and statistics
- **AND** maintains expand/collapse functionality for brand groups

#### Scenario: Brand information accuracy
- **WHEN** brand information is displayed
- **THEN** all brand details match Directus data exactly
- **AND** brand colors and styling are applied from brand settings
- **AND** brand descriptions and metadata are displayed correctly

### Requirement: Branch Card Display
The system SHALL display branch cards with real-time data instead of static mock data.

#### Scenario: Branch card with real data
- **WHEN** branch card is rendered
- **THEN** branch name, code, and descriptions come from Directus
- **AND** table counts reflect actual table configuration
- **AND** active table counts show current real-time status
- **AND** branch status indicators reflect actual operational state

#### Scenario: Branch card interactions
- **WHEN** user interacts with branch cards
- **THEN** all navigation and actions use real branch IDs
- **AND** branch-specific operations work with actual data
- **AND** changes are reflected immediately in the UI