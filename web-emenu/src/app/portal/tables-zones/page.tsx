'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { directusClient } from '@/lib/directus';

export const dynamic = 'force-dynamic';

interface TableItem {
  id: number;
  name: string;
  code: string;
  description?: string;
  zone_id: string;
  zone_name: string;
  capacity?: number;
  table_type: string;
  shape: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  rotation: number;
  is_mergeable: boolean;
  is_reserved: boolean;
  is_available: boolean;
  is_active: boolean;
  branch_id?: string;
  external_id?: string;
  external_source: string;
  sync_status: string;
  created_at: string;
  updated_at: string;
}

interface ZoneInfo {
  name: string;
  count: number;
  activeCount: number;
  availableCount: number;
  reservedCount: number;
}

export default function TablesZonesPage() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [zoneStats, setZoneStats] = useState<ZoneInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [zoneFilter, setZoneFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [availableFilter, setAvailableFilter] = useState<string>('');
  const [view, setView] = useState<'list' | 'zones'>('zones');

  const loadTables = async () => {
    try {
      // Read access token from cookie and set for Directus client
      const token = typeof document !== 'undefined'
        ? document.cookie
            .split('; ')
            .find((row) => row.startsWith('access_token='))
            ?.split('=')[1]
        : undefined;
      if (token) directusClient.setAccessToken(token);

      const filter: Record<string, unknown> = {};
      if (zoneFilter) filter.zone_name = { _eq: zoneFilter };
      if (searchQuery) filter.name = { _icontains: searchQuery };
      if (activeFilter) filter.is_active = { _eq: activeFilter === 'true' };

      const result = await directusClient.getItems<TableItem>('tables', {
        page,
        limit: 100,
        sort: ['zone_name', 'name'],
        filter,
        fields: [
          'id', 'name', 'code', 'description', 'zone_id', 'zone_name', 'capacity',
          'table_type', 'shape', 'position_x', 'position_y', 'width', 'height', 'rotation',
          'is_mergeable', 'is_reserved', 'is_available', 'is_active', 'branch_id', 'external_id',
          'external_source', 'sync_status', 'created_at', 'updated_at'
        ],
      });

      setTables(result.data || []);

      // Fetch unique zones for filtering
      const zonesResult = await directusClient.getItems<{ zone_name: string }>('tables', {
        fields: ['zone_name'],
        filter: { zone_name: { _nnull: true } },
        groupBy: ['zone_name'],
      });
      const uniqueZones = (zonesResult.data || []).map(z => z.zone_name).filter(Boolean);
      setZones(uniqueZones);
    } catch (e) {
      setError('Failed to load tables');
    }
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      await loadTables();
      setLoading(false);
    }
    loadData();
  }, [page, zoneFilter, searchQuery, activeFilter, availableFilter]);

  // Calculate zone statistics
  useEffect(() => {
    const stats = zones.map(zoneName => {
      const zoneTables = tables.filter(table => table.zone_name === zoneName);
      return {
        name: zoneName,
        count: zoneTables.length,
        activeCount: zoneTables.filter(t => t.is_active).length,
        availableCount: zoneTables.filter(t => t.is_available && t.is_active).length,
        reservedCount: zoneTables.filter(t => t.is_reserved).length,
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    setZoneStats(stats);
  }, [tables, zones]);

  const getTableTypeColor = (type: string) => {
    switch (type) {
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'booth':
        return 'bg-purple-100 text-purple-800';
      case 'private_room':
        return 'bg-green-100 text-green-800';
      case 'bar':
        return 'bg-orange-100 text-orange-800';
      case 'outdoor':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredTables = tables.filter(table => {
    if (availableFilter === 'available' && (!table.is_available || !table.is_active)) return false;
    if (availableFilter === 'unavailable' && table.is_available && table.is_active) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tables & Zones</h1>
          <p className="text-gray-600 mt-2">Manage restaurant tables and zone organization</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'zones' ? 'default' : 'outline'}
            onClick={() => setView('zones')}
          >
            Zone View
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
          >
            List View
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tables..."
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Zone</label>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Zones</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>
                    Zone {zone}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Availability</label>
              <select
                value={availableFilter}
                onChange={(e) => setAvailableFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {view === 'zones' ? (
        /* Zone View */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Zone Overview ({zoneStats.length} zones)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {zoneStats.map((zone) => (
                  <Card key={zone.name} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Zone {zone.name}</CardTitle>
                        <Badge variant="secondary">{zone.count} tables</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Active:</span>
                          <span className="font-medium">{zone.activeCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available:</span>
                          <span className="font-medium text-green-600">{zone.availableCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Reserved:</span>
                          <span className="font-medium text-orange-600">{zone.reservedCount}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => setZoneFilter(zone.name)}
                        >
                          View Tables
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* List View */
        <Card>
          <CardHeader>
            <CardTitle>Tables ({filteredTables.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTables.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tables found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Availability
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sync
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTables.map((table) => (
                      <tr key={table.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {table.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {table.code}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">Zone {table.zone_name}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTableTypeColor(table.table_type)}`}>
                            {table.table_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {table.capacity || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            table.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {table.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-1">
                            {table.is_available && (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Available
                              </span>
                            )}
                            {table.is_reserved && (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                Reserved
                              </span>
                            )}
                            {!table.is_available && !table.is_reserved && (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                Unavailable
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(table.sync_status)}`}>
                            {table.sync_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(table.updated_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}