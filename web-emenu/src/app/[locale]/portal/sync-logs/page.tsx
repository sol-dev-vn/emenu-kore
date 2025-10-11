'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ChevronRight, X, Clock, CheckCircle, XCircle, AlertCircle, Database, Zap, FileText, Activity } from 'lucide-react';

interface SyncLogStats {
  total: number;
  completed: number;
  failed: number;
  in_progress: number;
  pending: number;
}

interface SyncLog {
  id: string;
  sync_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  records_processed: number;
  records_created: number;
  records_updated: number;
  records_failed: number;
  duration_seconds: number;
  last_error_message?: string;
  date_created: string;
  completed_at?: string;
  performance_metrics?: Record<string, unknown>;
  log_data?: string;
  metadata?: Record<string, unknown>;
}

export default function SyncLogsPage() {
  const [stats, setStats] = useState<SyncLogStats | null>(null);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<SyncLog | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  const loadStats = async () => {
    try {
      const res = await fetch('/api/sync-logs/stats');
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (e) {
      console.error('Failed to load sync log stats:', e);
    }
  };

  const loadLogs = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('sync_type', typeFilter);

      const res = await fetch(`/api/sync-logs?${params}`);
      const json = await res.json();
      if (json.success) {
        setLogs(json.data);
      }
    } catch (e) {
      setError('Failed to load sync logs');
    }
  };

  const handleLogClick = async (log: SyncLog) => {
    try {
      // Fetch full log details including log_data from Directus
      const res = await fetch(`/api/sync-logs/${log.id}`);
      const json = await res.json();
      if (json.success) {
        setSelectedLog(json.data);
        setIsDetailPanelOpen(true);
      } else {
        setSelectedLog(log);
        setIsDetailPanelOpen(true);
      }
    } catch (e) {
      // Fallback to the log data we already have
      setSelectedLog(log);
      setIsDetailPanelOpen(true);
    }
  };

  const closeDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedLog(null);
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      await Promise.all([loadStats(), loadLogs()]);
      setLoading(false);
    }
    loadData();
  }, [page, statusFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'in_progress':
        return <Activity className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSyncTypeIcon = (syncType: string) => {
    switch (syncType) {
      case 'branches':
        return <Database className="w-4 h-4" />;
      case 'categories':
        return <FileText className="w-4 h-4" />;
      case 'menu_items':
        return <Zap className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
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
    <div className="flex h-screen">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isDetailPanelOpen ? 'mr-96' : ''}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                Sync Logs
              </h1>
              <p className="text-gray-600 mt-2">Monitor data synchronization status</p>
            </div>
          </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-gray-500" />
                    <div className="text-3xl font-bold">{stats.total}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <div className="text-3xl font-bold text-blue-600">{stats.in_progress}</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                  </div>
                </CardContent>
              </Card>
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
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sync Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="branches">Branches</option>
                <option value="categories">Categories</option>
                <option value="menu_items">Menu Items</option>
                <option value="tables">Tables</option>
                <option value="layouts">Layouts</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Logs</CardTitle>
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
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleLogClick(log)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          {getSyncTypeIcon(log.sync_type)}
                          <span className="capitalize">{log.sync_type.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-xs space-y-1">
                          <div>Processed: {log.records_processed || 0}</div>
                          <div className="text-green-600">Created: {log.records_created || 0}</div>
                          <div className="text-blue-600">Updated: {log.records_updated || 0}</div>
                          {log.records_failed > 0 && (
                            <div className="text-red-600">Failed: {log.records_failed}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {log.duration_seconds ? `${log.duration_seconds}s` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.date_created)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.completed_at ? formatDate(log.completed_at) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>

      {/* Detail Panel */}
      {isDetailPanelOpen && selectedLog && (
        <div className="w-96 bg-white border-l border-gray-200 shadow-lg overflow-hidden flex flex-col fixed right-0 top-0 h-full z-40">
          {/* Panel Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedLog.status)}
                <div>
                  <h3 className="font-semibold">Sync Log Details</h3>
                  <p className="text-sm opacity-90">{selectedLog.sync_type.replace('_', ' ').toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={closeDetailPanel}
                className="p-1 hover:bg-white/20 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Status and Type */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Status</h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedLog.status)}
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedLog.status)}`}>
                  {selectedLog.status}
                </span>
              </div>
            </div>

            {/* Timing Information */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Timing</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Started:</span>
                  <span>{formatDate(selectedLog.date_created)}</span>
                </div>
                {selectedLog.completed_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span>{formatDate(selectedLog.completed_at)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span>{selectedLog.duration_seconds ? `${selectedLog.duration_seconds}s` : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Records Processing */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Records Processing</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Processed:</span>
                  <span>{selectedLog.records_processed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-green-600">{selectedLog.records_created || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="text-blue-600">{selectedLog.records_updated || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Failed:</span>
                  <span className="text-red-600">{selectedLog.records_failed || 0}</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {selectedLog.last_error_message && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-red-700 mb-2">Error Message</h4>
                <p className="text-sm text-red-600">{selectedLog.last_error_message}</p>
              </div>
            )}

            {/* Performance Metrics */}
            {selectedLog.performance_metrics && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Performance Metrics</h4>
                <div className="bg-white rounded border border-gray-200 p-2 max-h-32 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.performance_metrics, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Log Data */}
            {selectedLog.log_data && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Log Data</h4>
                <div className="bg-white rounded border border-gray-200 p-2 max-h-48 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {selectedLog.log_data}
                  </pre>
                </div>
              </div>
            )}

            {/* Metadata */}
            {selectedLog.metadata && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Metadata</h4>
                <div className="bg-white rounded border border-gray-200 p-2 max-h-32 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}