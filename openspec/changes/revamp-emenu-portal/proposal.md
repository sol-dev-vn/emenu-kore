## Why

The current eMenu system lacks a comprehensive public-facing ordering interface and an internal staff portal for restaurant management. Customers cannot easily access table-specific menus via QR codes, and staff have no centralized hub for managing operations, viewing analytics, or handling administrative tasks. The existing system also lacks proper role-based access control and user authentication via phone numbers.

## What Changes

- **Public QR Code Ordering Interface**: Transform the main landing page to allow camera access for QR code scanning, directing customers to table-specific ordering menus
- **Internal Staff Portal**: Rename `/portal` to `/hub` and create a comprehensive internal management interface for restaurant staff at all levels
- **Role-Based Access Control**: Implement granular permissions for different user roles (Brand Manager, Branch Manager, HQ Staff, CEO, CFO, Accountants)
- **QR Code Management**: Add functionality for Branch Managers to generate and print A4-size PDFs with table QR codes
- **Enhanced User Authentication**: Add phone number-based login with international format support (+84 default for Vietnam)
- **Contextual UI Components**: Create reusable components to display current Brand/Branch/HQ context and user role in the sidemenu
- **URL Structure**: Implement clean QR code URLs in format `http://sol-menu.alphabits.team/qr/[table-id]`

## Impact

**Affected Specs:**
- customer-facing (new capability)
- staff-portal (new capability)
- qr-management (new capability)
- user-auth (existing capability - modified)
- access-control (new capability)

**Affected Code:**
- Frontend routing structure (`/emenu/src/routes/`)
- Authentication system (`/emenu/src/lib/directus.js`)
- User management in Directus CMS
- QR code generation and printing functionality
- Role-based permission system
- UI component library for sidemenu context display

**Breaking Changes:**
- **Route Change**: `/portal` renamed to `/hub` - existing bookmarks will need updating
- **Authentication**: Phone number field becomes unique and required for all users
- **User Interface**: New role-based access restrictions may limit existing user access

**Database Schema Changes:**
- Add `phone_number` field to `directus_users` with unique constraint
- Add `current_brand`, `current_branch`, `current_hq` fields to user session/context
- Create new collections for QR code templates and table management
- Update user role permissions in Directus roles system

**Security Considerations:**
- Phone number verification and validation
- Role-based access control implementation
- QR code security and table session management
- Secure session management for staff portal access