## MODIFIED Requirements

### Requirement: Staff Authentication System
The system SHALL provide secure authentication for restaurant staff using phone numbers and passwords with role-based access control.

#### Scenario: Phone Number Login
- **WHEN** a staff member attempts to login
- **THEN** the system SHALL require phone number in international format (+84 for Vietnam)
- **WHEN** a phone number is entered
- **THEN** the system SHALL validate the format and normalize the format
- **WHEN** valid credentials are provided
- **THEN** the system SHALL authenticate the user and establish role-based session

#### Scenario: Phone Number Validation
- **WHEN** a new user account is created
- **THEN** the system SHALL require a unique phone number in international format
- **WHEN** phone number format is invalid
- **THEN** the system SHALL display format guidelines with +84 Vietnam example
- **WHEN** phone number already exists
- **THEN** the system SHALL display error message requiring different phone number

#### Scenario: Password Security
- **WHEN** staff members set passwords
- **THEN** the system SHALL enforce minimum password complexity requirements
- **WHEN** failed login attempts occur
- **THEN** the system SHALL implement account lockout after 5 failed attempts
- **WHEN** account is locked
- **THEN** the system SHALL require manual reset by administrator after 15 minutes

### Requirement: User Registration and Management
The system SHALL provide secure user registration and profile management for restaurant staff with proper validation.

#### Scenario: New User Registration
- **WHEN** an administrator creates a new staff account
- **THEN** the system SHALL require unique phone number, role assignment, and basic profile information
- **WHEN** setting initial password
- **THEN** the system SHALL require password change on first login
- **WHEN** phone number verification is needed
- **THEN** the system SHALL implement SMS verification for Vietnamese numbers

#### Scenario: Profile Management
- **WHEN** a staff member updates their profile
- **THEN** the system SHALL allow changes to non-sensitive fields only
- **WHEN** phone number needs updating
- **THEN** the system SHALL require verification of new phone number
- **WHEN** password reset is requested
- **THEN** the system SHALL send reset link to registered phone number via SMS

### Requirement: Session Management
The system SHALL maintain secure user sessions with appropriate timeout and refresh mechanisms.

#### Scenario: Session Creation
- **WHEN** a user successfully authenticates
- **THEN** the system SHALL create a secure session with user role and context
- **WHEN** session is established
- **THEN** the system SHALL store user's brand/branch access permissions in session
- **WHEN** session expires
- **THEN** the system SHALL require re-authentication to continue

#### Scenario: Multi-Device Sessions
- **WHEN** a user logs in on multiple devices
- **THEN** the system SHALL allow concurrent sessions with security monitoring
- **WHEN** suspicious activity is detected
- **THEN** the system SHALL terminate all sessions and require re-authentication
- **WHEN** user logs out
- **THEN** the system SHALL terminate all active sessions for security

### Requirement: Role-Based Access Control
The system SHALL enforce granular role-based permissions for all authenticated users.

#### Scenario: Permission Validation
- **WHEN** a user attempts to access restricted resources
- **THEN** the system SHALL validate permissions before granting access
- **WHEN** user lacks required permissions
- **THEN** the system SHALL display access denied message with appropriate guidance
- **WHEN** role assignments change
- **THEN** the system SHALL update session permissions in real-time

#### Scenario: Context-Based Data Access
- **WHEN** a Brand Manager views data
- **THEN** the system SHALL filter data to show only their brand's information
- **WHEN** a Branch Manager accesses reports
- **THEN** the system SHALL restrict data to their specific branch
- **WHEN** HQ employees access global data
- **THEN** the system SHALL provide comprehensive access across all brands and branches