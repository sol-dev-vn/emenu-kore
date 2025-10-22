## MODIFIED Requirements
### Requirement: Simplified Branch Hub Page Display
The system SHALL provide a streamlined branches hub page that groups branches by brand and displays essential information only.

#### Scenario: View branches grouped by brand
- **WHEN** user navigates to the branches hub page
- **THEN** all branches are displayed grouped by brand
- **AND** each branch shows name, code, total tables, and active tables only
- **AND** no search or filter options are available
- **AND** no Add Branch button is displayed
- **AND** no statistics bar or metrics dashboard is shown

#### Scenario: View simplified branch information
- **WHEN** user views a branch card
- **THEN** only branch name, code, total tables, and active tables are displayed
- **AND** branch status (active/maintenance) is not shown
- **AND** no Edit functionality is available
- **AND** no detailed branch information is displayed
- **AND** active tables count reflects currently available tables

#### Scenario: View brand statistics
- **WHEN** user views a brand group
- **THEN** total number of branches is shown
- **AND** total tables across all branches is displayed
- **AND** all branches for the brand are listed without pagination
- **AND** no separate statistics cards are displayed on the page

#### Scenario: Clean data presentation
- **WHEN** user accesses the branches page
- **THEN** no search input is available
- **AND** no filter options are displayed
- **AND** no Add Branch functionality is present
- **AND** no statistics bar with metrics is shown
- **AND** all brands and branches are immediately visible