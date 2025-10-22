'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Search,
  Plus,
  Filter,
  MapPin,
  Store,
  Users
} from 'lucide-react';
import { BrandGroupedList } from '@/components/hub/BrandGroupedList';
import { LoadingSkeleton } from '@/components/hub/LoadingSkeleton';

export default function BranchesPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Simulate loading branches data
    const timer = setTimeout(() => {
      setIsLoadingBranches(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || isLoadingBranches) {
    return <LoadingSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Branch Management', active: true}
        ]} />
      }
      title="Restaurant Branches"
      subtitle="View and manage all restaurant branches grouped by brand"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {(user?.role?.name === 'Administrator' || user?.role?.name === 'Manager') && (
            <Button
              style={{backgroundColor: '#9B1D20'}}
              className="text-white hover:bg-red-700"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-900">Total Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Store className="h-8 w-8 mr-3" style={{color: '#9B1D20'}} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">30+</p>
                  <p className="text-sm text-gray-500">Active locations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-900">Brands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 mr-3" style={{color: '#9B1D20'}} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                  <p className="text-sm text-gray-500">Restaurant brands</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-900">Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MapPin className="h-8 w-8 mr-3" style={{color: '#9B1D20'}} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">600+</p>
                  <p className="text-sm text-gray-500">Across all branches</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-900">Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 mr-3" style={{color: '#9B1D20'}} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">200+</p>
                  <p className="text-sm text-gray-500">Active employees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Branch Listings */}
        <BrandGroupedList searchTerm={searchTerm} />
      </div>
    </HubLayout>
  );
}
