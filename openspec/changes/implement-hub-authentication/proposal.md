# Implement Private SOL Hub with Authentication

## Summary
Implement a private `/hub` route that requires user authentication via email/password or phone/password login using Directus authentication best practices. The login page will be accessible at `/login` and protect the hub area from unauthorized access.

## Problem Statement
Currently, the SOL eMenu application is publicly accessible without any authentication mechanism. The business needs a private hub area for SOL staff and partners to access restricted content, management tools, and internal resources. This requires implementing a secure authentication system that integrates with the existing Directus CMS infrastructure.

## Goals
1. Create a secure authentication system using Directus
2. Implement a private `/hub` area for authenticated users
3. Provide a clean login experience at `/login`
4. Support both email/password and phone/password authentication
5. Maintain session security and proper logout functionality
6. Follow Directus authentication best practices

## Scope
### In Scope
- Authentication system with Directus integration
- Login page at `/login` with email/password and phone/password options
- Private `/hub` route protected by authentication middleware
- Session management and persistence
- Logout functionality
- Password reset flow (via Directus)
- Error handling and validation
- Mobile-responsive design

### Out of Scope
- User registration (handled in Directus admin)
- Role-based access control (basic authenticated/unauthenticated only)
- Two-factor authentication
- Social login options
- Advanced user profile management

## Success Criteria
1. Users can successfully authenticate using email/password or phone/password
2. Unauthenticated users are redirected to `/login` when accessing `/hub`
3. Authenticated users can access the private hub area
4. Sessions are maintained securely across page refreshes
5. Users can securely log out and are redirected appropriately
6. The system follows Directus authentication best practices

## Constraints
- Must integrate with existing Directus instance
- Cannot expose Directus tokens to the client-side
- Must follow Next.js security best practices
- Must be mobile-responsive
- Must support both Vietnamese and English languages