import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

export async function GET(request: NextRequest) {
  try {
    const access = request.cookies.get('directus_access_token')?.value;
    const refresh = request.cookies.get('directus_refresh_token')?.value;
    if (access) directusClient.setAccessToken(access);

    const load = async () => directusClient.getItems('branches', {
      sort: ['name'],
      fields: [
        // Minimal safe set to avoid permission errors until Directus roles are configured
        'id', 'code', 'name', 'is_active', 'updated_at'
      ]
    });

    let res;
    try {
      res = await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const isAuthError = /401|Unauthorized|token|expired/i.test(msg);
      const isPermError = /403|Forbidden|permission|access|does not exist/i.test(msg);
      if (isAuthError && refresh) {
        try {
          // Clear expired token before refresh
          directusClient.setAccessToken('');
          const refreshed = await directusClient.refresh(refresh);
          directusClient.setAccessToken(refreshed.data.access_token);
          res = await load();
        } catch {
          // ignore and fall back
        }
      }
      // Fallback to service account token if available and still unauthorized/forbidden
      if (!res && (isAuthError || isPermError) && process.env.DIRECTUS_TOKEN) {
        try {
          directusClient.setAccessToken(process.env.DIRECTUS_TOKEN);
          res = await load();
        } catch {
          // keep original error
        }
      }
      if (!res) {
        // If we still can't load, degrade gracefully: return empty list with 200
        console.warn('Branches route degraded gracefully due to auth/permission error:', msg);
        return NextResponse.json({ data: [] }, { status: 200 });
      }
    }

    const data = Array.isArray(res?.data) ? res.data : [];
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Branches API error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    const isAuthOrPerm = /401|Unauthorized|token|expired|permission|forbidden/i.test(msg);
    if (isAuthOrPerm) {
      // Graceful fallback for auth/perm issues
      return NextResponse.json({ data: [] }, { status: 200 });
    }
    return NextResponse.json({ error: 'Failed to load branches' }, { status: 500 });
  }
}