'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';

interface MenuItem {
  id: number;
  name: string;
  code: string;
  description?: string;
  price?: number;
  category_name?: string;
  category_code?: string;
  unit_name?: string;
  is_active: boolean;
  is_available: boolean;
  image_url?: string;
  track_inventory: boolean;
  allergen_info?: Record<string, unknown>;
  dietary_restrictions?: string[];
  preparation_time?: number;
  spice_level?: number;
  external_id?: string;
  sync_status: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
}

interface CategoryGroup {
  name: string;
  categories: Category[];
  items: MenuItem[];
  itemCount: number;
  activeCount: number;
}

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [view, setView] = useState<'list' | 'groups'>('groups');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleGroupExpansion = (groupName: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const loadMenuItems = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (categoryFilter) params.append('category', categoryFilter);
      if (searchQuery) params.append('search', searchQuery);
      if (activeFilter) params.append('active', activeFilter);

      const res = await fetch(`/api/menu-items?${params}`);
      const json = await res.json();
      if (json.success) {
        setMenuItems(json.data || []);
      } else {
        setError(json.error || 'Failed to load menu items');
      }
    } catch (e) {
      setError('Failed to load menu items');
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const json = await res.json();
      if (json.success) {
        setCategories(json.data || []);
      }
    } catch (e) {
      console.error('Failed to load categories:', e);
    }
  };

  // Group categories into logical sections
  const groupCategories = (cats: Category[], items: MenuItem[]) => {
    const groups: CategoryGroup[] = [
      {
        name: 'Combos',
        categories: cats.filter(c =>
          c.name.toLowerCase().includes('combo') ||
          c.code.toLowerCase().includes('combo') ||
          c.name.toLowerCase().includes('course') ||
          c.code.toLowerCase().includes('course')
        ),
        items: [],
        itemCount: 0,
        activeCount: 0
      },
      {
        name: 'Sushi & Sashimi',
        categories: cats.filter(c =>
          c.name.toLowerCase().includes('sushi') ||
          c.code.toLowerCase().includes('sushi') ||
          c.name.toLowerCase().includes('sashimi') ||
          c.code.toLowerCase().includes('sashimi')
        ),
        items: [],
        itemCount: 0,
        activeCount: 0
      },
      {
        name: 'Ramen & Noodles',
        categories: cats.filter(c =>
          c.name.toLowerCase().includes('ramen') ||
          c.code.toLowerCase().includes('ramen') ||
          c.name.toLowerCase().includes('udon') ||
          c.code.toLowerCase().includes('udon')
        ),
        items: [],
        itemCount: 0,
        activeCount: 0
      },
      {
        name: 'Drinks - Alcoholic',
        categories: cats.filter(c =>
          c.name.toLowerCase().includes('rượu') ||
          c.code.toLowerCase().includes('324') ||
          c.name.toLowerCase().includes('wine') ||
          c.name.toLowerCase().includes('beer') ||
          c.name.toLowerCase().includes('whisky') ||
          c.name.toLowerCase().includes('sake') ||
          c.name.toLowerCase().includes('cocktail')
        ),
        items: [],
        itemCount: 0,
        activeCount: 0
      },
      {
        name: 'Drinks - Non-Alcoholic',
        categories: cats.filter(c =>
          c.name.toLowerCase().includes('nước') ||
          c.name.toLowerCase().includes('trà') ||
          c.name.toLowerCase().includes('cafe') ||
          c.name.toLowerCase().includes('juice') ||
          c.name.toLowerCase().includes('soft') ||
          c.code.toLowerCase().includes('322') ||
          c.code.toLowerCase().includes('323')
        ),
        items: [],
        itemCount: 0,
        activeCount: 0
      },
      {
        name: 'Main Courses',
        categories: cats.filter(c =>
          c.name.toLowerCase().includes('thịt') ||
          c.name.toLowerCase().includes('gà') ||
          c.name.toLowerCase().includes('bò') ||
          c.name.toLowerCase().includes('heo') ||
          c.name.toLowerCase().includes('cá') ||
          c.name.toLowerCase().includes('tôm') ||
          c.name.toLowerCase().includes('mực') ||
          c.name.toLowerCase().includes('hải sản')
        ),
        items: [],
        itemCount: 0,
        activeCount: 0
      },
      {
        name: 'Appetizers & Sides',
        categories: cats.filter(c =>
          c.name.toLowerCase().includes('salad') ||
          c.name.toLowerCase().includes('soup') ||
          c.name.toLowerCase().includes('tempura') ||
          c.name.toLowerCase().includes('topping')
        ),
        items: [],
        itemCount: 0,
        activeCount: 0
      },
      {
        name: 'Desserts',
        categories: cats.filter(c =>
          c.name.toLowerCase().includes('kem') ||
          c.name.toLowerCase().includes('ice cream') ||
          c.name.toLowerCase().includes('dessert')
        ),
        items: [],
        itemCount: 0,
        activeCount: 0
      }
    ];

    // Create Other Categories group
    const processedCategories = new Set();
    groups.forEach(group => {
      group.categories.forEach(c => processedCategories.add(c.id));
    });

    const otherCategoriesGroup: CategoryGroup = {
      name: 'Other Categories',
      categories: cats.filter(c => !processedCategories.has(c.id)),
      items: [],
      itemCount: 0,
      activeCount: 0
    };

    // Add other categories group if it has items
    if (otherCategoriesGroup.categories.length > 0) {
      groups.push(otherCategoriesGroup);
    }

    // Assign items to groups and calculate counts
    groups.forEach(group => {
      const categoryIds = group.categories.map(c => c.name);
      const groupItems = items.filter(item =>
        categoryIds.includes(item.category_name || '') ||
        group.categories.some(c => c.code === item.category_code)
      );
      group.items = groupItems;
      group.itemCount = groupItems.length;
      group.activeCount = groupItems.filter(item => item.is_active).length;
    });

    return groups.filter(group => group.itemCount > 0);
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      await Promise.all([loadMenuItems(), loadCategories()]);
      setLoading(false);
    }
    loadData();
  }, [page, categoryFilter, searchQuery, activeFilter]);

  useEffect(() => {
    const groups = groupCategories(categories, menuItems);
    setCategoryGroups(groups);
  }, [categories, menuItems]);

  const formatPrice = (price?: number) => {
    return price !== undefined && price !== null ? `$${price.toFixed(2)}` : 'N/A';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-gray-600 mt-2">Manage restaurant menu items with combo and drink grouping</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'groups' ? 'default' : 'outline'}
            onClick={() => setView('groups')}
          >
            Grouped View
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
          >
            List View
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
          >
            Add Menu Item
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu items..."
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {view === 'groups' ? (
        /* Grouped View */
        <div className="space-y-6">
          {categoryGroups.map((group) => (
            <Card key={group.name}>
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleGroupExpansion(group.name)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {group.name}
                      <Badge variant="secondary">{group.itemCount} items</Badge>
                      <Badge variant="outline">{group.activeCount} active</Badge>
                    </CardTitle>
                    <div className="text-sm text-gray-600 mt-1">
                      {group.categories.map(c => c.name).join(', ')}
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {expandedGroups.includes(group.name) ? '▼' : '▶'}
                  </div>
                </div>
              </CardHeader>
              {expandedGroups.includes(group.name) && (
                <CardContent>
                  <div className="space-y-4">
                    {group.items.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No items in this group
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {group.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 text-xs">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">{item.name}</div>
                                <div className="text-gray-500 truncate">
                                  {item.code} • {item.category_name}
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-1 flex-shrink-0 ml-3">
                              <div className="font-semibold text-sm">
                                {formatPrice(item.price)}
                              </div>
                              <div className="flex gap-1 justify-end flex-wrap">
                                <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full ${
                                  item.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.is_active ? 'Active' : 'Inactive'}
                                </span>
                                {!item.is_available && (
                                  <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full bg-gray-100 text-gray-800">
                                    Out of Stock
                                  </span>
                                )}
                                <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full ${getStatusColor(item.sync_status)}`}>
                                  {item.sync_status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardHeader>
            <CardTitle>Menu Items ({menuItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {menuItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No menu items found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sync
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 text-xs">
                        <td className="px-3 py-2">
                          <div className="flex items-center">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-8 h-8 rounded object-cover mr-2"
                              />
                            )}
                            <div className="truncate max-w-xs">
                              <div className="font-medium text-gray-900 truncate">
                                {item.name}
                              </div>
                              {item.spice_level && (
                                <div className="flex items-center mt-1">
                                  <span className="text-xs">Spice: </span>
                                  <div className="flex ml-1">
                                    {[...Array(5)].map((_, i) => (
                                      <div
                                        key={i}
                                        className={`w-1.5 h-1.5 rounded-full mx-px ${
                                          i < item.spice_level ? 'bg-red-500' : 'bg-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-gray-500 font-mono text-xs">
                          {item.code}
                        </td>
                        <td className="px-3 py-2 text-gray-900 truncate">
                          {item.category_name || 'N/A'}
                        </td>
                        <td className="px-3 py-2 font-semibold text-gray-900">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1 flex-wrap">
                            <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full ${
                              item.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.is_active ? 'Active' : 'Inactive'}
                            </span>
                            {!item.is_available && (
                              <span className="px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full bg-gray-100 text-gray-800">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full ${getStatusColor(item.sync_status)}`}>
                            {item.sync_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}