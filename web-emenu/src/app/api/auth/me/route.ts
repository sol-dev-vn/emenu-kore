import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET(request: NextRequest) {
  try {
    const access = request.cookies.get('directus_access_token')?.value;
    const refresh = request.cookies.get('directus_refresh_token')?.value;
    if (access) directusClient.setAccessToken(access);

    const load = async () => directusClient.getCurrentUser();

    let res;
    try {
      res = await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const isAuthError = /401|Unauthorized|token|expired/i.test(msg);
      const isPermError = /403|Forbidden|permission|access|does not exist/i.test(msg);
      if (isAuthError && refresh) {
        try {
          directusClient.setAccessToken('');
          const refreshed = await directusClient.refresh(refresh);
          directusClient.setAccessToken(refreshed.data.access_token);
          res = await load();
        } catch {
          // ignore and fall back
        }
      }
      if (!res && (isAuthError || isPermError) && process.env.DIRECTUS_TOKEN) {
        try {
          directusClient.setAccessToken(process.env.DIRECTUS_TOKEN);
          res = await load();
        } catch {
          // keep original error
        }
      }
      if (!res) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const user = res?.data || null;
    return NextResponse.json({ data: user });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}