# Brand Menu Data Integration Specification

## ADDED Requirements

### Requirement: Brand Menu Data Integration
**Requirement**: The system SHALL fetch and display real brand menu data from Directus brand_menus collection instead of using mock data.

#### Scenario: Brand menu loading
- **WHEN** user navigates to brand menu page
- **THEN** system fetches all active brand menus from Directus
- **AND** filters menus by user's brand permissions
- **AND** displays menu information including name, description, item count, and currency
- **AND** shows loading states during data fetching
- **AND** handles empty states when no menus exist

#### Scenario: Brand menu data error handling
- **WHEN** Directus API is unavailable or returns error
- **THEN** system displays appropriate error message with retry options
- **AND** maintains previously loaded data if available
- **AND** provides clear error recovery path

### Requirement: Menu Category Integration
**Requirement**: The system SHALL fetch and display menu categories from Directus menu_categories collection and group menu items accordingly.

#### Scenario: Category structure display
- **WHEN** brand menu is selected and loaded
- **THEN** system fetches all categories associated with menu items
- **AND** displays categories in expandable/collapsible format
- **AND** shows item count per category
- **AND** maintains category hierarchy if present
- **AND** supports category ordering via sort field

#### Scenario: Category-based filtering
- **WHEN** user clicks on a specific category
- **THEN** system filters menu items to show only items from that category
- **AND** updates item count displays accordingly
- **AND** maintains category expansion state
- **AND** provides clear visual indication of active category

### Requirement: Menu Items Data Integration
**Requirement**: The system SHALL fetch and display real menu items from Directus menu_items collection with full product details.

#### Scenario: Menu items loading and display
- **WHEN** brand menu and categories are loaded
- **THEN** system fetches all menu items for the selected brand menu
- **AND** displays items with name, description, price, images, and availability
- **AND** groups items under appropriate categories
- **AND** shows item currency and tax information
- **AND** handles item images from Directus files collection
- **AND** supports dietary information and allergen display

#### Scenario: Real-time menu item updates
- **WHEN** menu item data changes in Directus (price, availability, description)
- **THEN** system automatically refreshes item display
- **AND** updates UI without requiring page refresh
- **AND** maintains user context during updates (selected category, scroll position)
- **AND** shows change indicators for recently modified items

### Requirement: Brand-Specific Menu Configuration
**Requirement**: The system SHALL support brand-specific menu configurations including currency, tax rates, and service charges.

#### Scenario: Brand configuration display
- **WHEN** brand menu is displayed
- **THEN** system shows brand-specific currency (VND, USD, etc.)
- **AND** displays tax rate and service charge from brand menu settings
- **AND** applies brand-specific formatting for prices and calculations
- **AND** maintains separate configurations per brand
- **AND** allows brand-level menu overrides where specified