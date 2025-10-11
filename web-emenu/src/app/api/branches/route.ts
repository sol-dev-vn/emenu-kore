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
        'id', 'code', 'name', 'display_name', 'description', 'phone', 'email', 'address',
        'tax_rate', 'service_rate', 'has_vat', 'has_service', 'external_id', 'is_active', 'updated_at'
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
        throw e;
      }
    }

    const data = Array.isArray(res?.data) ? res.data : [];
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Branches API error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    const isAuthError = /401|Unauthorized|token|expired|permission|forbidden/i.test(msg);
    const status = isAuthError ? 401 : 500;
    return NextResponse.json({ error: 'Failed to load branches' }, { status });
  }
}