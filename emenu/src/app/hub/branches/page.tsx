'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Plus,
  Filter,
  MapPin,
  Phone,
  Clock,
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
    // Simulate initial loading
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
    <div className="min-h-screen" style={{backgroundColor: '#FFE4E1'}}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/hub')}
                className="mr-4"
              >
                <Store className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Branch Management</h1>
                <p className="text-sm text-gray-500">Manage restaurant locations and layouts</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge style={{backgroundColor: '#9B1D20'}} className="text-white">
                {user.role.name}
              </Badge>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Restaurant Branches</h2>
            <p className="text-gray-600">View and manage all restaurant branches grouped by brand</p>
          </div>

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

            {(user.role.name === 'Administrator' || user.role.name === 'Manager') && (
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
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-lg font-medium text-gray-900">Open Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 mr-3 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">25</p>
                  <p className="text-sm text-gray-500">Currently operating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-900">Total Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MapPin className="h-8 w-8 mr-3 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">600+</p>
                  <p className="text-sm text-gray-500">Across all branches</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Branch Listings */}
        <BrandGroupedList searchTerm={searchTerm} />
      </main>
    </div>
  );
}