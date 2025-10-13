## 1. Database Schema and User Management
- [ ] 1.1 Add unique phone_number field to directus_users collection
  - [ ] 1.1.1 Set field type as string with international format validation
  - [ ] 1.1.2 Set default country code to +84 (Vietnam)
  - [ ] 1.1.3 Add unique constraint and validation rules
  - [ ] 1.1.4 Update existing users with placeholder phone numbers
- [ ] 1.2 Create role-based permission system in Directus
  - [ ] 1.2.1 Define Brand Manager role with brand-scoped permissions
  - [ ] 1.2.2 Define Branch Manager role with branch-scoped permissions
  - [ ] 1.2.3 Define Brand Staff role with branch-scoped permissions
  - [ ] 1.2.4 Define HQ Employee role (CEO, CFO, Accountants) with global permissions
  - [ ] 1.2.5 Configure collection permissions for each role
- [ ] 1.3 Create QR code management collections
  - [ ] 1.3.1 Create qr_templates collection for A4 PDF layouts
  - [ ] 1.3.2 Create table_sessions collection for active QR sessions
  - [ ] 1.3.3 Add qr_code_url field to branches_tables collection

## 2. Authentication System Enhancement
- [ ] 2.1 Update authentication flow to support phone number login
  - [ ] 2.1.1 Modify login form to accept phone number and password
  - [ ] 2.1.2 Add phone number validation and formatting
  - [ ] 2.1.3 Update Directus authentication client
  - [ ] 2.1.4 Add phone number verification and OTP functionality
- [ ] 2.2 Implement user context management
  - [ ] 2.2.1 Store current brand/branch/hq context in user session
  - [ ] 2.2.2 Create context switching functionality for multi-role users
  - [ ] 2.2.3 Add context validation middleware
- [ ] 2.3 Enhance session security
  - [ ] 2.3.1 Implement session timeout for staff portal
  - [ ] 2.3.2 Add role-based session validation
  - [ ] 2.3.3 Create logout functionality across all contexts

## 3. Public-Facing QR Code Interface
- [ ] 3.1 Create main landing page with QR scanning capability
  - [ ] 3.1.1 Implement camera access and permissions
  - [ ] 3.1.2 Integrate @yudiel/react-qr-scanner for mobile compatibility
  - [ ] 3.1.3 Add fallback manual table entry
  - [ ] 3.1.4 Design responsive mobile-first interface
- [ ] 3.2 Implement QR code routing and table session handling
  - [ ] 3.2.1 Create `/qr/[table-id]` route handler
  - [ ] 3.2.2 Validate table ID and create session
  - [ ] 3.2.3 Redirect to table-specific menu interface
  - [ ] 3.2.4 Handle invalid/expired QR codes gracefully
- [ ] 3.3 Design table-specific ordering interface
  - [ ] 3.3.1 Display table number and branch information
  - [ ] 3.3.2 Load branch-specific menu and pricing
  - [ ] 3.3.3 Implement order cart functionality
  - [ ] 3.3.4 Add order submission and confirmation

## 4. Internal Staff Portal (/hub)
- [ ] 4.1 Create main hub layout and navigation
  - [ ] 4.1.1 Design responsive dashboard layout
  - [ ] 4.1.2 Implement role-based navigation menu
  - [ ] 4.1.3 Create reusable sidemenu component
  - [ ] 4.1.4 Add context switching interface
- [ ] 4.2 Implement role-specific dashboards
  - [ ] 4.2.1 Brand Manager dashboard with brand analytics
  - [ ] 4.2.2 Branch Manager dashboard with branch operations
  - [ ] 4.2.3 HQ Employee dashboard with global overview
  - [ ] 4.2.4 CEO/CFO dashboard with financial metrics
- [ ] 4.3 Create contextual UI components
  - [ ] 4.3.1 UserContextDisplay component for sidemenu
  - [ ] 4.3.2 BrandContextDisplay with logo and colors
  - [ ] 4.3.3 BranchContextDisplay with location info
  - [ ] 4.3.4 RoleIndicator component for permissions

## 5. QR Code Management System
- [ ] 5.1 Implement QR code generation functionality
  - [ ] 5.1.1 Create QR code generation utility
  - [ ] 5.1.2 Generate table-specific QR codes with branch context
  - [ ] 5.1.3 Add QR code customization options (branding, colors)
  - [ ] 5.1.4 Implement bulk QR generation for all tables
- [ ] ] 5.2 Create PDF generation for A4 printing
  - [ ] 5.2.1 Design A4 layout templates for QR codes
  - [ ] 5.2.2 Add table information and instructions
  - [ ] 5.2.3 Include brand customization in templates
  - [ ] 5.2.4 Implement PDF download and print functionality
