'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Maximize2,
  Edit3,
  Save,
  Plus,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Coffee,
  Wifi,
  Car,
  Settings,
  Square,
  Circle,
  RectangleHorizontal,
  RotateCw,
  CreditCard
} from 'lucide-react';
import POSSidebar from './POSSidebar';

interface TableData {
  id: string;
  name: string;
  code: string;
  zone_name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  current_guests?: number;
  order_time?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  shape: 'rectangle' | 'circle' | 'square';
  table_type: 'small' | 'standard' | 'large' | 'vip';
  is_mergeable: boolean;
  description?: string;
}

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  items: number;
  total: number;
  status: 'preparing' | 'ready' | 'delivering' | 'delivered';
  time: string;
  rider?: string;
  estimatedTime?: string;
  address?: string;
}

interface VisualTableCanvasProps {
  branchId?: string;
  onTableSelect?: (table: TableData) => void;
  readOnly?: boolean;
}

export default function VisualTableCanvas({
  branchId,
  onTableSelect,
  readOnly = false
}: VisualTableCanvasProps) {
  const [tables, setTables] = useState<TableData[]>([]);
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [newTableData, setNewTableData] = useState({
    code: '',
    capacity: 4,
    shape: 'rectangle' as const,
    zone_name: 'Main Dining'
  });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isPOSVisible, setIsPOSVisible] = useState(false);
  const [selectedTableForPOS, setSelectedTableForPOS] = useState<TableData | null>(null);

  // Update canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Load real table data
  useEffect(() => {
    const loadTables = async () => {
      try {
        const response = await fetch('/api/tables');
        const result = await response.json();

        if (result.success && result.data) {
          const transformedTables: TableData[] = result.data.map((table: any) => ({
            id: table.id,
            name: table.name,
            code: table.code,
            zone_name: table.zone_name || 'General',
            capacity: table.capacity || 4,
            status: table.is_reserved ? 'reserved' : table.is_available ? 'available' : 'occupied',
            position: {
              x: table.position_x || Math.random() * 400,
              y: table.position_y || Math.random() * 300
            },
            size: {
              width: table.width || 80,
              height: table.height || 60
            },
            shape: table.shape || 'rectangle',
            table_type: table.table_type || 'standard',
            is_mergeable: table.is_mergeable || false,
            description: table.description
          }));

          setTables(transformedTables);
        }
      } catch (error) {
        console.error('Failed to load tables:', error);
        // Load fallback data
        loadFallbackData();
      }
    };

    const loadFallbackData = () => {
      const mockTables: TableData[] = [
        {
          id: '1',
          name: 'Table A01',
          code: 'A01',
          zone_name: 'Main Dining',
          capacity: 4,
          status: 'occupied',
          current_guests: 3,
          order_time: '12:30',
          position: { x: 50, y: 50 },
          size: { width: 80, height: 60 },
          shape: 'rectangle',
          table_type: 'standard',
          is_mergeable: false
        },
        {
          id: '2',
          name: 'Table A02',
          code: 'A02',
          zone_name: 'Main Dining',
          capacity: 4,
          status: 'available',
          position: { x: 150, y: 50 },
          size: { width: 80, height: 60 },
          shape: 'rectangle',
          table_type: 'standard',
          is_mergeable: true
        }
      ];
      setTables(mockTables);
    };

    loadTables();

    // Load delivery orders
    const mockDeliveryOrders: DeliveryOrder[] = [
      {
        id: '1',
        orderNumber: 'DEL-001',
        customerName: 'Nguyen Van A',
        customerPhone: '0912345678',
        items: 3,
        total: 250000,
        status: 'preparing',
        time: '13:45',
        estimatedTime: '14:15',
        address: '123 Nguyen Hue, Q1, HCMC'
      }
    ];
    setDeliveryOrders(mockDeliveryOrders);
  }, [branchId]);

  const zones = ['all', ...Array.from(new Set(tables.map(t => t.zone_name)))];
  const filteredTables = selectedZone === 'all'
    ? tables
    : tables.filter(t => t.zone_name === selectedZone);

  const getStatusColor = (status: TableData['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200';
      case 'occupied': return 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200';
      case 'reserved': return 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200';
      case 'cleaning': return 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200';
      default: return 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200';
    }
  };

  const getTableTypeColor = (type: TableData['table_type']) => {
    switch (type) {
      case 'vip': return 'border-purple-400 bg-purple-50';
      case 'large': return 'border-orange-400 bg-orange-50';
      case 'small': return 'border-cyan-400 bg-cyan-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getDeliveryStatusColor = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivering': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTableDragStart = useCallback((tableId: string) => {
    if (isEditMode && !readOnly) {
      setDraggedTable(tableId);
    }
  }, [isEditMode, readOnly]);

  const handleTableDragEnd = useCallback((e: React.DragEvent, tableId: string) => {
    if (isEditMode && !readOnly && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left - 40, rect.width - 80));
      const y = Math.max(0, Math.min(e.clientY - rect.top - 30, rect.height - 60));

      setTables(prev => prev.map(table =>
        table.id === tableId
          ? { ...table, position: { x, y } }
          : table
      ));
    }
    setDraggedTable(null);
  }, [isEditMode, readOnly]);

  const handleTableClick = useCallback((table: TableData) => {
    if (!isEditMode) {
      setSelectedTable(table.id);
      setSelectedTableForPOS(table);
      setIsPOSVisible(true);
      onTableSelect?.(table);
    }
  }, [isEditMode, onTableSelect]);

  const handleAddTable = useCallback(() => {
    if (!newTableData.code.trim()) return;

    const newTable: TableData = {
      id: `table-${Date.now()}`,
      name: `Table ${newTableData.code}`,
      code: newTableData.code,
      zone_name: newTableData.zone_name,
      capacity: newTableData.capacity,
      status: 'available',
      position: {
        x: Math.random() * (canvasSize.width - 100),
        y: Math.random() * (canvasSize.height - 100)
      },
      size: {
        width: newTableData.shape === 'circle' ? 60 : 80,
        height: newTableData.shape === 'circle' ? 60 : 60
      },
      shape: newTableData.shape,
      table_type: 'standard',
      is_mergeable: false
    };

    setTables(prev => [...prev, newTable]);
    setNewTableData({
      code: '',
      capacity: 4,
      shape: 'rectangle',
      zone_name: selectedZone === 'all' ? 'Main Dining' : selectedZone
    });
    setIsAddingTable(false);
  }, [newTableData, canvasSize, selectedZone]);

  const handleDeleteTable = useCallback((tableId: string) => {
    setTables(prev => prev.filter(t => t.id !== tableId));
    setSelectedTable(null);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Header Controls */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Visual Table Management</h1>

            {/* Zone Filter */}
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {zones.map(zone => (
                <option key={zone} value={zone}>
                  {zone === 'all' ? 'All Zones' : zone}
                </option>
              ))}
            </select>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Available: {tables.filter(t => t.status === 'available').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Occupied: {tables.filter(t => t.status === 'occupied').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Reserved: {tables.filter(t => t.status === 'reserved').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Cleaning: {tables.filter(t => t.status === 'cleaning').length}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!readOnly && (
              <button
                onClick={() => setIsAddingTable(true)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Table
              </button>
            )}

            {!readOnly && (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isEditMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isEditMode ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {isEditMode ? 'Save Layout' : 'Edit Mode'}
              </button>
            )}

            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>

            <button
              onClick={() => setIsPOSVisible(!isPOSVisible)}
              className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              POS
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Main Canvas Area */}
        <div className="flex-1 p-4">
          <div
            ref={canvasRef}
            className="relative bg-white rounded-lg border-2 border-dashed border-gray-300 h-full overflow-hidden"
            style={{ minHeight: '600px' }}
          >
            {/* Grid Background */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #000 1px, transparent 1px),
                  linear-gradient(to bottom, #000 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Zone Labels */}
            {zones.slice(1).map(zone => {
              const zoneTables = filteredTables.filter(t => t.zone_name === zone);
              if (zoneTables.length === 0) return null;

              const minX = Math.min(...zoneTables.map(t => t.position.x));
              const minY = Math.min(...zoneTables.map(t => t.position.y));

              return (
                <div
                  key={zone}
                  className="absolute text-xs font-semibold text-gray-400 uppercase tracking-wide bg-white px-2 py-1 rounded border border-gray-200"
                  style={{ left: minX, top: minY - 25 }}
                >
                  {zone}
                </div>
              );
            })}

            {/* Tables */}
            {filteredTables.map(table => (
              <div
                key={table.id}
                draggable={isEditMode && !readOnly}
                onDragStart={() => handleTableDragStart(table.id)}
                onDragEnd={(e) => handleTableDragEnd(e, table.id)}
                onClick={() => handleTableClick(table)}
                className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-xs font-medium ${getStatusColor(table.status)} ${getTableTypeColor(table.table_type)} ${
                  isEditMode ? 'cursor-move hover:shadow-lg' : 'hover:scale-105'
                } ${draggedTable === table.id ? 'opacity-50' : ''} ${
                  selectedTable === table.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: `${table.position.x}px`,
                  top: `${table.position.y}px`,
                  width: `${table.size.width}px`,
                  height: `${table.size.height}px`,
                  borderRadius: table.shape === 'circle' ? '50%' : '8px'
                }}
              >
                <div className="text-center">
                  <div className="font-bold">{table.code}</div>
                  {table.table_type === 'vip' && (
                    <div className="text-[10px] uppercase tracking-wide opacity-75">VIP</div>
                  )}
                  {table.status === 'occupied' && table.current_guests && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Users className="w-3 h-3" />
                      <span>{table.current_guests}/{table.capacity}</span>
                    </div>
                  )}
                  {table.status === 'occupied' && table.order_time && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{table.order_time}</span>
                    </div>
                  )}
                  {table.status === 'available' && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Users className="w-3 h-3" />
                      <span>{table.capacity}</span>
                    </div>
                  )}
                  {table.is_mergeable && (
                    <div className="text-[10px] mt-1 opacity-75">Mergeable</div>
                  )}
                </div>

                {/* Delete button in edit mode */}
                {isEditMode && !readOnly && selectedTable === table.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTable(table.id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {/* Empty State */}
            {filteredTables.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">
                    <Package className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-500 text-sm">No tables found in {selectedZone}</p>
                  {!readOnly && (
                    <button
                      onClick={() => setIsAddingTable(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                    >
                      Add First Table
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Queue Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Delivery Queue</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {deliveryOrders.filter(o => o.status !== 'delivered').length}
            </span>
          </div>

          <div className="space-y-3">
            {deliveryOrders.map(order => (
              <div key={order.id} className={`border rounded-lg p-3 ${getDeliveryStatusColor(order.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-sm">{order.orderNumber}</div>
                    <div className="text-xs opacity-75">{order.customerName}</div>
                    {order.customerPhone && (
                      <div className="text-xs opacity-75">{order.customerPhone}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{order.total.toLocaleString()}đ</div>
                    <div className="text-xs opacity-75">{order.time}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-3 h-3" />
                    <span className="text-xs">{order.items} items</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {order.status === 'preparing' && <Coffee className="w-3 h-3" />}
                    {order.status === 'ready' && <CheckCircle className="w-3 h-3" />}
                    {order.status === 'delivering' && <Car className="w-3 h-3" />}
                    {order.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                    <span className="text-xs capitalize">{order.status}</span>
                  </div>
                </div>

                {order.estimatedTime && order.status === 'preparing' && (
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-current/20">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">Est: {order.estimatedTime}</span>
                  </div>
                )}

                {order.rider && (
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-current/20">
                    <Users className="w-3 h-3" />
                    <span className="text-xs">{order.rider}</span>
                  </div>
                )}

                {order.address && (
                  <div className="mt-2 pt-2 border-t border-current/20">
                    <div className="text-xs opacity-75">{order.address}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {deliveryOrders.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Car className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-gray-500 text-sm">No delivery orders</p>
            </div>
          )}

          {!readOnly && (
            <button className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              Add Manual Order
            </button>
          )}
        </div>
      </div>

      {/* Add Table Modal */}
      {isAddingTable && !readOnly && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Table</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table Code</label>
                <input
                  type="text"
                  value={newTableData.code}
                  onChange={(e) => setNewTableData(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., A01, B02"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newTableData.capacity}
                  onChange={(e) => setNewTableData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
                <select
                  value={newTableData.zone_name}
                  onChange={(e) => setNewTableData(prev => ({ ...prev, zone_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {zones.slice(1).map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewTableData(prev => ({ ...prev, shape: 'rectangle' }))}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 border rounded-md text-sm transition-colors ${
                      newTableData.shape === 'rectangle'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <RectangleHorizontal className="w-4 h-4" />
                    Rectangle
                  </button>
                  <button
                    onClick={() => setNewTableData(prev => ({ ...prev, shape: 'circle' }))}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 border rounded-md text-sm transition-colors ${
                      newTableData.shape === 'circle'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Circle className="w-4 h-4" />
                    Circle
                  </button>
                  <button
                    onClick={() => setNewTableData(prev => ({ ...prev, shape: 'square' }))}
                    className={`flex-1 flex items-center justify-center gap-2 p-2 border rounded-md text-sm transition-colors ${
                      newTableData.shape === 'square'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Square className="w-4 h-4" />
                    Square
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsAddingTable(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTable}
                disabled={!newTableData.code.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS Sidebar */}
      <POSSidebar
        isVisible={isPOSVisible}
        onClose={() => setIsPOSVisible(false)}
        selectedTable={selectedTableForPOS}
      />
    </div>
  );
}