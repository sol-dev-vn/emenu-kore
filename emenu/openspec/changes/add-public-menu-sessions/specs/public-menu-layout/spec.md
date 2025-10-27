# Public Menu Layout Specification

## ADDED Requirements

### Requirement: Public Menu Route Support
The system SHALL provide public menu route support for guest users accessing `/menu` without authentication requirements and maintain table session context.

#### Scenario: Guest user accesses menu after QR scan
- **WHEN** a guest user navigates to `/menu` with session context after scanning QR code
- **THEN** system SHALL display mobile-optimized menu interface
- **AND** SHALL NOT require authentication
- **AND** SHALL maintain table session context
- **AND** SHALL enable menu item browsing by category

### Requirement: Guest User Session Management
The system SHALL manage guest user sessions without authentication requirements by creating temporary profiles with customizable naming.

#### Scenario: Guest joins table session
- **WHEN** a guest user joins a table session for the first time
- **THEN** system SHALL assign default guest name (e.g., "Guest 1")
- **AND** SHALL allow display name customization
- **AND** SHALL persist session without authentication
- **AND** SHALL maintain preferences during visit

### Requirement: Mobile-First Menu Display
The system SHALL provide mobile-first menu display with touch-optimized interactions and responsive layout adaptation.

#### Scenario: Mobile menu interaction
- **WHEN** guest user interacts with menu on mobile device
- **THEN** system SHALL provide 44px minimum tap targets
- **AND** SHALL enable horizontal category swiping
- **AND** SHALL ensure readable text without zooming
- **AND** SHALL adapt to portrait and landscape orientations

### Requirement: Table Session Integration
The system SHALL integrate table session context with menu display by loading branch-specific menu data and maintaining table awareness.

#### Scenario: QR code redirects to menu
- **WHEN** guest user scans QR code and is redirected to menu
- **THEN** system SHALL display branch-specific menu items
- **AND** SHALL show table number and branch information
- **AND** SHALL maintain current table session context

### Requirement: Mock Menu Data Structure
The system SHALL use mock menu data matching Directus schema structure including categories, pricing, descriptions, dietary information, and preparation times.

#### Scenario: Development mode menu display
- **WHEN** system displays menu items in development mode
- **THEN** system SHALL include Directus-compatible categories
- **AND** SHALL display pricing and descriptions
- **AND** SHALL include dietary information
- **AND** SHALL show preparation times
- **AND** SHALL maintain future Directus integration compatibility

### Requirement: Guest User Profile Management
The system SHALL provide guest user profile management allowing immediate display name changes and preference persistence.

#### Scenario: Profile customization
- **WHEN** guest user taps profile icon to personalize experience
- **THEN** system SHALL enable display name editing
- **AND** SHALL reflect changes immediately in interface
- **AND** SHALL persist preferences during session

### Requirement: Navigation Flow Consistency
The system SHALL maintain navigation flow consistency with smooth transitions and session state preservation during category navigation.

#### Scenario: Category navigation
- **WHEN** guest user navigates between menu categories
- **THEN** system SHALL preserve session state
- **AND** SHALL provide smooth transitions
- **AND** SHALL enable back navigation without data loss

### Requirement: Brand Consistency
The system SHALL maintain brand consistency in public menu interface using established color system and admin interface styling patterns.

#### Scenario: Visual element display
- **WHEN** guest user views public menu interface
- **THEN** system SHALL use ruby red (#9B1D20) for primary actions
- **AND** SHALL use peach-red (#FFE4E1) for soft backgrounds
- **AND** SHALL use dark gray (#333333) for text readability
- **AND** SHALL maintain admin interface styling consistency