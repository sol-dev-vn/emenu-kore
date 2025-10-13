# Hub Authentication Specification

## ADDED Requirements

### Requirement: User Authentication via Directus
The system MUST authenticate users against the Directus user management system using either email/password or phone/password credentials.

#### Scenario: Email and Password Authentication
Given a registered Directus user with valid credentials
When the user enters their email and password on the login form
And clicks the "Sign In" button
Then the system validates the credentials against Directus
And creates an authenticated session
And redirects the user to the /hub dashboard

#### Scenario: Phone and Password Authentication
Given a registered Directus user with phone number and password
When the user enters their phone number and password on the login form
And selects the phone login option
And clicks the "Sign In" button
Then the system validates the credentials against Directus
And creates an authenticated session
And redirects the user to the /hub dashboard

#### Scenario: Invalid Credentials
Given any user enters invalid credentials (email/password or phone/password)
When the user attempts to sign in
Then the system displays a generic "Invalid email or password" error message
And does not reveal whether the email/phone or password is incorrect
And prevents access to the hub area

### Requirement: Protected Hub Access
The /hub route MUST be protected and only accessible to authenticated users.

#### Scenario: Direct Access to Hub Without Authentication
Given an unauthenticated user attempts to access /hub directly
When the user navigates to http://localhost:3520/hub
Then the system redirects them to the /login page
And displays a message indicating authentication is required

#### Scenario: Authenticated User Access to Hub
Given a user with a valid active session
When the user navigates to /hub
Then the system displays the hub dashboard
And shows user-specific content
And maintains the authenticated state

#### Scenario: Session Expiration During Hub Usage
Given a user is actively using the hub
When their session expires
Then the system redirects them to the /login page
And displays a message indicating their session has expired
And prompts them to log in again

### Requirement: Session Management
The system MUST maintain secure user sessions using HTTP-only cookies and automatic token refresh.

#### Scenario: Session Persistence
Given a user successfully authenticates
When they refresh the page or close and reopen the browser
Then the system maintains their authenticated session
And does not require them to log in again (if session is still valid)

#### Scenario: Automatic Token Refresh
Given a user has an active session with a valid refresh token
When their access token expires during normal usage
Then the system automatically refreshes the access token
And the user experiences no interruption in their session

#### Scenario: Secure Logout
Given an authenticated user wants to log out
When they click the logout button
Then the system clears all authentication cookies
And invalidates the session on the server side
And redirects them to the login page
And prevents back button access to protected content

### Requirement: Form Validation and Error Handling
The authentication forms MUST provide comprehensive validation and user-friendly error handling.

#### Scenario: Email Format Validation
Given a user enters an email address in the email login form
When the input field loses focus or the form is submitted
Then the system validates the email format
And displays an error message if the format is invalid
And prevents form submission until corrected

#### Scenario: Phone Number Validation
Given a user enters a phone number in the phone login form
When the input field loses focus or the form is submitted
Then the system validates the phone number format (Vietnamese mobile numbers)
And displays an error message if the format is invalid
And prevents form submission until corrected

#### Scenario: Password Strength Validation
Given a user enters a password during login
When the system validates credentials against Directus
And Directus returns a password policy violation
Then the system displays the specific password requirements
And guides the user to meet the password policy

### Requirement: Mobile-Responsive Authentication Interface
The authentication interface MUST be fully responsive and optimized for mobile devices.

#### Scenario: Mobile Login Experience
Given a user accessing the login page on a mobile device
When the page loads
Then the form inputs are appropriately sized for touch interaction
And the keyboard displays the appropriate input type (email for email, numeric for phone)
And the layout adapts to small screen sizes
And all interactive elements have appropriate touch targets

#### Scenario: Mobile Hub Access
Given an authenticated user accessing the hub on a mobile device
When they navigate through hub pages
Then the interface remains fully functional
And navigation elements are mobile-friendly
And content is appropriately sized and readable