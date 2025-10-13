## ADDED Requirements

### Requirement: Directus Authentication Integration
The system SHALL properly configure authentication with Directus using email/password and phone/password login methods.

#### Scenario: User Login Interface
- **WHEN** a user accesses the hub login page
- **THEN** the system SHALL display a login form with email/phone and password fields
- **WHEN** choosing login method
- **THEN** the system SHALL provide option to login with email or phone number
- **WHEN** entering phone numbers
- **THEN** the system SHALL support international format with country code (+84 default for Vietnam)
- **WHEN** form validation occurs
- **THEN** the system SHALL validate email format and phone number format before submission

#### Scenario: Directus Authentication API Integration
- **WHEN** user submits login credentials
- **THEN** the system SHALL authenticate using Directus REST API authentication endpoints
- **WHEN** using email authentication
- **THEN** the system shall call Directus `/auth/login` with email and password
- **WHEN** using phone authentication
- **THEN** the system shall authenticate using phone number field and password
- **WHEN** authentication succeeds
- **THEN** the system shall receive access token, refresh token, and user information
- **WHEN** authentication fails
- **THEN** the system shall display appropriate error messages without revealing if user exists

#### Scenario: Token Management and Security
- **WHEN** authentication succeeds
- **THEN** the system SHALL store access token and refresh token securely
- **WHEN** storing tokens
- **THEN** the system shall use httpOnly cookies for enhanced security
- **WHEN** access tokens expire
- **THEN** the system shall automatically refresh using refresh token
- **WHEN** refresh tokens expire
- **THEN** the system shall redirect user to login page with session expiry message

### Requirement: Session Management and User Context
The system SHALL maintain proper session management and user context throughout the hub experience.

#### Scenario: User Session Establishment
- **WHEN** user successfully authenticates
- **THEN** the system SHALL establish user session with role and permission context
- **WHEN** loading user information
- **THEN** the system shall fetch user profile, roles, and assigned brands/branches
- **WHEN** setting user context
- **THEN** the system shall determine default brand and branch based on user permissions
- **WHEN** session is active
- **THEN** the system shall maintain session state across page navigation

#### Scenario: Permission-based Access Control
- **WHEN** user navigates to hub pages
- **THEN** the system SHALL validate user permissions for each requested resource
- **WHEN** checking brand access
- **THEN** the system shall verify user has permission to access current brand context
- **WHEN** checking branch access
- **THEN** the system shall ensure user can view selected branch information
- **WHEN** permission validation fails
- **THEN** the system shall display access denied message or redirect to authorized page

#### Scenario: Multi-Factor Authentication Support
- **WHEN** Directus is configured for MFA
- **THEN** the system shall support additional authentication factors
- **WHEN** MFA is required
- **THEN** the system shall display MFA input interface
- **WHEN** MFA verification succeeds
- **THEN** the system shall complete authentication process
- **WHEN** MFA verification fails
- **THEN** the system shall allow retry attempts with appropriate error messages

### Requirement: User Logout and Session Termination
The system SHALL provide secure logout functionality and proper session cleanup.

#### Scenario: User-Initiated Logout
- **WHEN** user clicks logout button
- **THEN** the system SHALL call Directus `/auth/logout` endpoint to invalidate tokens
- **WHEN** logout request succeeds
- **THEN** the system shall clear local session data and redirect to login page
- **WHEN** logout request fails
- **THEN** the system shall still clear local data for security
- **WHEN** redirecting after logout
- **THEN** the system shall display logout confirmation message

#### Scenario: Automatic Session Expiry
- **WHEN** user session expires due to inactivity
- **THEN** the system shall detect expired tokens and redirect to login
- **WHEN** session expires during user activity
- **THEN** the system shall attempt token refresh before forcing logout
- **WHEN** automatic logout occurs
- **THEN** the system shall display session expiry message
- **WHEN** user returns after expiry
- **THEN** the system shall require fresh authentication

#### Scenario: Security-Triggered Logout
- **WHEN** security events are detected (multiple failed attempts, suspicious activity)
- **THEN** the system shall immediately terminate user session
- **WHEN** admin forces user logout
- **THEN** the system shall invalidate user tokens and prevent new sessions
- **WHEN** password reset is required
- **THEN** the system shall logout user and redirect to password reset flow
- **WHEN** account is suspended or disabled
- **THEN** the system shall deny access and display appropriate message

### Requirement: User Profile and Preferences Management
The system SHALL provide user profile management and preference persistence.

