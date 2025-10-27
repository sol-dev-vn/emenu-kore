## Why
The current /hub page uses a card-based grid navigation that doesn't provide a professional administrative interface. A standard sidebar layout will improve navigation, scalability, and user experience for restaurant staff management.

## What Changes
- Replace card-based grid layout with standard sidebar navigation
- Create consistent navigation structure: Overview, Menu Management, Branch Management, Table Layouts
- Add dedicated user profile and settings pages
- Move user info widget from top header to bottom of sidebar
- Add fixed breadcrumb and heading component at top of main content area
- Add QR Code management under Table Management with print/download functionality
- Implement QR code detection logic on home page with table status display
- **BREAKING**: Complete UI/UX restructuring of the /hub interface

## Impact
- Affected specs: New capabilities needed for hub-layout, user-profile, system-settings, qr-management
- Affected code: src/app/hub/page.tsx (complete rebuild), new route structure for sidebar navigation, QR detection logic in home page