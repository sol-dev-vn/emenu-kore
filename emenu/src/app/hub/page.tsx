'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Store,
  Utensils,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function HubPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#9B1D20'}}></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mock data for dashboard
  const stats = [
    {
      title: 'Active Branches',
      value: '26',
      change: '+2',
      changeType: 'positive',
      icon: Store,
      color: '#9B1D20'
    },
    {
      title: 'Total Menu Items',
      value: '487',
      change: '+18',
      changeType: 'positive',
      icon: Utensils,
      color: '#9B1D20'
    },
    {
      title: 'Staff Members',
      value: '194',
      change: '+5',
      changeType: 'positive',
      icon: Users,
      color: '#9B1D20'
    },
    {
      title: 'Monthly Revenue',
      value: '₫2.4B',
      change: '+12%',
      changeType: 'positive',
      icon: TrendingUp,
      color: '#9B1D20'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'branch_created',
      message: 'New branch "SOL Pizza - District 7" has been added',
      time: '2 hours ago',
      icon: Store
    },
    {
      id: 2,
      type: 'menu_updated',
      message: 'Menu prices updated for SOL Burger brand',
      time: '4 hours ago',
      icon: Utensils
    },
    {
      id: 3,
      type: 'staff_added',
      message: '3 new staff members joined this week',
      time: '1 day ago',
      icon: Users
    },
    {
      id: 4,
      type: 'system_update',
      message: 'System maintenance completed successfully',
      time: '2 days ago',
      icon: AlertCircle
    }
  ];

  const quickActions = [
    {
      title: 'Add New Branch',
      description: 'Create a new restaurant branch',
      icon: Store,
      href: '/hub/branches?action=create',
      color: '#9B1D20'
    },
    {
      title: 'Update Menu',
      description: 'Manage menu items and pricing',
      icon: Utensils,
      href: '/hub/menus',
      color: '#9B1D20'
    },
    {
      title: 'Generate QR Codes',
      description: 'Create QR codes for tables',
      icon: AlertCircle,
      href: '/hub/qr',
      color: '#9B1D20'
    }
  ];

  return (
    <HubLayout
      breadcrumb={<Breadcrumb items={[{label: 'Overview', active: true}]} />}
      title={`Welcome back, ${user.first_name}!`}
      subtitle="Here's what's happening across your restaurants today."
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4" style={{color: stat.color}} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" style={{color: stat.color}}>
                  {stat.value}
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3 sm:p-4"
                  onClick={() => router.push(action.href)}
                >
                  <div className="flex items-center">
                    <action.icon className="h-5 w-5 mr-3" style={{color: action.color}} />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <activity.icon className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">All Systems Operational</p>
                  <p className="text-xs text-gray-500">No active issues</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Database Connected</p>
                  <p className="text-xs text-gray-500">Response time: 12ms</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Scheduled Maintenance</p>
                  <p className="text-xs text-gray-500">Tonight at 2:00 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </HubLayout>
  );
}