#### Scenario: User Profile Display
- **WHEN** user is logged in
- **THEN** the system SHALL display user information in sidebar widget (not navigation header)
- **WHEN** showing user details
- **THEN** display name, role, current brand, and current branch from Directus user data
- **WHEN** user has avatar image
- **THEN** the system shall display avatar or fallback initials in the sidebar widget
- **WHEN** user information changes
- **THEN** the system shall update sidebar widget display immediately

#### Scenario: User Preference Storage
- **WHEN** user changes settings (language, theme, default branch)
- **THEN** the system SHALL save preferences to user profile in Directus
- **WHEN** loading user preferences
- **THEN** the system shall apply saved settings on login
- **WHEN** preferences are updated
- **THEN** the system shall sync changes across all user sessions
- **WHEN** default preferences are needed
- **THEN** the system shall use system defaults until user sets preferences

#### Scenario: Password Management
- **WHEN** user wants to change password
- **THEN** the system shall provide secure password change interface
- **WHEN** updating password
- **THEN** the system shall validate current password and enforce password policies
- **WHEN** password is changed successfully
- **THEN** the system shall invalidate other active sessions for security
- **WHEN** password reset is needed
- **THEN** the system shall integrate with Directus password reset flow

### Requirement: Authentication Error Handling and Security
The system SHALL provide robust error handling and security measures for authentication.

#### Scenario: Authentication Error Handling
- **WHEN** network errors occur during authentication
- **THEN** the system shall display user-friendly error messages with retry options
- **WHEN** Directus API is unavailable
- **THEN** the system shall show service unavailable message with estimated recovery time
- **WHEN** authentication timeout occurs
- **THEN** the system shall allow retry with increased timeout duration
- **WHEN** multiple failed attempts occur
- **THEN** the system shall implement rate limiting to prevent brute force attacks

#### Scenario: Security Monitoring and Logging
- **WHEN** authentication events occur
- **THEN** the system shall log all authentication attempts for security monitoring
- **WHEN** suspicious patterns are detected
- **THEN** the system shall trigger security alerts and potentially block access
- **WHEN** logging security events
- **THEN** the system shall capture IP address, user agent, and timestamp for audit trails
- **WHEN** analyzing authentication patterns
- **THEN** the system shall provide security analytics for administrators

#### Scenario: Cross-Site Request Forgery (CSRF) Protection
- **WHEN** handling authentication requests
- **THEN** the system shall implement CSRF token validation
- **WHEN** CSRF tokens are generated
- **THEN** the system shall include tokens in all authentication forms
- **WHEN** validating requests
- **THEN** the system shall verify CSRF tokens before processing authentication
- **WHEN** CSRF validation fails
- **THEN** the system shall reject request and log security event

### Requirement: Directus Role-Based Authentication and Access Control
The system SHALL implement comprehensive role-based authentication using Directus roles and permissions system.

#### Scenario: Role-Based User Interface
- **WHEN** a user authenticates with Directus
- **THEN** the system SHALL fetch user's role assignments from `directus_roles` collection
- **WHEN** determining user permissions
- **THEN** the system SHALL read permissions from `directus_permissions` for the user's roles
- **WHEN** user has multiple roles
- **THEN** the system SHALL aggregate permissions across all assigned roles
- **WHEN** permissions are loaded
- **THEN** the system SHALL configure UI elements and navigation based on allowed actions

#### Scenario: Dynamic Navigation and Feature Access
- **WHEN** user navigates to hub interface
- **THEN** the system SHALL show/hide navigation items based on user permissions
- **WHEN** user lacks permission for specific features
- **THEN** those features SHALL be hidden from navigation and UI
- **WHEN** user attempts to access restricted endpoints
- **THEN** the system SHALL return 403 Forbidden with appropriate error message
- **WHEN** user has elevated permissions (admin, manager)
- **THEN** additional management features SHALL be available in navigation

#### Scenario: Granular Permission Checking
- **WHEN** user performs any action (view, create, update, delete)
- **THEN** the system SHALL check specific permissions for that action and collection
- **WHEN** checking collection permissions
- **THEN** the system SHALL validate against `directus_permissions` for `collections` and `action` fields
- **WHEN** checking item-level permissions
- **THEN** the system SHALL validate against permission rules and item ownership
- **WHEN** permission validation fails
- **THEN** the system SHALL deny access and log security event

