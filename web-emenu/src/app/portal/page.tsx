'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DashboardStats {
  branches: number;
  tables: number;
  menu_items: number;
  categories: number;
  sync_stats?: {
    total: number;
    completed: number;
    failed: number;
    in_progress: number;
    pending: number;
  };
  last_sync?: { id: string; status: string; started_at: string; finished_at?: string } | null;
}

export default function PortalDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        setStats(json?.data || null);
      } catch (e) {
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-600 mt-2">Basic overview</p>

      {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.branches ?? (loading ? '…' : 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.tables ?? (loading ? '…' : 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.menu_items ?? (loading ? '…' : 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.categories ?? (loading ? '…' : 0)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Last Sync</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.last_sync ? (
              <div className="text-sm">
                <div className="flex gap-2 items-center">
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs">{stats.last_sync.status}</span>
                  <span className="text-gray-500 text-xs">ID: {stats.last_sync.id}</span>
                </div>
                <div className="mt-2 text-gray-600">
                  Started: {new Date(stats.last_sync.started_at).toLocaleString()}
                </div>
                {stats.last_sync.finished_at && (
                  <div className="text-gray-600">Finished: {new Date(stats.last_sync.finished_at).toLocaleString()}</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No recent sync found</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sync Status</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.sync_stats ? (
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-semibold">{stats.sync_stats.total}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Completed:</span>
                  <span>{stats.sync_stats.completed}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Failed:</span>
                  <span>{stats.sync_stats.failed}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>In Progress:</span>
                  <span>{stats.sync_stats.in_progress}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No sync data available</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-sm">
              <a href="/portal/master/brands-branches" className="text-blue-600 hover:underline">Manage Brands & Branches</a>
              <a href="/portal/sync-logs" className="text-blue-600 hover:underline">View Sync Logs</a>
              <a href="/portal/menu-combo" className="text-blue-600 hover:underline">Manage Menu & Combos</a>
              <a href="/portal/promotions" className="text-blue-600 hover:underline">Manage Promotions</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}