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
  Filter,
  Edit,
  Eye,
  Star,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function MenuManagementPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  // Mock data for menu items
  const categories = [
    { id: 'all', name: 'All Items', count: 487 },
    { id: 'appetizers', name: 'Appetizers', count: 68 },
    { id: 'mains', name: 'Main Courses', count: 124 },
    { id: 'desserts', name: 'Desserts', count: 52 },
    { id: 'beverages', name: 'Beverages', count: 143 },
    { id: 'specials', name: 'Specials', count: 24 },
    { id: 'kids', name: 'Kids Menu', count: 38 },
    { id: 'sides', name: 'Side Dishes', count: 38 }
  ];

  const menuItems = [
    {
      id: '1',
      name: 'Margherita Pizza',
      category: 'mains',
      price: 250000,
      rating: 4.5,
      status: 'active',
      branches: 26,
      lastUpdated: '2 hours ago',
      trending: true,
      description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil'
    },
    {
      id: '2',
      name: 'Caesar Salad',
      category: 'appetizers',
      price: 85000,
      rating: 4.2,
      status: 'active',
      branches: 24,
      lastUpdated: '1 day ago',
      trending: false,
      description: 'Crisp romaine lettuce with parmesan cheese and croutons'
    },
    {
      id: '3',
      name: 'Tiramisu',
      category: 'desserts',
      price: 95000,
      rating: 4.8,
      status: 'active',
      branches: 22,
      lastUpdated: '3 days ago',
      trending: true,
      description: 'Classic Italian dessert with coffee-soaked ladyfingers'
    }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesCategory;
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
          {label: 'Menu Management', active: true}
        ]} />
      }
      title="Menu Management"
      subtitle="Manage menu items, categories, and pricing across all branches."
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Content */}
        <Tabs defaultValue="brand-menus" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="brand-menus">Brand Menus</TabsTrigger>
              <TabsTrigger value="branch-menus">Branch Menus</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="brand-menus" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Brand Menus</h2>
                <p className="text-gray-600">Each brand has one master menu containing all available menu items. Branch menus are created as subsets of these brand menus.</p>
              </div>

              {/* Brand Menus Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: '1',
                    name: 'Miwaku Premium Brand Menu',
                    brand: 'Miwaku Premium',
                    items: 89,
                    lastUpdated: '2 hours ago',
                    categories: 7,
                    status: 'active'
                  },
                  {
                    id: '2',
                    name: 'S79 Japanese Teppanyaki Brand Menu',
                    brand: 'S79 Japanese Teppanyaki',
                    items: 76,
                    lastUpdated: '1 day ago',
                    categories: 6,
                    status: 'active'
                  },
                  {
                    id: '3',
                    name: 'Kohaku Sashimi & Yakiniku Brand Menu',
                    brand: 'Kohaku Sashimi & Yakiniku',
                    items: 112,
                    lastUpdated: '3 hours ago',
                    categories: 8,
                    status: 'active'
                  },
                  {
                    id: '4',
                    name: 'Kohaku Sushi Brand Menu',
                    brand: 'Kohaku Sushi',
                    items: 95,
                    lastUpdated: '1 week ago',
                    categories: 6,
                    status: 'active'
                  },
                  {
                    id: '5',
                    name: 'Kohaku Udon & Ramen Brand Menu',
                    brand: 'Kohaku Udon & Ramen',
                    items: 68,
                    lastUpdated: '2 days ago',
                    categories: 5,
                    status: 'active'
                  },
                  {
                    id: '6',
                    name: 'Date Nariya Brand Menu',
                    brand: 'Date Nariya',
                    items: 54,
                    lastUpdated: '4 days ago',
                    categories: 4,
                    status: 'active'
                  },
                  {
                    id: '7',
                    name: 'Machida Shoten Brand Menu',
                    brand: 'Machida Shoten',
                    items: 42,
                    lastUpdated: '5 days ago',
                    categories: 4,
                    status: 'active'
                  }
                ].map((brandMenu) => (
                  <Card key={brandMenu.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{brandMenu.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{brandMenu.brand}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {brandMenu.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Menu Items</p>
                            <p className="font-medium">{brandMenu.items}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Categories</p>
                            <p className="font-medium">{brandMenu.categories}</p>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          <p>Last updated: {brandMenu.lastUpdated}</p>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            View Items
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Menu
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

        <TabsContent value="branch-menus" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Branch Menus</h2>
                <p className="text-gray-600">Each branch menu is a selectable subset of items from its parent brand menu. Customize offerings per location while maintaining brand consistency.</p>
              </div>

              {/* Branch Menus Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: '1-1',
                    name: 'Miwaku Premium Landmark 81',
                    brand: 'Miwaku Premium',
                    parentMenu: 'Miwaku Premium Brand Menu',
                    items: 72,
                    parentItems: 89,
                    lastUpdated: '1 day ago',
                    status: 'active'
                  },
                  {
                    id: '2-1',
                    name: 'S79 Teppanyaki District 1',
                    brand: 'S79 Japanese Teppanyaki',
                    parentMenu: 'S79 Japanese Teppanyaki Brand Menu',
                    items: 65,
                    parentItems: 76,
                    lastUpdated: '3 hours ago',
                    status: 'active'
                  },
                  {
                    id: '2-2',
                    name: 'S79 Teppanyaki District 7',
                    brand: 'S79 Japanese Teppanyaki',
                    parentMenu: 'S79 Japanese Teppanyaki Brand Menu',
                    items: 68,
                    parentItems: 76,
                    lastUpdated: '5 hours ago',
                    status: 'active'
                  },
                  {
                    id: '3-1',
                    name: 'Kohaku Sashimi District 1',
                    brand: 'Kohaku Sashimi & Yakiniku',
                    parentMenu: 'Kohaku Sashimi & Yakiniku Brand Menu',
                    items: 95,
                    parentItems: 112,
                    lastUpdated: '2 days ago',
                    status: 'active'
                  },
                  {
                    id: '3-2',
                    name: 'Kohaku Sashimi Thao Dien',
                    brand: 'Kohaku Sashimi & Yakiniku',
                    parentMenu: 'Kohaku Sashimi & Yakiniku Brand Menu',
                    items: 88,
                    parentItems: 112,
                    lastUpdated: '4 days ago',
                    status: 'active'
                  },
                  {
                    id: '4-1',
                    name: 'Kohaku Sushi District 1',
                    brand: 'Kohaku Sushi',
                    parentMenu: 'Kohaku Sushi Brand Menu',
                    items: 78,
                    parentItems: 95,
                    lastUpdated: '1 week ago',
                    status: 'active'
                  },
                  {
                    id: '4-2',
                    name: 'Kohaku Sushi Phu My Hung',
                    brand: 'Kohaku Sushi',
                    parentMenu: 'Kohaku Sushi Brand Menu',
                    items: 82,
                    parentItems: 95,
                    lastUpdated: '3 days ago',
                    status: 'active'
                  },
                  {
                    id: '5-1',
                    name: 'Kohaku Udon District 1',
                    brand: 'Kohaku Udon & Ramen',
                    parentMenu: 'Kohaku Udon & Ramen Brand Menu',
                    items: 56,
                    parentItems: 68,
                    lastUpdated: '1 day ago',
                    status: 'active'
                  },
                  {
                    id: '6-1',
                    name: 'Date Nariya District 1',
                    brand: 'Date Nariya',
                    parentMenu: 'Date Nariya Brand Menu',
                    items: 42,
                    parentItems: 54,
                    lastUpdated: '2 days ago',
                    status: 'active'
                  },
                  {
                    id: '7-1',
                    name: 'Machida Shoten District 1',
                    brand: 'Machida Shoten',
                    parentMenu: 'Machida Shoten Brand Menu',
                    items: 35,
                    parentItems: 42,
                    lastUpdated: '4 days ago',
                    status: 'active'
                  }
                ].map((branchMenu) => (
                  <Card key={branchMenu.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{branchMenu.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{branchMenu.brand}</p>
                          <p className="text-xs text-gray-500">{branchMenu.parentMenu}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {branchMenu.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Menu Items</span>
                          <span className="font-medium">{branchMenu.items} / {branchMenu.parentItems}</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{width: `${(branchMenu.items / branchMenu.parentItems) * 100}%`, backgroundColor: '#9B1D20'}}
                          ></div>
                        </div>

                        <div className="text-xs text-gray-500">
                          <p>Last updated: {branchMenu.lastUpdated}</p>
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
          </TabsContent>
        </Tabs>
      </div>
    </HubLayout>
  );
}
