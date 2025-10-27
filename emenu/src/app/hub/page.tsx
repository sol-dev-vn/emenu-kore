'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingPage from '@/components/ui/LoadingPage';
import { BRAND_COLORS, BRAND_COMBINATIONS } from '@/lib/styling-constants';
import { useDashboardStats, useBrandsAndBranches } from '@/hooks/use-directus-data';
import {
  Store,
  Table,
  RefreshCw
} from 'lucide-react';

export default function HubPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { branchCount, tableCount, loading, error, refetch } = useDashboardStats();
  const { brands, branches, loading: brandsLoading, error: brandsError } = useBrandsAndBranches();

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

  // Real stats from database
  const stats = [
    {
      title: 'Total Branches',
      value: branchCount.toString(),
      icon: Store,
      color: BRAND_COLORS.primary,
      description: 'Restaurant locations'
    },
    {
      title: 'Total Tables',
      value: tableCount.toString(),
      icon: Table,
      color: BRAND_COLORS.primary,
      description: 'Across all branches'
    }
  ];

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-white">
        {/* Header with refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-text">Dashboard Overview</h1>
            <p className="text-brand-text/70 mt-1">System status and statistics</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={loading}
            className="hover:bg-brand-primary/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Error state */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800 text-sm">Error loading data: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Brands and Branches Section */}
        <Card className={BRAND_COMBINATIONS.card}>
          <CardHeader>
            <CardTitle>Brands & Branches</CardTitle>
          </CardHeader>
          <CardContent>
            {brandsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="space-y-2">
                      {Array.from({ length: 2 }).map((_, j) => (
                        <div key={j} className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : brandsError ? (
              <p className="text-red-600 text-sm">Error loading brands and branches</p>
            ) : (
              <div className="space-y-6">
                {brands.map((brand: any) => (
                  <div key={brand.id} className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                        <Store className="h-6 w-6 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{brand.name}</h3>
                        <p className="text-sm text-gray-600">{brand.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {branches
                        .filter((branch: any) => branch.brand_id === brand.id)
                        .map((branch: any) => (
                          <div
                            key={branch.id}
                            onClick={() => router.push(`/hub/live?branch=${branch.id}`)}
                            className="p-3 border rounded-lg cursor-pointer hover:bg-brand-primary/5 hover:border-brand-primary transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{branch.name}</h4>
                              <Store className="h-4 w-4 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{branch.address}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Table className="h-3 w-3 mr-1" />
                              {branch.tables_count} tables
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Simple Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className={BRAND_COMBINATIONS.card}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${BRAND_COLORS.primary}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${BRAND_COLORS.primary}`}>
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Simple Status Card */}
        <Card className={BRAND_COMBINATIONS.card}>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <div>
                <p className="text-sm font-medium">All Systems Operational</p>
                <p className="text-xs text-gray-600">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}