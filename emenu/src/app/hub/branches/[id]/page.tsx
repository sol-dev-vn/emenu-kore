'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Users,
  Settings,
  Edit,
  QrCode,
  Grid3X3,
  Menu as MenuIcon,
  Info
} from 'lucide-react';
import { BranchHeader } from '@/components/hub/BranchHeader';
import { TableLayoutViewer } from '@/components/hub/TableLayoutViewer';
import { MenuManagement } from '@/components/hub/MenuManagement';
import { BranchSettings } from '@/components/hub/BranchSettings';
import { MenuSynchronization } from '@/components/hub/MenuSynchronization';
import { LoadingSkeleton } from '@/components/hub/LoadingSkeleton';

export default function BranchDetailPage() {
  const { user, isLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const branchId = params.id as string;
  const [branch, setBranch] = useState<any>(null);
  const [isLoadingBranch, setIsLoadingBranch] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (branchId) {
      // Mock branch data
      const mockBranch = {
        id: branchId,
        name: 'SOL Pizza - District 1',
        address: '123 Nguyễn Huệ Street, District 1, Ho Chi Minh City',
        phone: '+84 28 3821 1234',
        status: 'active',
        tables_count: 24,
        opening_hours: '10:00 - 22:00',
        manager: {
          name: 'John Smith',
          email: 'john.smith@solpizza.com',
          phone: '+84 90 123 4567'
        },
        brand: {
          id: '1',
          name: 'SOL Pizza',
          logo: '/images/brands/sol-pizza.png'
        },
        created_at: '2023-01-15',
        layouts: [
          {
            id: 'layout-1',
            name: 'Main Floor',
            description: 'Primary dining area',
            tables_count: 24
          },
          {
            id: 'layout-2',
            name: 'VIP Area',
            description: 'Private dining rooms',
            tables_count: 8
          }
        ],
        menu_items: 85,
        active_menu_items: 78
      };

      setTimeout(() => {
        setBranch(mockBranch);
        setIsLoadingBranch(false);
      }, 500);
    }
  }, [branchId]);

  if (isLoading || isLoadingBranch) {
    return <LoadingSkeleton />;
  }

  if (!user || !branch) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                onClick={() => router.push('/hub/branches')}
                className="mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Branch Details</h1>
                <p className="text-sm text-gray-500">Manage branch settings and operations</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge
                className="text-white"
                style={{backgroundColor: '#9B1D20'}}
              >
                {user.role.name}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/hub/branches/${branchId}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Branch
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Branch Header */}
        <BranchHeader branch={branch} />

        <Separator className="my-8" />

        {/* Tabbed Content */}
        <Tabs defaultValue="layout" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="layout" className="flex items-center space-x-2">
              <Grid3X3 className="h-4 w-4" />
              <span>Table Layout</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center space-x-2">
              <MenuIcon className="h-4 w-4" />
              <span>Menu Management</span>
            </TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <span>Sync</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="layout" className="space-y-6">
            <TableLayoutViewer branchId={branchId} layouts={branch.layouts} />
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <MenuManagement
              branchId={branchId}
              brandId={branch.brand.id}
              menuStats={{
                total_items: branch.menu_items,
                active_items: branch.active_menu_items
              }}
            />
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <MenuSynchronization
              branchId={branchId}
              brandId={branch.brand.id}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <BranchSettings branch={branch} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}