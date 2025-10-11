import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'vi'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Only apply to portal and login paths
  localePrefix: 'as-needed'
});

export const config = {
  // Match only portal and login paths, and also exclude api routes
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/(vi|en)/((?!api|_next|_vercel|.*\\..*).*)']
};