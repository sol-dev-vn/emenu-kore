# Authentication System Design

## Architecture Overview

### Authentication Flow
```
User → /login → Form → POST /api/auth/login → Directus API → JWT Token → Session → /hub
```

### Security Architecture
- **Backend Proxy**: All Directus API calls go through Next.js API routes
- **JWT Management**: Tokens stored in HTTP-only cookies, not localStorage
- **CSRF Protection**: Implement CSRF tokens for state-changing operations
- **Session Validation**: Middleware validates session on protected routes

### Directus Integration
- Use Directus Authentication endpoint: `/auth/login`
- Leverage Directus password policies and user management
- Implement refresh token rotation for security
- Respect Directus role-based permissions in the future

## Technical Implementation

### API Routes Structure
```
/api/auth/
├── login/     - POST: Authenticate user
├── logout/    - POST: Clear session
├── refresh/   - POST: Refresh JWT token
└── me/        - GET: Get current user info
```

### Frontend Components
```
components/
├── auth/
│   ├── LoginForm.tsx      - Main login form
│   ├── EmailLogin.tsx     - Email/password input
│   └── PhoneLogin.tsx     - Phone/password input
├── layout/
│   ├── AuthLayout.tsx     - Layout for auth pages
│   └── HubLayout.tsx      - Layout for protected hub
└── ui/ (existing)
```

### Page Structure
```
src/app/
├── login/
│   └── page.tsx           - Login page
├── hub/
│   ├── layout.tsx         - Protected layout
│   └── page.tsx           - Hub dashboard
└── api/auth/              - Authentication API routes
```

## Session Management

### Cookie Strategy
- **Access Token**: HTTP-only cookie, short-lived (15 minutes)
- **Refresh Token**: HTTP-only cookie, longer-lived (7 days)
- **Secure Flags**: Secure, HttpOnly, SameSite=Strict

### Session Validation
- Middleware checks for valid session on protected routes
- Automatic token refresh when access token expires
- Graceful redirect to login on session expiration

## Security Considerations

### Directus Best Practices
1. **No Client-Side Tokens**: All tokens handled server-side
2. **Backend Proxy**: API routes proxy requests to Directus
3. **Rate Limiting**: Implement login attempt rate limiting
4. **Password Policies**: Enforce Directus password requirements
5. **Error Handling**: Generic error messages to prevent enumeration

### Next.js Security
1. **Middleware**: Route protection at edge middleware level
2. **Environment Variables**: Secure storage of Directus credentials
3. **Input Validation**: Zod schemas for form validation
4. **CSRF Protection**: Implement CSRF token validation

## Mobile Responsiveness

### Design Considerations
- Touch-friendly form inputs and buttons
- Appropriate keyboard types for email/phone inputs
- Responsive layout for mobile devices
- Loading states and error handling
- Accessibility compliance (WCAG 2.1)

## Error Handling Strategy

### Authentication Errors
- Invalid credentials: Generic "Invalid email or password"
- Network errors: User-friendly retry options
- Session expiration: Automatic redirect to login
- Account locked: Clear instructions for support contact

### Fallback Behavior
- Graceful degradation if Directus is unavailable
- Offline handling for basic UI elements
- Proper error boundaries in React components