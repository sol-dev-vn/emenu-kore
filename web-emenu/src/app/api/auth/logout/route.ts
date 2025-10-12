import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function POST(request: NextRequest) {
  try {
    const refresh_token = request.cookies.get('directus_refresh_token')?.value;

    if (refresh_token) {
      try {
        await directusClient.logout(refresh_token);
      } catch (e) {
        console.warn('Directus logout error:', e);
      }
    }

    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const isProductionDomain = host.includes('sol-menu.alphabits.team') ||
                             host.includes('kore.sol.com.vn') ||
                             host.includes('sol-kore.alphabits.team');
    const secure = (process.env.NODE_ENV === 'production' && !isLocalhost) || isProductionDomain;

    const hostname = host.split(':')[0];
    let cookieDomain: string | undefined;
    if (hostname.endsWith('.alphabits.team')) {
      cookieDomain = '.alphabits.team';
    } else if (hostname === 'sol.com.vn' || hostname.endsWith('.sol.com.vn')) {
      cookieDomain = '.sol.com.vn';
    }

    const response = NextResponse.json({ success: true });
    const opts = {
      httpOnly: true,
      secure,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0,
      domain: cookieDomain,
    };

    response.cookies.set('directus_access_token', '', opts);
    response.cookies.set('directus_refresh_token', '', opts);

    return response;
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}