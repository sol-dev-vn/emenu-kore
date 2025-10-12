import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET(request: NextRequest) {
  try {
    const access = request.cookies.get('directus_access_token')?.value;
    const refresh = request.cookies.get('directus_refresh_token')?.value;

    // Temporary instrumentation to debug cookie presence in production
    console.log('Auth ME - Incoming request info:', {
      host: request.headers.get('host'),
      hasAccessCookie: !!access,
      hasRefreshCookie: !!refresh,
      cookieHeaderLength: (request.headers.get('cookie') || '').length,
    });

    if (access) directusClient.setAccessToken(access);

    const load = async () => directusClient.getCurrentUser();

    let res;
    try {
      res = await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const isAuthError = /401|Unauthorized|token|expired/i.test(msg);
      const isPermError = /403|Forbidden|permission|access|does not exist/i.test(msg);

      console.warn('Auth ME - Initial user load failed:', {
        isAuthError,
        isPermError,
        message: msg,
        hasAccessCookie: !!access,
        hasRefreshCookie: !!refresh,
      });

      if (isAuthError && refresh) {
        try {
          directusClient.setAccessToken('');
          const refreshed = await directusClient.refresh(refresh);
          directusClient.setAccessToken(refreshed.data.access_token);
          res = await load();
          console.log('Auth ME - Successfully refreshed token and loaded user');
        } catch (refreshErr) {
          console.warn('Auth ME - Refresh attempt failed:', refreshErr);
          // ignore and fall back
        }
      }
      if (!res && (isAuthError || isPermError) && process.env.DIRECTUS_TOKEN) {
        try {
          directusClient.setAccessToken(process.env.DIRECTUS_TOKEN);
          res = await load();
          console.log('Auth ME - Fallback to DIRECTUS_TOKEN succeeded');
        } catch (fallbackErr) {
          console.warn('Auth ME - Fallback with DIRECTUS_TOKEN failed:', fallbackErr);
          // keep original error
        }
      }
      if (!res) {
        console.warn('Auth ME - Unauthorized after attempts', {
          hasAccessCookie: !!access,
          hasRefreshCookie: !!refresh,
        });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const user = res?.data || null;
    console.log('Auth ME - Returning user data:', {
      hasUser: !!user,
      email: user?.email,
    });
    return NextResponse.json({ data: user });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}