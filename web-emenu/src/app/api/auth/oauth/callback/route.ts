import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const access_token = url.searchParams.get('access_token');
    const refresh_token = url.searchParams.get('refresh_token');
    const redirect = url.searchParams.get('redirect') || '/portal';

    const secure = process.env.NODE_ENV === 'production';
    const oneDay = 60 * 60 * 24;

    // If tokens are present, set cookies on our domain for session
    if (access_token && refresh_token) {
      const response = NextResponse.redirect(redirect);
      response.cookies.set('directus_access_token', access_token, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: oneDay,
      });
      response.cookies.set('directus_refresh_token', refresh_token, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: oneDay,
      });
      return response;
    }

    // Otherwise just redirect (for cookie-mode on Directus domain, requires same-site or reverse proxy)
    return NextResponse.redirect(redirect);
  } catch (error) {
    console.error('OAuth callback handling failed:', error);
    return NextResponse.json({ error: 'OAuth callback failed' }, { status: 500 });
  }
}