import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('directus_access_token')?.value;

  // Handle portal authentication (including prefixed paths like /en/portal)
  if (pathname.includes('/portal')) {
    if (!accessToken) {
      const url = req.nextUrl.clone();
      // Get the locale from the pathname or use default
      const localeMatch = pathname.match(/^\/(en|vi)/);
      const locale = localeMatch ? localeMatch[1] : 'en';
      url.pathname = `/${locale}/login`;
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Handle login redirection (including prefixed paths like /en/login)
  if (pathname.includes('/login')) {
    if (accessToken) {
      const url = req.nextUrl.clone();
      // Get the locale from the pathname or use default
      const localeMatch = pathname.match(/^\/(en|vi)/);
      const locale = localeMatch ? localeMatch[1] : 'en';
      url.pathname = `/${locale}/portal`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};