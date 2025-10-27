## ADDED Requirements

### Requirement: Standardized Two-Layout System
The application SHALL implement exactly two layout patterns to serve all page types consistently.

#### Scenario: Public layout usage
- **WHEN** user accesses homepage or public-facing pages
- **THEN** system SHALL apply PublicLayout with centered peach-red gradient background
- **AND** navigation SHALL be limited to essential public actions

#### Scenario: Hub layout usage
- **WHEN** user accesses any /hub/* route
- **THEN** system SHALL apply HubLayout with sidebar navigation
- **AND** user SHALL be authenticated through HubAuthGuard
- **AND** layout SHALL adapt to user permissions

### Requirement: Layout Routing Logic
The application SHALL use clear, deterministic routing logic to select appropriate layout.

#### Scenario: Layout selection
- **WHEN** routing to any page
- **THEN** system SHALL use getLayoutType() to determine layout
- **AND** public routes (/ /login) SHALL use PublicLayout
- **AND** hub routes (/hub/*) SHALL use HubLayout
- **AND** dynamic routes SHALL use appropriate layout based on path

## MODIFIED Requirements

### Requirement: Public Layout Structure
The PublicLayout SHALL provide consistent centered layout for all public-facing pages.

#### Scenario: Public page rendering
- **WHEN** rendering public pages
- **THEN** layout SHALL use peach-red gradient background (from-brand-primary to-[#5a0f10])
- **AND** content SHALL be centered with consistent spacing
- **AND** navigation SHALL be minimal and contextually appropriate
- **AND** all public pages SHALL inherit identical layout structure

#### Scenario: Homepage specific layout
- **WHEN** user accesses root path (/)
- **THEN** page SHALL use PublicLayout instead of inline layout
- **AND** remove existing inline layout code from [[...permalink]]/page.tsx
- **AND** maintain visual consistency with other public pages

### Requirement: Hub Layout Structure
The HubLayout SHALL provide consistent admin dashboard layout for all authenticated users.

#### Scenario: Hub page rendering
- **WHEN** user accesses any /hub/* route
- **THEN** layout SHALL display HubSidebar navigation
- **AND** show HubHeader with breadcrumb support
- **AND** apply gray-white background gradient (from-white via-gray-50 to-gray-100)
- **AND** adapt navigation based on user roles and permissions

#### Scenario: Authentication integration
- **WHEN** accessing hub routes
- **THEN** HubAuthGuard SHALL protect all /hub/* routes consistently
- **AND** unauthenticated users SHALL be redirected to homepage (/)
- **AND** loading states SHALL be handled uniformly
- **AND** access denied SHALL be handled consistently

## REMOVED Requirements

### Requirement: Default Layout Pattern
**Reason**: Simplified to exactly two layouts eliminates need for additional default layout
**Migration**: All routes that used default layout SHALL be redirected to appropriate PublicLayout or HubLayout

### Requirement: Visual Editing Layout
**Reason**: Removing visual editing functionality simplifies system architecture
**Migration**: Any existing VisualEditingLayout usage SHALL be removed and replaced with appropriate standard layout