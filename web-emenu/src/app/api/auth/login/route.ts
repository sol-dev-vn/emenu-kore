import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await directusClient.login(email, password);
    const { access_token, refresh_token, expires } = result.data;

    console.log('Login API - Got tokens:', {
      accessTokenLength: access_token?.length,
      refreshTokenLength: refresh_token?.length,
      expires,
      secure: process.env.NODE_ENV === 'production'
    });

    const response = NextResponse.json({
      success: true,
      debug: {
        tokensReceived: !!access_token && !!refresh_token,
        env: process.env.NODE_ENV
      }
    });

    // Enhanced: Handle both localhost and production domains properly
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const isProductionDomain = host.includes('sol-menu.alphabits.team') ||
                             host.includes('kore.sol.com.vn') ||
                             host.includes('sol-kore.alphabits.team');

    // Set Secure flag for production domains and HTTPS
    const secure = (process.env.NODE_ENV === 'production' && !isLocalhost) || isProductionDomain;

    console.log('Login API - Cookie settings:', {
      secure,
      host,
      isLocalhost,
      isProductionDomain,
      env: process.env.NODE_ENV,
      finalSecure: secure
    });
    // Force session to last 1 day regardless of access token expires
    const oneDay = 60 * 60 * 24;

    console.log('Login API - Setting cookies:', {
      secure,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: oneDay,
      domain: undefined // Let browser handle domain
    });

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

    console.log('Login API - Response ready with cookies');
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 401 }
    );
  }
}