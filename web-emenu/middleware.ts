import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'vi'] as const;

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('directus_access_token')?.value;

  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];
  const hasLocale = (locales as readonly string[]).includes(maybeLocale);
  const locale: (typeof locales)[number] = hasLocale ? (maybeLocale as (typeof locales)[number]) : 'en';

  // Normalize non-locale routes to locale-prefixed
  if (!hasLocale && (pathname.startsWith('/portal') || pathname.startsWith('/login'))) {
    const url = req.nextUrl.clone();
    const rest = pathname.replace(/^\/(portal|login)/, '');
    url.pathname = `/${locale}/${pathname.startsWith('/portal') ? 'portal' : 'login'}${rest}`;
    return NextResponse.redirect(url);
  }

  // Locale-aware portal authentication
  if (pathname.startsWith(`/${locale}/portal`)) {
    if (!accessToken) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Locale-aware login redirection when already authenticated
  if (pathname.startsWith(`/${locale}/login`)) {
    if (accessToken) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/portal`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};