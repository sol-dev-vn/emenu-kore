'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Utensils,
  Plus,
  Search,
  Edit,
  Eye,
  MapPin,
  Building,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function BranchMenuPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#9B1D20'}}></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mock data
  const brands = [
    { id: 'all', name: 'All Brands', branches: 13 },
    { id: '1', name: 'Miwaku Premium', branches: 3 },
    { id: '2', name: 'S79 Japanese Teppanyaki', branches: 2 },
    { id: '3', name: 'Kohaku Sashimi & Yakiniku', branches: 2 },
    { id: '4', name: 'Kohaku Sushi', branches: 2 },
    { id: '5', name: 'Kohaku Udon & Ramen', branches: 2 },
    { id: '6', name: 'Date Nariya', branches: 2 },
    { id: '7', name: 'Machida Shoten', branches: 1 }
  ];

  const branches = [
    { id: 'all', name: 'All Branches', brandId: 'all' },
    { id: '1-1', name: 'Miwaku Premium Landmark 81', brandId: '1', brandMenu: 89, selectedItems: 72 },
    { id: '2-1', name: 'S79 Teppanyaki District 1', brandId: '2', brandMenu: 76, selectedItems: 65 },
    { id: '2-2', name: 'S79 Teppanyaki District 7', brandId: '2', brandMenu: 76, selectedItems: 68 },
    { id: '3-1', name: 'Kohaku Sashimi District 1', brandId: '3', brandMenu: 112, selectedItems: 95 },
    { id: '3-2', name: 'Kohaku Sashimi Thao Dien', brandId: '3', brandMenu: 112, selectedItems: 88 },
    { id: '4-1', name: 'Kohaku Sushi District 1', brandId: '4', brandMenu: 95, selectedItems: 78 },
    { id: '4-2', name: 'Kohaku Sushi Phu My Hung', brandId: '4', brandMenu: 95, selectedItems: 82 },
    { id: '5-1', name: 'Kohaku Udon District 1', brandId: '5', brandMenu: 68, selectedItems: 56 },
    { id: '6-1', name: 'Date Nariya District 1', brandId: '6', brandMenu: 54, selectedItems: 42 },
    { id: '6-2', name: 'Date Nariya Thao Dien', brandId: '6', brandMenu: 54, selectedItems: 48 },
    { id: '7-1', name: 'Machida Shoten District 1', brandId: '7', brandMenu: 42, selectedItems: 35 }
  ];

  const branchMenus = [
    {
      id: '1',
      branchId: '1-1',
      branchName: 'Miwaku Premium Landmark 81',
      brandName: 'Miwaku Premium',
      parentMenu: 'Miwaku Premium Brand Menu',
      selectedItems: 72,
      totalItems: 89,
      lastUpdated: '1 day ago',
      status: 'active',
      coverage: 81
    },
    {
      id: '2',
      branchId: '2-1',
      branchName: 'S79 Teppanyaki District 1',
      brandName: 'S79 Japanese Teppanyaki',
      parentMenu: 'S79 Teppanyaki Brand Menu',
      selectedItems: 65,
      totalItems: 76,
      lastUpdated: '3 hours ago',
      status: 'active',
      coverage: 86
    },
    {
      id: '3',
      branchId: '2-2',
      branchName: 'S79 Teppanyaki District 7',
      brandName: 'S79 Japanese Teppanyaki',
      parentMenu: 'S79 Teppanyaki Brand Menu',
      selectedItems: 68,
      totalItems: 76,
      lastUpdated: '5 hours ago',
      status: 'active',
      coverage: 89
    },
    {
      id: '4',
      branchId: '3-1',
      branchName: 'Kohaku Sashimi District 1',
      brandName: 'Kohaku Sashimi & Yakiniku',
      parentMenu: 'Kohaku Sashimi & Yakiniku Brand Menu',
      selectedItems: 95,
      totalItems: 112,
      lastUpdated: '2 days ago',
      status: 'active',
      coverage: 85
    },
    {
      id: '5',
      branchId: '3-2',
      branchName: 'Kohaku Sashimi Thao Dien',
      brandName: 'Kohaku Sashimi & Yakiniku',
      parentMenu: 'Kohaku Sashimi & Yakiniku Brand Menu',
      selectedItems: 88,
      totalItems: 112,
      lastUpdated: '4 days ago',
      status: 'active',
      coverage: 79
    },
    {
      id: '6',
      branchId: '4-1',
      branchName: 'Kohaku Sushi District 1',
      brandName: 'Kohaku Sushi',
      parentMenu: 'Kohaku Sushi Brand Menu',
      selectedItems: 78,
      totalItems: 95,
      lastUpdated: '1 week ago',
      status: 'active',
      coverage: 82
    },
    {
      id: '7',
      branchId: '4-2',
      branchName: 'Kohaku Sushi Phu My Hung',
      brandName: 'Kohaku Sushi',
      parentMenu: 'Kohaku Sushi Brand Menu',
      selectedItems: 82,
      totalItems: 95,
      lastUpdated: '3 days ago',
      status: 'active',
      coverage: 86
    }
  ];

  const filteredMenus = branchMenus.filter(menu => {
    const matchesSearch = menu.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         menu.brandName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || menu.branchId.startsWith(selectedBrand);
    const matchesBranch = selectedBranch === 'all' || menu.branchId === selectedBranch;
    return matchesSearch && matchesBrand && matchesBranch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Restaurant Management', href: '/hub/branches'},
          {label: 'Restaurant Menu', active: true}
        ]} />
      }
      title="Restaurant Menus"
      subtitle="Configure branch-specific menus as subsets of brand menus. Each restaurant can select which items to offer from their brand's master menu."
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search restaurant menus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <Button style={{backgroundColor: '#9B1D20'}}>
            <Plus className="h-4 w-4 mr-2" />
            Configure Menu
          </Button>
        </div>

        {/* Branch Menus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenus.map((menu) => (
            <Card key={menu.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{menu.branchName}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{menu.brandName}</p>
                    <p className="text-xs text-gray-500">{menu.parentMenu}</p>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(menu.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Menu Coverage</span>
                    <span className="font-medium">{menu.selectedItems} / {menu.totalItems}</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                      style={{width: `${menu.coverage}%`, backgroundColor: '#9B1D20'}}
                    ></div>
                  </div>

                  <div className="text-center text-sm text-gray-600">
                    <p>{menu.coverage}% of brand menu items selected</p>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>Last updated: {menu.lastUpdated}</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View Items
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Select Items
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </HubLayout>
  );
}