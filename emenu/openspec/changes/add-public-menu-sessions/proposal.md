## Why

To provide a dedicated public menu experience for guest users who scan QR codes at restaurant tables. This creates a customer-facing interface that allows browsing menu items, customizing user profiles, and participating in table sessions without requiring authentication. The current system only has admin-facing table management pages, lacking a customer-friendly menu browsing experience.

## What Changes

- **Add Public Menu Layout**: Create a new `MenuLayout` specifically for guest user sessions at `/menu`
- **Guest User Management**: Implement session-based guest user profiles with renaming capabilities
- **Mock Menu Display**: Show branch-specific menu items with categories, pricing, and details
- **Table Session Integration**: Connect QR code scans to active table sessions
- **Mobile-Optimized Design**: Create a responsive interface optimized for smartphone usage
- **Session State Management**: Handle guest session state without authentication requirements
- **Navigation Flow**: Implement proper routing from QR scan to menu interface

## Impact

- **New Route**: `/menu` endpoint for public menu access
- **New Layout**: `MenuLayout` component for guest-facing interfaces
- **Guest Context**: New context provider for guest user session management
- **Mock Data**: Temporary menu data structure matching Directus schemas
- **Component Expansion**: New components for menu display, cart, and user profile
- **Route Updates**: Modified layout utilities to handle menu route type
- **Styling**: Mobile-first responsive design following brand color system
- **Session Flow**: Integration between QR scanning and menu access patterns

This change expands the application from admin-only functionality to include customer-facing features, enabling the core eMenu experience for restaurant guests while maintaining the existing admin dashboard capabilities.