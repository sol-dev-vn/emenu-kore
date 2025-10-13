# Authentication System

This document describes the authentication system implemented for the SOL.com.vn eMenu project.

## Overview

The authentication system provides secure access to the staff hub (/hub) for SOL.com.vn employees with different roles and permissions. It uses Directus as the backend authentication provider and implements JWT-based session management with refresh tokens.

## Architecture

### Components

1. **API Routes** (`/src/app/api/auth/`)
   - `login/route.ts` - Handles user login and token generation
   - `logout/route.ts` - Handles user logout and token clearing
   - `refresh/route.ts` - Handles token refresh
   - `me/route.ts` - Retrieves current user information

2. **Context** (`/src/contexts/AuthContext.tsx`)
   - Provides authentication state management
   - Handles login, logout, and token refresh
   - Exposes user information and authentication status

3. **Middleware** (`/src/middleware.ts`)
   - Protects routes that require authentication
   - Redirects unauthenticated users to login page
   - Validates tokens on protected routes

4. **Utilities** (`/src/lib/auth.ts`)
   - Token management functions
   - Role-based access control utilities
   - Authentication helper functions

5. **Components** (`/src/components/auth/`)
   - `withRoleAccess.tsx` - HOC for role-based access control
   - Provides hooks for checking user permissions

### Flow

1. User enters credentials on `/login`
2. Login request is sent to `/api/auth/login`
3. Directus validates credentials and returns tokens
4. Tokens are stored in HTTP-only cookies
5. User is redirected to `/hub`
6. Middleware validates tokens on protected routes
7. Tokens are refreshed automatically before expiry
8. User can logout to clear tokens

## Roles and Permissions

The system supports three roles:

1. **Administrator**
   - Full access to all resources
   - Can manage restaurants, menus, staff, reports, and settings
   - Can delete any resource

2. **Manager**
   - Limited access to resources
   - Can manage restaurants and menus
   - Can view staff information and reports
   - Cannot delete resources or access settings

3. **Staff**
   - Limited access to specific resources
   - Can view restaurant information
   - Can update menu items and prices
   - Cannot manage other staff or access reports

## Usage

### Authentication Context

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  // Access user information
  return <div>Welcome, {user?.first_name}</div>;
}
```

### Role-Based Access Control

```tsx
import { WithRoleAccess, useRoleAccess } from '@/components/auth/withRoleAccess';

// Using the HOC
function AdminPage() {
  return (
    <WithRoleAccess allowedRoles="Administrator">
      <div>Admin content</div>
    </WithRoleAccess>
  );
}

// Using the hook
function MyComponent() {
  const isAdmin = useRoleAccess('Administrator');
  
  if (!isAdmin) {
    return <div>Access denied</div>;
  }
  
  return <div>Admin content</div>;
}
```

### Token Management

```tsx
import { getToken, setToken, clearTokens } from '@/lib/auth';

// Get a token
const token = await getToken('access_token');

// Set a token
await setToken('access_token', 'token_value', 900); // 15 minutes

// Clear all tokens
await clearTokens();
```

## Security Considerations

1. **HTTP-only Cookies**: Tokens are stored in HTTP-only cookies to prevent XSS attacks
2. **Secure Flag**: Cookies are marked as secure in production
3. **SameSite Policy**: Cookies are set with SameSite=lax to prevent CSRF attacks
4. **Token Refresh**: Tokens are automatically refreshed before expiry
5. **Route Protection**: All protected routes validate tokens
6. **Role Validation**: User roles are validated on both client and server

## Environment Variables

```env
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
```

## Testing

Run the authentication tests:

```bash
npm test -- src/lib/__tests__/auth.test.ts
```

## Troubleshooting

### Common Issues

1. **Login Fails**
   - Check Directus URL is correct
   - Verify user credentials
   - Check Directus is running

2. **Token Refresh Fails**
   - Check refresh token exists
   - Verify Directus refresh endpoint is accessible
   - Check network connectivity

3. **Protected Routes Not Working**
   - Verify middleware is correctly configured
   - Check token validation logic
   - Verify cookies are being sent

### Debug Logging

To enable debug logging, set the following environment variable:

```env
DEBUG=auth:*
```

This will log authentication-related events to the console.