### Requirement: User Info Widget and Sidebar Layout
The system SHALL display comprehensive user information in a sidebar widget with role-based context.

#### Scenario: Sidebar User Info Widget
- **WHEN** user is logged into the hub
- **THEN** the system SHALL display user info widget at the bottom of the sidebar navigation
- **WHEN** displaying user information
- **THEN** show user avatar (or initials), full name, email/phone, and role name from Directus
- **WHEN** showing role information
- **THEN** display the primary role name and any additional roles as badges
- **WHEN** displaying current context
- **THEN** show current brand and branch with visual indicators and switching capability
- **WHEN** user information updates
- **THEN** the widget SHALL reflect changes immediately with smooth transitions

#### Scenario: Role-Based Context Display
- **WHEN** displaying user context
- **THEN** the system SHALL show access level based on user's Directus role (Brand Manager, Branch Manager, HQ Staff)
- **WHEN** user has multi-brand access
- **THEN** show all accessible brands with current selection highlighted
- **WHEN** user has multi-branch access
- **THEN** show all accessible branches within current brand with current selection highlighted
- **WHEN** user permissions change
- **THEN** the widget SHALL update to reflect new access level and available options
- **WHEN** user session is about to expire
- **THEN** show session timeout warning with renew option

#### Scenario: Quick Actions and Settings
- **WHEN** user clicks on their info widget
- **THEN** the system SHALL show dropdown with profile management options
- **WHEN** displaying quick actions
- **THEN** include options: View Profile, Change Password, Switch Branch/Brand, Logout
- **WHEN** showing settings access
- **THEN** display settings link based on user permissions (admin users get system settings)
- **WHEN** user has reporting permissions
- **THEN** include quick access to reports and analytics
- **WHEN** managing user preferences
- **THEN** provide quick toggle for language and notification settings

#### Scenario: Theme Toggle Controls
- **WHEN** user views the sidebar user info widget
- **THEN** the system SHALL display theme toggle controls with icon-only buttons
- **WHEN** showing theme options
- **THEN** provide three options: Light (sun icon), Dark (moon icon), Auto (system icon)
- **WHEN** user clicks theme toggle
- **THEN** the system SHALL immediately switch themes with smooth transition
- **WHEN** "Auto" theme is selected
- **THEN** the system SHALL follow OS/system theme preference
- **WHEN** theme changes
- **THEN** preference SHALL be saved to user profile and persist across sessions
- **WHEN** theme icons are displayed
- **THEN** use clear, universally recognized icons with hover states

#### Scenario: Theme Toggle Integration
- **WHEN** theme toggle is positioned in sidebar widget
- **THEN** it SHALL be visually distinct but integrated with user info section
- **WHEN** displaying theme controls
- **THEN** show current theme selection with subtle visual indication
- **WHEN** user hovers over theme buttons
- **THEN** show tooltip with theme name and brief description
- **WHEN** theme is changed
- **THEN** all UI components SHALL update to reflect new theme immediately
- **WHEN** theme switching occurs
- **THEN** maintain user's current context and scroll position

### Requirement: Authentication Performance and User Experience
The system SHALL optimize authentication for fast, reliable user experience.

#### Scenario: Fast Authentication Loading
- **WHEN** users visit login page
- **THEN** the system shall load authentication interface immediately
- **WHEN** authentication processing occurs
- **THEN** the system shall show loading indicators and progress feedback
- **WHEN** network conditions are poor
- **THEN** the system shall implement retry logic with exponential backoff
- **WHEN** authentication completes
- **THEN** the system shall redirect to appropriate page with minimal delay

#### Scenario: Remember Me Functionality
- **WHEN** users select "Remember Me" option
- **THEN** the system shall extend token lifetime appropriately
- **WHEN** returning users visit the site
- **THEN** the system shall attempt automatic authentication if tokens are valid
- **WHEN** remembered sessions expire
- **THEN** the system shall require fresh authentication with clear explanation
- **WHEN** managing remembered devices
- **THEN** the system shall provide interface to manage trusted devices

#### Scenario: Social Login Integration (Future Enhancement)
- **WHEN** social login is configured in Directus
- **THEN** the system shall support social authentication providers
- **WHEN** users prefer social login
- **THEN** the system shall display social login buttons alongside traditional form
- **WHEN** social authentication completes
- **THEN** the system shall map social profile to existing Directus user account
- **WHEN** social login fails
- **THEN** the system shall fallback to traditional authentication method