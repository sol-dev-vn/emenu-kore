## Why

The current hub portal at `/hub` is a functional prototype with static mock data and basic UI structure. However, it lacks real functionality, proper loading states, Tailwind CSS best practices, and integration with the actual Directus backend. Staff members cannot perform actual operations like managing tables, viewing live dashboard data, generating QR codes, or switching between branches. The authentication system is not properly configured with Directus, and there are no proper loading animations or content transitions.

## What Changes

- **Enhanced Tailwind CSS Implementation**: Replace basic styling with proper Tailwind CSS v4 best practices, including proper spacing, consistent color palette, design system tokens, and responsive design patterns
- **Loading Animations**: Implement proper loading states with blur-to-fade transitions when content changes, skeleton loaders for data-heavy sections, and smooth transitions between different views
- **Dynamic Branch Selection**: Replace static branch selector with functional branch switching based on user permissions, with proper data loading and context updates
- **Table Management and Zoning**: Implement real table listing with zone organization, table status tracking (available, occupied, needs cleaning), and visual table layout editor
- **Live Operation Dashboard**: Create real-time dashboard showing actual table status with item counts, guest counts, bill statuses, order progress, and staff performance metrics
- **QR Code Generation and Printing**: Add functionality to generate QR codes for tables, create A4-size PDF layouts for printing, and manage QR code templates
- **Menu Item Listing by Category**: Implement read-only menu viewing organized by categories with search functionality, item details, and pricing information
- **Directus Authentication Integration**: Configure proper authentication with Directus using email/password and phone/password login methods as per Directus authentication API
- **Navigation Updates**: Remove Orders from sidemenu temporarily and update navigation structure to focus on core hub functionality

## Impact

**Affected Specs:**
- staff-portal (enhanced functionality)
- qr-management (enhanced functionality)
- user-auth (enhanced functionality)
- access-control (enhanced functionality)

**Affected Code:**
- Frontend hub components (`/emenu/src/routes/hub/`)
- QR code generation and printing functionality
- Authentication system integration with Directus
- API endpoints for real-time data
- Loading animation and transition components
- Table management interfaces

**Breaking Changes:**
- **Authentication Flow**: Users will need to re-authenticate with proper Directus credentials
- **Navigation Structure**: Orders menu item removed from sidemenu
- **Data Sources**: Mock data replaced with real Directus API calls

**New Dependencies:**
- QR code generation library (if not already present)
- PDF generation library for QR code printing
- Real-time data subscriptions (WebSockets or similar)
- Additional Directus SDK authentication features

**Security Considerations:**
- Proper Directus token management and refresh
- Role-based access control enforcement
- QR code security and session management
- Secure API communication patterns