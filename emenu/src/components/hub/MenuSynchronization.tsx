'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Sync,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  FileText,
  Download,
  Upload
} from 'lucide-react';

interface SyncItem {
  id: string;
  name: string;
  type: 'menu_item' | 'price' | 'category' | 'availability';
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  details: string;
  timestamp: string;
}

interface MenuSynchronizationProps {
  branchId: string;
  brandId: string;
}

export function MenuSynchronization({ branchId, brandId }: MenuSynchronizationProps) {
  const [syncHistory, setSyncHistory] = useState<SyncItem[]>([
    {
      id: '1',
      name: 'Price Update - Margherita Pizza',
      type: 'price',
      status: 'completed',
      details: 'Price updated from ₱250,000 to ₱275,000',
      timestamp: '2024-01-15 14:30:00'
    },
    {
      id: '2',
      name: 'New Menu Item - Caesar Salad',
      type: 'menu_item',
      status: 'completed',
      details: 'Added new appetizer to branch menu',
      timestamp: '2024-01-15 13:15:00'
    },
    {
      id: '3',
      name: 'Availability Change - Grilled Salmon',
      type: 'availability',
      status: 'failed',
      details: 'Failed to update availability due to conflicting customizations',
      timestamp: '2024-01-15 12:45:00'
    },
    {
      id: '4',
      name: 'Category Reorganization',
      type: 'category',
      status: 'pending',
      details: 'Beverages category split into Hot and Cold',
      timestamp: '2024-01-15 11:00:00'
    }
  ]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'syncing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'menu_item':
        return 'Menu Item';
      case 'price':
        return 'Price';
      case 'category':
        return 'Category';
      case 'availability':
        return 'Availability';
      default:
        return 'Unknown';
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync process
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Update sync history
    setTimeout(() => {
      setSyncHistory(prev => [
        {
          id: Date.now().toString(),
          name: 'Manual Sync Operation',
          type: 'menu_item',
          status: 'completed',
          details: 'Synchronized 5 menu items from brand menu',
          timestamp: new Date().toLocaleString()
        },
        ...prev
      ]);
    }, 2000);
  };

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exporting menu data...');
  };

  const handleImport = () => {
    // Simulate import functionality
    console.log('Importing menu data...');
  };

  const handleRetrySync = (itemId: string) => {
    setSyncHistory(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, status: 'syncing' as const }
        : item
    ));

    // Simulate retry
    setTimeout(() => {
      setSyncHistory(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, status: Math.random() > 0.3 ? 'completed' as const : 'failed' as const }
          : item
      ));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Sync Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Sync className="h-5 w-5" />
              <span>Menu Synchronization</span>
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                style={{backgroundColor: '#9B1D20'}}
                className="text-white hover:bg-red-700"
              >
                <Sync className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {isSyncing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Sync Progress</span>
                  <span>{syncProgress}%</span>
                </div>
                <Progress value={syncProgress} className="w-full" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {syncHistory.filter(item => item.status === 'completed').length}
                </div>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {syncHistory.filter(item => item.status === 'failed').length}
                </div>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {syncHistory.filter(item => item.status === 'syncing').length}
                </div>
                <p className="text-sm text-gray-600">Syncing</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {syncHistory.filter(item => item.status === 'pending').length}
                </div>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {syncHistory.some(item => item.status === 'failed') && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Some synchronization items failed. Review the details below and retry if necessary.
          </AlertDescription>
        </Alert>
      )}

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Sync History</span>
          </CardTitle>
          <p className="text-gray-600">
            Recent synchronization activities and their status
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {syncHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(item.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{item.details}</p>
                    <p className="text-xs text-gray-500">{item.timestamp}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {item.status === 'failed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetrySync(item.id)}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry
                    </Button>
                  )}

                  <Badge
                    className={getStatusColor(item.status)}
                    variant="secondary"
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}

            {syncHistory.length === 0 && (
              <div className="text-center py-8">
                <Sync className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sync history</h3>
                <p className="text-gray-500">
                  Synchronization activities will appear here once you start syncing.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Options */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Configuration</CardTitle>
          <p className="text-gray-600">
            Configure automatic synchronization settings
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Automatic Sync</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <div>
                      <p className="font-medium">Sync menu items</p>
                      <p className="text-sm text-gray-500">Automatically sync new menu items from brand</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <div>
                      <p className="font-medium">Sync price updates</p>
                      <p className="text-sm text-gray-500">Update prices when brand menu changes</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <div>
                      <p className="font-medium">Sync availability</p>
                      <p className="text-sm text-gray-500">Update item availability status</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Sync Schedule</h4>
                <div className="space-y-3">
                  <select className="w-full p-2 border rounded-md">
                    <option>Every hour</option>
                    <option>Every 6 hours</option>
                    <option selected>Daily at 2:00 AM</option>
                    <option>Weekly on Sunday</option>
                    <option>Manual only</option>
                  </select>
                  <div className="text-sm text-gray-500">
                    Last sync: 2 hours ago
                    <br />
                    Next sync: In 4 hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}