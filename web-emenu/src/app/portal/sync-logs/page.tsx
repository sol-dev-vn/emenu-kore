'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Download,
  Eye,
  Filter
} from 'lucide-react';

interface SyncLog {
  id: string;
  entity_type: string;
  entity_id: string;
  entity_name?: string;
  operation: string;
  status: 'success' | 'failed' | 'pending' | 'in_progress';
  error_message?: string;
  request_data?: Record<string, any>;
  response_data?: Record<string, any>;
  external_source: string;
  external_id?: string;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  retry_count?: number;
  branch_id?: string;
  user_id?: string;
}

export const dynamic = 'force-dynamic';

export default function SyncLogsPage() {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [entityFilter, setEntityFilter] = useState<string>('');
  const [operationFilter, setOperationFilter] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<SyncLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [totalLogs, setTotalLogs] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    pending: 0,
    inProgress: 0
  });

  const loadLogs = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter) params.append('status', statusFilter);
      if (entityFilter) params.append('entity', entityFilter);
      if (operationFilter) params.append('operation', operationFilter);

      const res = await fetch(`/api/sync-logs?${params}`);
      const json = await res.json();
      if (json.success) {
        setLogs(json.data || []);
        setTotalLogs(json.total || 0);
        setStats(json.stats || {
          total: 0,
          success: 0,
          failed: 0,
          pending: 0,
          inProgress: 0
        });
      } else {
        setError(json.error || 'Failed to load sync logs');
      }
    } catch (e) {
      setError('Failed to load sync logs');
    }
  };

  const exportLogs = async () => {
    try {
      const params = new URLSearchParams({
        format: 'csv',
        status: statusFilter,
        entity: entityFilter,
        operation: operationFilter,
        search: searchQuery,
      });

      const res = await fetch(`/api/sync-logs/export?${params}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sync-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error('Failed to export logs:', e);
    }
  };

  const retrySync = async (logId: string) => {
    try {
      const res = await fetch(`/api/sync-logs/${logId}/retry`, {
        method: 'POST',
      });
      if (res.ok) {
        await loadLogs();
      }
    } catch (e) {
      console.error('Failed to retry sync:', e);
    }
  };

  const viewDetails = (log: SyncLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      await loadLogs();
      setLoading(false);
    }
    loadData();
  }, [page, searchQuery, statusFilter, entityFilter, operationFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in_progress':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
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

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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
          <h1 className="text-2xl font-bold">Sync Logs</h1>
          <p className="text-gray-600 mt-2">Monitor data synchronization between systems</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Logs</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.success}</p>
                <p className="text-sm text-gray-600">Success</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by entity name or ID..."
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Entity Type</label>
              <select
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">All Entities</option>
                <option value="menu_item">Menu Items</option>
                <option value="table">Tables</option>
                <option value="category">Categories</option>
                <option value="promotion">Promotions</option>
                <option value="order">Orders</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Operation</label>
              <select
                value={operationFilter}
                onChange={(e) => setOperationFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">All Operations</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="sync">Sync</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Logs ({totalLogs})</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sync logs found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Operation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      External ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Retries
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {log.entity_name || `${log.entity_type} ${log.entity_id}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            {log.entity_type}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {log.operation}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.external_id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.started_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDuration(log.duration_ms)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.retry_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDetails(log)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                          {log.status === 'failed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => retrySync(log.id)}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Retry
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalLogs > 20 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, totalLogs)} of {totalLogs} results
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page * 20 >= totalLogs}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sync Log Details</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Entity</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedLog.entity_name || `${selectedLog.entity_type} ${selectedLog.entity_id}`}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Operation</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLog.operation}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedLog.status)}`}>
                    {selectedLog.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <p className="mt-1 text-sm text-gray-900">{formatDuration(selectedLog.duration_ms)}</p>
              </div>
            </div>

            {selectedLog.error_message && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Error Message</label>
                <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-900">{selectedLog.error_message}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              {selectedLog.request_data && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Request Data</label>
                  <pre className="p-3 bg-gray-50 rounded-md text-xs overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.request_data, null, 2)}
                  </pre>
                </div>
              )}
              {selectedLog.response_data && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Response Data</label>
                  <pre className="p-3 bg-gray-50 rounded-md text-xs overflow-auto max-h-40">
                    {JSON.stringify(selectedLog.response_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {selectedLog.status === 'failed' && (
              <div className="mt-6 flex gap-2">
                <Button onClick={() => retrySync(selectedLog.id)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Sync
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}