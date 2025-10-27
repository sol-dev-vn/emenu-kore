'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingPage from '@/components/ui/LoadingPage';
import { BRAND_COLORS, BRAND_COMBINATIONS } from '@/lib/styling-constants';
import {
  Store,
  Table,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function LiveDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const branchId = searchParams.get('branch');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return null;
  }

  if (!branchId) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Card className={BRAND_COMBINATIONS.card}>
          <CardContent className="pt-6">
            <div className="text-center">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Select a Branch</h2>
              <p className="text-gray-600 mb-4">Please select a branch from the overview page to view its live dashboard.</p>
              <button
                onClick={() => router.push('/hub')}
                className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90"
              >
                Back to Overview
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Live Dashboard</h1>
          <p className="text-brand-text/70 mt-1">Real-time branch monitoring</p>
        </div>
        <button
          onClick={() => router.push('/hub')}
          className="px-4 py-2 border border-brand-primary/50 text-brand-text rounded-md hover:bg-brand-primary/5"
        >
          Back to Overview
        </button>
      </div>

      {/* Branch Info */}
      <Card className={BRAND_COMBINATIONS.card}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="h-5 w-5 mr-2 text-brand-primary" />
            Branch Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Branch Name</p>
              <p className="font-semibold text-gray-900">SOL Pizza - District 1</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                <p className="font-semibold text-gray-900">Active</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Open Since</p>
              <p className="font-semibold text-gray-900">10:00 AM</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={BRAND_COMBINATIONS.card}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Active Tables
            </CardTitle>
            <Table className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">
              18 / 24
            </div>
            <p className="text-xs text-gray-600 mt-1">
              75% occupancy
            </p>
          </CardContent>
        </Card>

        <Card className={BRAND_COMBINATIONS.card}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Current Guests
            </CardTitle>
            <Users className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">
              42
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Dining now
            </p>
          </CardContent>
        </Card>

        <Card className={BRAND_COMBINATIONS.card}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Orders Today
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">
              156
            </div>
            <p className="text-xs text-gray-600 mt-1">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className={BRAND_COMBINATIONS.card}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Avg Service Time
            </CardTitle>
            <Clock className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">
              18m
            </div>
            <p className="text-xs text-gray-600 mt-1">
              From order to delivery
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className={BRAND_COMBINATIONS.card}>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 1, table: 'T-05', items: 2, amount: '₫450,000', time: '2 min ago', status: 'preparing' },
              { id: 2, table: 'T-12', items: 4, amount: '₫780,000', time: '5 min ago', status: 'served' },
              { id: 3, table: 'T-08', items: 3, amount: '₫620,000', time: '8 min ago', status: 'served' },
              { id: 4, table: 'T-15', items: 1, amount: '₫280,000', time: '12 min ago', status: 'served' },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-brand-primary">{order.table}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.items} items</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.amount}</p>
                  <p className="text-xs text-gray-500 capitalize">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}