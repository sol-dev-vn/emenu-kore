'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Order {
  id: string;
  order_number: string;
  table_id: string;
  table_name?: string;
  zone_name?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  status: string;
  priority: string;
  order_type: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  service_charge: number;
  total_amount: number;
  payment_method?: string;
  payment_status?: string;
  notes?: string;
  special_requests?: string;
  order_items: any[];
  branch_id?: string;
  staff_id?: string;
  external_source: string;
  external_id?: string;
  estimated_time?: number;
  actual_time?: number;
  date_created: string;
  date_updated: string;
}

interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });

  const loadOrders = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (orderTypeFilter) params.append('orderType', orderTypeFilter);
      if (paymentStatusFilter) params.append('paymentStatus', paymentStatusFilter);
      if (dateFilter.from) params.append('dateFrom', dateFilter.from);
      if (dateFilter.to) params.append('dateTo', dateFilter.to);

      const res = await fetch(`/api/orders?${params}`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data || []);
        calculateStats(json.data || []);
      } else {
        setError(json.error || 'Failed to load orders');
      }
    } catch (e) {
      setError('Failed to load orders');
    }
  };

  const calculateStats = (orderData: Order[]) => {
    const newStats: OrderStats = {
      total: orderData.length,
      pending: orderData.filter(o => o.status === 'pending').length,
      confirmed: orderData.filter(o => o.status === 'confirmed').length,
      preparing: orderData.filter(o => o.status === 'preparing').length,
      ready: orderData.filter(o => o.status === 'ready').length,
      completed: orderData.filter(o => o.status === 'completed').length,
      cancelled: orderData.filter(o => o.status === 'cancelled').length,
      totalRevenue: orderData
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.total_amount, 0)
    };
    setStats(newStats);
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      await loadOrders();
      setLoading(false);
    }
    loadData();
  }, [page, searchQuery, statusFilter, priorityFilter, orderTypeFilter, paymentStatusFilter, dateFilter]);

  const formatPrice = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string, compact = false) => {
    const date = new Date(dateString);
    if (compact) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'served':
        return 'bg-teal-100 text-teal-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderTime = (order: Order) => {
    if (order.actual_time) return `${order.actual_time} min`;
    if (order.estimated_time) return `~${order.estimated_time} min`;
    return 'N/A';
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
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-gray-600 mt-2">Manage customer orders, track status, and process payments</p>
        </div>
        <Button>
          New Order
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.preparing}</div>
            <div className="text-sm text-gray-600">Preparing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.ready}</div>
            <div className="text-sm text-gray-600">Ready</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{formatPrice(stats.totalRevenue)}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order #, customer, table..."
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
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Order Type</label>
              <select
                value={orderTypeFilter}
                onChange={(e) => setOrderTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">All Types</option>
                <option value="dine_in">Dine In</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Status</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">All Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">From Date</label>
              <input
                type="date"
                value={dateFilter.from}
                onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To Date</label>
              <input
                type="date"
                value={dateFilter.to}
                onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Table
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 text-xs">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          #{order.order_number}
                        </div>
                        <div className="text-gray-500">
                          {formatDate(order.date_created, true)}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-gray-900">
                          {order.table_name}
                        </div>
                        {order.zone_name && (
                          <div className="text-gray-500">
                            {order.zone_name}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-gray-900">
                          {order.customer_name || 'Walk-in'}
                        </div>
                        {order.customer_phone && (
                          <div className="text-gray-500">
                            {order.customer_phone}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                        {order.order_items?.length || 0}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-semibold text-gray-900">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        {order.priority !== 'normal' && (
                          <div className={`mt-1 px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                            {order.priority}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="space-y-1">
                          {order.payment_method && (
                            <div className="text-xs text-gray-500">
                              {order.payment_method}
                            </div>
                          )}
                          {order.payment_status && (
                            <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                              {order.payment_status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                        {getOrderTime(order)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                            View
                          </Button>
                        </div>
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
  );
}