'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import TestLayout from '@/components/hub/TestLayout';
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
  const [searchTerm, setSearchTerm] = useState('');
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
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
    <TestLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Menu Management', active: true}
        ]}
      }
      title="Menu Management"
      subtitle="Manage menu items, categories, and pricing across all branches."
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Items
              </CardTitle>
              <Utensils className="h-4 w-4" style={{color: '#9B1D20'}} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{color: '#9B1D20'}}>487</div>
              <p className="text-xs text-gray-500">Across all categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Items
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">462</div>
              <p className="text-xs text-gray-500">Currently available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Categories
              </CardTitle>
              <Filter className="h-4 w-4" style={{color: '#9B1D20'}} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{color: '#9B1D20'}}>7</div>
              <p className="text-xs text-gray-500">Menu categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Rating
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">4.3</div>
              <p className="text-xs text-gray-500">Customer satisfaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="items" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="items">Menu Items</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button style={{backgroundColor: '#9B1D20'}} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          <TabsContent value="items" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "" : ""}
                  style={selectedCategory === category.id ? {backgroundColor: '#9B1D20'} : {}}
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        {getStatusBadge(item.status)}
                        {item.trending && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        <div className="text-lg font-bold" style={{color: '#9B1D20'}}>
                          ₫{item.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{item.branches} branches</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{item.lastUpdated}</span>
                        </div>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.filter(cat => cat.id !== 'all').map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{color: '#9B1D20'}}>
                      {category.count}
                    </div>
                    <p className="text-sm text-gray-500">Menu items</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active</span>
                        <span className="font-medium text-green-600">
                          {Math.floor(category.count * 0.95)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Inactive</span>
                        <span className="font-medium text-gray-600">
                          {Math.ceil(category.count * 0.05)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {menuItems.slice(0, 5).map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-medium" style={{backgroundColor: '#FFE4E1', color: '#9B1D20'}}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium" style={{color: '#9B1D20'}}>
                            ₫{item.price.toLocaleString()}
                          </p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-sm">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Price updates completed</p>
                        <p className="text-sm text-gray-500">23 items updated across SOL Pizza brand</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">New items added</p>
                        <p className="text-sm text-gray-500">5 seasonal items added to menu</p>
                        <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Menu review completed</p>
                        <p className="text-sm text-gray-500">Monthly menu optimization finished</p>
                        <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </HubLayout>
  );
}