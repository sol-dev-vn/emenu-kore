'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Grid3X3,
  Maximize2,
  Download,
  RefreshCw,
  QrCode,
  Eye,
  Edit
} from 'lucide-react';

interface Layout {
  id: string;
  name: string;
  description: string;
  tables_count: number;
}

interface TableLayoutViewerProps {
  branchId: string;
  layouts: Layout[];
}

export function TableLayoutViewer({ branchId, layouts }: TableLayoutViewerProps) {
  const [selectedLayout, setSelectedLayout] = useState<string>(layouts[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);

  const currentLayout = layouts.find(l => l.id === selectedLayout) || layouts[0];

  // Mock table data
  const mockTables = Array.from({ length: currentLayout?.tables_count || 24 }, (_, i) => ({
    id: `table-${i + 1}`,
    number: i + 1,
    status: ['available', 'occupied', 'reserved'][Math.floor(Math.random() * 3)] as 'available' | 'occupied' | 'reserved',
    capacity: [2, 4, 6][Math.floor(Math.random() * 3)],
    zone: ['Main', 'VIP', 'Outdoor'][Math.floor(Math.random() * 3)],
    current_session: Math.random() > 0.7 ? {
      id: `session-${i + 1}`,
      order_count: Math.floor(Math.random() * 10) + 1,
      duration: Math.floor(Math.random() * 60) + 15,
      amount: Math.floor(Math.random() * 500000) + 50000
    } : null
  }));

  const getTableColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'occupied':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getTableIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '✓';
      case 'occupied':
        return '👥';
      case 'reserved':
        return '🕐';
      default:
        return '○';
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Layout Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Grid3X3 className="h-5 w-5" />
                <span>Table Layout</span>
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Visual representation of restaurant floor plan and table status
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={selectedLayout} onValueChange={setSelectedLayout}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  {layouts.map((layout) => (
                    <SelectItem key={layout.id} value={layout.id}>
                      {layout.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {currentLayout && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900">{currentLayout.name}</h3>
              <p className="text-sm text-gray-600">{currentLayout.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary">{currentLayout.tables_count} tables</Badge>
                <Badge variant="outline">
                  {mockTables.filter(t => t.status === 'available').length} available
                </Badge>
                <Badge variant="outline">
                  {mockTables.filter(t => t.status === 'occupied').length} occupied
                </Badge>
                <Badge variant="outline">
                  {mockTables.filter(t => t.status === 'reserved').length} reserved
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table Grid */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mockTables.map((table) => (
              <div
                key={table.id}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getTableColor(
                  table.status
                )}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{getTableIcon(table.status)}</div>
                  <div className="font-bold text-lg">T{table.number}</div>
                  <div className="text-xs font-medium">{table.capacity} seats</div>
                  <div className="text-xs mt-1">{table.zone}</div>
                </div>

                {table.current_session && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {table.current_session.order_count}
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="flex space-x-1">
                    <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                      <QrCode className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
              <span className="text-sm text-gray-600">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
              <span className="text-sm text-gray-600">Reserved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </div>
              <span className="text-sm text-gray-600">Order count</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}