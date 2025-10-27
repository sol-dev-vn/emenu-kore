## ADDED Requirements

### Requirement: Brand Menu Data Integration
The system SHALL fetch and display real brand menu data from Directus CMS instead of mock menu data.

#### Scenario: Brand menu loading
- **WHEN** user navigates to Menu Management page
- **THEN** system loads all brand menus with their associated menu items
- **AND** displays accurate menu item counts per brand
- **AND** shows menu currency, tax rates, and service rates from Directus

#### Scenario: Brand menu creation
- **WHEN** a brand exists but has no menu
- **THEN** system automatically creates a default brand menu
- **AND** sets default currency, tax rate, and service rate based on brand settings
- **AND** makes the menu active and available for branch configuration

### Requirement: Branch Menu Item Integration
The system SHALL manage branch-specific menu items as selectable subsets of brand menu items.

#### Scenario: Branch menu item selection
- **WHEN** configuring branch menu
- **THEN** system displays all available brand menu items
- **AND** allows selection/deselection of items for the branch
- **AND** maintains custom pricing and availability notes per branch
- **AND** shows real-time selection progress with percentage bars

#### Scenario: Branch menu customization
- **WHEN** branch menu items are customized
- **THEN** system saves custom pricing and availability notes
- **AND** maintains item-specific availability status
- **AND** updates branch menu statistics immediately

### Requirement: Menu Item Real-time Data
The system SHALL fetch and display real menu item data with pricing, categories, and availability.

#### Scenario: Menu item display
- **WHEN** brand menu is viewed
- **THEN** all menu items display real names, descriptions, and prices
- **AND** menu item categories and organization reflect actual data
- **AND** menu item images and thumbnails are loaded from Directus files
- **AND** dietary information and allergens are displayed accurately

#### Scenario: Menu item updates
- **WHEN** menu items are updated in Directus
- **THEN** changes are reflected in the hub interface immediately
- **AND** price changes are updated across all affected branches
- **AND** availability changes impact branch menu configurations

## MODIFIED Requirements

### Requirement: Menu Statistics Display
The system SHALL calculate and display real menu statistics based on actual data instead of mock statistics.

#### Scenario: Brand menu statistics
- **WHEN** brand menu is displayed
- **THEN** system shows actual count of menu items
- **AND** displays real number of categories
- **AND** calculates total menu value based on actual prices
- **AND** shows last update timestamp from Directus

#### Scenario: Branch menu statistics
- **WHEN** branch menu is displayed
- **THEN** system shows count of selected items vs total brand items
- **AND** displays accurate percentage of menu coverage
- **AND** calculates branch menu value based on selected items and custom pricing
- **AND** reflects real-time availability status

### Requirement: Menu Management Interface
The system SHALL provide menu management interface using real data with proper loading and error states.

#### Scenario: Menu management navigation
- **WHEN** user navigates between Brand Menus and Branch Menus
- **THEN** all menu data loads from Directus with proper transitions
- **AND** loading states are displayed during data fetching
- **AND** error handling provides retry options for failed requests

#### Scenario: Menu item operations
- **WHEN** performing menu item operations (view, edit, configure)
- **THEN** all operations use real menu item IDs and data
- **AND** changes are immediately reflected in the interface
- **AND** data validation ensures menu integrity