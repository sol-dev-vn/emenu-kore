# SOL eMenu Dev Journal

(Latest updates first)

## 11.Oct.2025
- Implemented Directus OAuth authentication and standardized 1-day session cookies for both email/password and OAuth logins.
- Added full "Forgot Password" flow:
  - API routes: /api/auth/password/request and /api/auth/password/reset
  - Login page action to request reset email
  - New Reset Password page at /reset-password to set a new password via token
- OAuth provider support:
  - API route to list providers: /api/auth/providers
  - OAuth start and callback routes: /api/auth/oauth/[provider] and /api/auth/oauth/callback
  - Login page renders provider buttons and redirects to provider flows
- DirectusClient extended with helper methods: listAuthProviders, requestPasswordReset, resetPassword
- Email/password login API updated to set 1-day cookies; OAuth callback sets cookies when tokens are returned via URL.
- Verified /login and /reset-password pages are reachable locally.

- Init repo web-emenu; running via PM2 at port 3520 (web-emenu/ecosystem.config.js).
- Landing page with QR code scanner completed (mobile/tablet); desktop shows QR code.
- Initial backend auth through Directus API using service KEY (pre-refactor).

### Pending / Next
- Verify Brands & Branches page behavior and error handling under new auth flow.
- Ensure SMTP is configured on Directus for password reset emails in production.
- Confirm OAuth callback behavior and cookie compatibility on https://sol-kore.alphabits.team/ deployment.
- UX polish on login (provider icons, improved loading/error states) and add basic tests.