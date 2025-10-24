'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { MenuSynchronization } from './MenuSynchronization';
import {
  Filter,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Package,
  Star,
  Clock,
  RefreshCw as Sync
} from 'lucide-react';

interface MenuStats {
  total_items: number;
  active_items: number;
}

interface MenuManagementProps {
  branchId: string;
  brandId: string;
  menuStats: MenuStats;
}

export function MenuManagement({ branchId, brandId, menuStats }: MenuManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock menu categories
  const categories = [
    { id: 'all', name: 'All Items', count: menuStats.total_items },
    { id: 'appetizers', name: 'Appetizers', count: 15 },
    { id: 'mains', name: 'Main Courses', count: 25 },
    { id: 'desserts', name: 'Desserts', count: 12 },
    { id: 'beverages', name: 'Beverages', count: 20 },
    { id: 'specials', name: 'Specials', count: 8 }
  ];

  // Mock menu items
  const mockMenuItems = [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
      category: 'mains',
      price: 250000,
      image: '/images/menu/margherita.jpg',
      status: 'active',
      is_available_at_branch: true,
      branch_price: 250000,
      dietary_info: ['vegetarian'],
      prep_time: '15-20 min',
      rating: 4.5,
      order_count: 156
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce, parmesan cheese, croutons, and caesar dressing',
      category: 'appetizers',
      price: 85000,
      image: '/images/menu/caesar.jpg',
      status: 'active',
      is_available_at_branch: false,
      branch_price: null,
      dietary_info: ['vegetarian'],
      prep_time: '5-10 min',
      rating: 4.2,
      order_count: 89
    },
    {
      id: '3',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables',
      category: 'mains',
      price: 350000,
      image: '/images/menu/salmon.jpg',
      status: 'active',
      is_available_at_branch: true,
      branch_price: 375000,
      dietary_info: ['gluten-free'],
      prep_time: '20-25 min',
      rating: 4.7,
      order_count: 98
    },
    {
      id: '4',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone',
      category: 'desserts',
      price: 75000,
      image: '/images/menu/tiramisu.jpg',
      status: 'active',
      is_available_at_branch: true,
      branch_price: 75000,
      dietary_info: ['vegetarian'],
      prep_time: 'No prep time',
      rating: 4.8,
      order_count: 124
    },
    {
      id: '5',
      name: 'Craft Beer Selection',
      description: 'Local and imported craft beers',
      category: 'beverages',
      price: 45000,
      image: '/images/menu/beer.jpg',
      status: 'active',
      is_available_at_branch: true,
      branch_price: 45000,
      dietary_info: [],
      prep_time: 'Immediate',
      rating: 4.3,
      order_count: 203
    }
  ];

  const filteredItems = mockMenuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesCategory;
  });

  const handleToggleAvailability = (itemId: string) => {
    // Toggle item availability
    console.log(`Toggle availability for item ${itemId}`);
  };

  const handlePriceChange = (itemId: string, newPrice: number) => {
    // Update branch-specific price
    console.log(`Update price for item ${itemId} to ${newPrice}`);
  };

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Management</CardTitle>
              <p className="text-gray-600 mt-1">
                Manage menu items, pricing, and availability for this branch
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
              >
                <Sync className="h-4 w-4 mr-2" />
                Sync Menu
              </Button>
              <Button
                style={{backgroundColor: '#9B1D20'}}
                className="text-white hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Item
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{color: '#9B1D20'}}>
                {menuStats.total_items}
              </div>
              <p className="text-sm text-gray-600">Total Menu Items</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {menuStats.active_items}
              </div>
              <p className="text-sm text-gray-600">Active at Branch</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {menuStats.total_items - menuStats.active_items}
              </div>
              <p className="text-sm text-gray-600">Unavailable</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.floor((menuStats.active_items / menuStats.total_items) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Coverage Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name} ({category.count})
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center space-x-4 ml-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Item Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Switch
                        checked={item.is_available_at_branch}
                        onCheckedChange={() => handleToggleAvailability(item.id)}
                      />
                    </div>
                  </div>

                  {/* Item Image */}
                  {item.image && (
                    <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Item Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Brand Price:</span>
                      <span className="font-medium">
                        ₱{item.price.toLocaleString()}
                      </span>
                    </div>

                    {item.is_available_at_branch && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Branch Price:</span>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={item.branch_price || ''}
                            onChange={(e) => handlePriceChange(item.id, parseInt(e.target.value) || 0)}
                            className="w-24 h-8 text-sm"
                            placeholder="Price"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category:</span>
                      <Badge variant="outline" className="text-xs">
                        {categories.find(c => c.id === item.category)?.name}
                      </Badge>
                    </div>

                    {item.prep_time && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{item.prep_time}</span>
                      </div>
                    )}

                    {item.rating && (
                      <div className="flex items-center space-x-2">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{item.rating} ({item.order_count} orders)</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {item.is_available_at_branch && (
                      <Badge
                        style={{backgroundColor: '#9B1D20'}}
                        className="text-white"
                      >
                        Available
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
              <p className="text-gray-500">
                No items in this category.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}