- [ ] 5.3 Build QR management interface
  - [ ] 5.3.1 Create QR code listing and search
  - [ ] 5.3.2 Add QR code preview and editing
  - [ ] 5.3.3 Implement QR code usage analytics
  - [ ] 5.3.4 Add QR code expiration and renewal

## 6. Access Control and Security
- [ ] 6.1 Implement middleware-based access control
  - [ ] 6.1.1 Create route protection middleware
  - [ ] 6.1.2 Implement role-based API access control
  - [ ] 6.1.3 Add data scoping based on user context
  - [ ] 6.1.4 Create permission checking utilities
- [ ] 6.2 Add audit logging and monitoring
  - [ ] 6.2.1 Log user access and actions
  - [ ] 6.2.2 Track QR code usage patterns
  - [ ] 6.2.3 Monitor failed authentication attempts
  - [ ] 6.2.4 Create admin dashboard for security monitoring
- [ ] 6.3 Implement data privacy measures
  - [ ] 6.3.1 Encrypt sensitive user data
  - [ ] 6.3.2 Implement GDPR-style data handling
  - [ ] 6.3.3 Add data retention policies
  - [ ] 6.3.4 Create user data export functionality

## 7. Integration and API Updates
- [ ] 7.1 Update existing API endpoints
  - [ ] 7.1.1 Add role-based filtering to menu endpoints
  - [ ] 7.1.2 Update user endpoints for phone number auth
  - [ ] 7.1.3 Add context-aware API responses
  - [ ] 7.1.4 Implement API rate limiting for public endpoints
- [ ] 7.2 Create new API endpoints for portal functionality
  - [ ] 7.2.1 QR code generation endpoints
  - [ ] 7.2.2 User context management endpoints
  - [ ] 7.2.3 Analytics and reporting endpoints
  - [ ] 7.2.4 Session management endpoints
- [ ] 7.3 Integrate with existing CukCuk sync system
  - [ ] 7.3.1 Ensure role-based data sync
  - [ ] 7.3.2 Update sync scripts for new user structure
  - [ ] 7.3.3 Add phone number sync to user data
  - [ ] 7.3.4 Test sync with role permissions

## 8. Testing and Quality Assurance
- [ ] 8.1 Unit testing for new components
  - [ ] 8.1.1 Test authentication flow with phone numbers
  - [ ] 8.1.2 Test QR code generation and validation
  - [ ] 8.1.3 Test role-based access control
  - [ ] 8.1.4 Test context switching functionality
- [ ] 8.2 Integration testing
  - [ ] 8.2.1 Test complete QR code ordering flow
  - [ ] 8.2.2 Test staff portal workflows
  - [ ] 8.2.3 Test API security and permissions
  - [ ] 8.2.4 Test database schema changes
- [ ] 8.3 End-to-end testing
  - [ ] 8.3.1 Test mobile QR scanning experience
  - [ ] 8.3.2 Test staff portal on different devices
  - [ ] 8.3.3 Test cross-browser compatibility
  - [ ] 8.3.4 Test performance under load

## 9. Documentation and Deployment
- [ ] 9.1 Update user documentation
  - [ ] 9.1.1 Create staff portal user guide
  - [ ] 9.1.2 Document QR code setup process
  - [ ] 9.1.3 Update API documentation
  - [ ] 9.1.4 Create troubleshooting guides
- [ ] 9.2 Prepare deployment plan
  - [ ] 9.2.1 Plan database migration strategy
  - [ ] 9.2.2 Prepare rollback procedures
  - [ ] 9.2.3 Schedule deployment windows
  - [ ] 9.2.4 Create user training materials
- [ ] 9.3 Monitoring and maintenance
  - [ ] 9.3.1 Set up application monitoring
  - [ ] 9.3.2 Create health check endpoints
  - [ ] 9.3.3 Implement error tracking
  - [ ] 9.3.4 Plan regular maintenance schedules

## 10. Launch and Post-Launch
- [ ] 10.1 User training and onboarding
  - [ ] 10.1.1 Train restaurant staff on new portal
  - [ ] 10.1.2 Provide QR code setup guides
  - [ ] 10.1.3 Create video tutorials for common tasks
  - [ ] 10.1.4 Set up user support channels
- [ ] 10.2 Performance monitoring
  - [ ] 10.2.1 Monitor QR code usage metrics
  - [ ] 10.2.2 Track staff portal adoption
  - [ ] 10.2.3 Monitor system performance
  - [ ] 10.2.4 Collect user feedback
- [ ] 10.3 Iterative improvements
  - [ ] 10.3.1 Analyze user behavior data
  - [ ] 10.3.2 Plan feature enhancements
  - [ ] 10.3.3 Address user-reported issues
  - [ ] 10.3.4 Optimize performance bottlenecks