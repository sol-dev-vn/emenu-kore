import { NextRequest, NextResponse } from 'next/server';
import { directusClient } from '@/lib/directus';

type SyncLog = { id: string; status?: string; date_created?: string };

export async function GET(request: NextRequest) {
  try {
    const access = request.cookies.get('directus_access_token')?.value;
    const refresh = request.cookies.get('directus_refresh_token')?.value;
    if (access) {
      directusClient.setAccessToken(access);
    }

    const load = async () => {
      const [branchesCount, tablesCount, menuItemsCount, categoriesCount] = await Promise.all([
        directusClient.count('branches').catch(() => 0),
        directusClient.count('tables').catch(() => 0),
        directusClient.count('menu_items').catch(() => 0),
        directusClient.count('categories').catch(() => 0),
      ]);

      let lastSync: SyncLog | null = null;
      let syncStats = null;
      try {
        const [syncRes, statsRes] = await Promise.all([
          directusClient.getItems('sync_logs', {
            sort: ['-date_created'],
            limit: 1,
            // Minimal set to avoid permission errors (exclude `message`)
            fields: ['id', 'status', 'date_created'],
          }),
          directusClient.getSyncLogStats().catch(() => null)
        ]);

        const list = Array.isArray(syncRes?.data) ? (syncRes.data as SyncLog[]) : [];
        const item = list[0];
        if (item) lastSync = item;
        if (statsRes) syncStats = statsRes;
      } catch (e) {
        // ignore sync logs error
      }

      return { branchesCount, tablesCount, menuItemsCount, categoriesCount, lastSync, syncStats };
    };

    let data;
    try {
      data = await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const isAuthError = /401|Unauthorized|token|expired/i.test(msg);
      const isPermError = /403|Forbidden|permission|access|does not exist/i.test(msg);
      if (isAuthError && refresh) {
        // clear expired token then refresh
        directusClient.setAccessToken('');
        try {
          const refreshed = await directusClient.refresh(refresh);
          directusClient.setAccessToken(refreshed.data.access_token);
          data = await load();
        } catch {
          // ignore
        }
      }
      // Fallback to service account token if available and still unauthorized/forbidden
      if (!data && (isAuthError || isPermError) && process.env.DIRECTUS_TOKEN) {
        try {
          directusClient.setAccessToken(process.env.DIRECTUS_TOKEN);
          data = await load();
        } catch {
          // keep original error
        }
      }
      if (!data) {
        throw e;
      }
    }

    return NextResponse.json({
      data: {
        branches: data.branchesCount,
        tables: data.tablesCount,
        menu_items: data.menuItemsCount,
        categories: data.categoriesCount,
        sync_stats: data.syncStats,
        last_sync: data.lastSync,
      },
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    // Return 401 on auth issues so client can redirect
    const status = (error instanceof Error && /401|Unauthorized|permission/i.test(error.message)) ? 401 : 500;
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status });
  }
}