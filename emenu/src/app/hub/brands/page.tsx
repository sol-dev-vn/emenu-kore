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
  Building,
  Plus,
  Search,
  Edit,
  Eye,
  Settings,
  Utensils,
  Store,
  TrendingUp
} from 'lucide-react';

export default function BrandManagementPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

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

  // Mock data for brands
  const brands = [
    {
      id: '1',
      name: 'Miwaku Premium',
      description: 'Premium Japanese dining experience',
      logo: '/images/brands/miwaku-premium.png',
      branches: 3,
      menuItems: 89,
      status: 'active',
      lastUpdated: '2 hours ago',
      color: '#D4AF37'
    },
    {
      id: '2',
      name: 'S79 Japanese Teppanyaki',
      description: 'Authentic Japanese teppanyaki restaurant',
      logo: '/images/brands/s79-teppanyaki.png',
      branches: 2,
      menuItems: 76,
      status: 'active',
      lastUpdated: '1 day ago',
      color: '#DC143C'
    },
    {
      id: '3',
      name: 'Kohaku Sashimi & Yakiniku',
      description: 'Japanese sashimi and BBQ restaurant',
      logo: '/images/brands/kohaku-sashimi.png',
      branches: 2,
      menuItems: 112,
      status: 'active',
      lastUpdated: '3 hours ago',
      color: '#8B4513'
    },
    {
      id: '4',
      name: 'Kohaku Sushi',
      description: 'Traditional Japanese sushi restaurant',
      logo: '/images/brands/kohaku-sushi.png',
      branches: 2,
      menuItems: 95,
      status: 'active',
      lastUpdated: '1 week ago',
      color: '#000080'
    },
    {
      id: '5',
      name: 'Kohaku Udon & Ramen',
      description: 'Japanese noodle house',
      logo: '/images/brands/kohaku-udon.png',
      branches: 2,
      menuItems: 68,
      status: 'active',
      lastUpdated: '2 days ago',
      color: '#FF8C00'
    },
    {
      id: '6',
      name: 'Date Nariya',
      description: 'Japanese Gyutan steak restaurant',
      logo: '/images/brands/date-nariya.png',
      branches: 2,
      menuItems: 54,
      status: 'active',
      lastUpdated: '4 days ago',
      color: '#800020'
    },
    {
      id: '7',
      name: 'Machida Shoten',
      description: 'Traditional Japanese izakaya',
      logo: '/images/brands/machida-shoten.png',
      branches: 1,
      menuItems: 42,
      status: 'active',
      lastUpdated: '5 days ago',
      color: '#2F4F4F'
    }
  ];

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {label: 'Brand Management', active: true}
        ]} />
      }
      title="Brand Management"
      subtitle="Manage restaurant brands, their configurations, and master menus."
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button style={{backgroundColor: '#9B1D20'}}>
            <Plus className="h-4 w-4 mr-2" />
            Add Brand
          </Button>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Brand Logo */}
                    <div
                      className="flex items-center justify-center w-12 h-12 rounded-full"
                      style={{ backgroundColor: `${brand.color}20` }}
                    >
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <Building className="h-6 w-6" style={{ color: brand.color }} />
                      )}
                    </div>

                    {/* Brand Info */}
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {brand.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{brand.description}</p>
                    </div>
                  </div>
                  <div className="ml-auto">
                    {getStatusBadge(brand.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Branches</p>
                      <p className="font-medium">{brand.branches}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Menu Items</p>
                      <p className="font-medium">{brand.menuItems}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>Last updated: {brand.lastUpdated}</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
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