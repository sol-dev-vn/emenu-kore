'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Plus, Search, Filter, Edit, Image as ImageIcon } from 'lucide-react';
import { useBrandMenus } from '@/hooks/use-brand-menus';
import { useMenuItems } from '@/hooks/use-menu-items';
import { CategoryList } from '@/components/hub/CategoryList';
import { SearchBar } from '@/components/hub/SearchBar';

export default function BrandMenuPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Brand ID from URL query parameter (no state management needed)
  const searchParams = useSearchParams();
  const brandParam = searchParams.get('brand');
  const selectedBrandId = brandParam;

  const {
    brandMenus,
    brands,
    loading: menusLoading,
    error: menusError,
    refetch: refetchBrandMenus
  } = useBrandMenus();

  // Get menu items for the selected brand
  const {
    menuItems,
    categories,
    loading: itemsLoading,
    error: itemsError,
    refetch: refetchItems,
    searchItems,
    getItemsByCategory
  } = useMenuItems(selectedBrandId);

  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Find the selected brand
  const selectedBrand = brandMenus.find(menu => menu.brand === selectedBrandId);

  const selectedBrandName = selectedBrand?.brandName || 'Unknown Brand';

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Brands', href: '/hub/brands'},
          {label: 'Brand Menu', active: !!selectedBrandId}
        ]} />
      }
      title={selectedBrandId ? `${selectedBrandName} Menu` : 'Brand Menus'}
      subtitle={selectedBrandId ? `View and manage menu items for ${selectedBrandName}` : 'Select a brand to view its menu items'}
      style={{color: '#9B1D20'}}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Brand info and controls */}
        <div className="mb-6">
          {selectedBrandId ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedBrandName} Menu</h2>
                  <div className="text-sm text-gray-700 mt-1">
                    Managing menu items for <strong>{selectedBrandName}</strong>
                    {selectedBrand?.tax_rate && (
                      <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                        Tax: {selectedBrand.tax_rate}%
                      </span>
                    )}
                    {selectedBrand?.service_rate && (
                      <span className="ml-1 text-xs bg-gray-100 px-2 py-1 rounded">
                        Service: {selectedBrand.service_rate}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/hub/brands')}
                    className="text-gray-500"
                  >
                    Back to Brands
                  </Button>
                  <Button
                    onClick={() => router.push(`/hub/brands/menu/items/new?brand=${selectedBrandId}`)}
                    style={{backgroundColor: '#9B1D20'}}
                    className="text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No brand selected. Please go to <a href="/hub/brands" className="text-blue-600 underline">Brands</a> and select a brand to view its menu.</p>
            </div>
          )}
        </div>

        {/* Main Content with Sidebar */}
        {selectedBrandId && (
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="space-y-4">
                {/* Search Bar */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Search</h3>
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search menu items..."
                  />
                </div>

                {/* Categories */}
                <CategoryList
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                  loading={itemsLoading}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Loading State */}
              {itemsLoading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#9B1D20'}}></div>
                  <p className="text-gray-600 mt-2">Loading menu items...</p>
                </div>
              )}

              {/* Error State */}
              {itemsError && (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">Error loading menu items</p>
                  <p className="text-gray-600">{itemsError}</p>
                  <Button onClick={refetchItems} className="mt-4">
                    Retry
                  </Button>
                </div>
              )}

              {/* Menu Items Grid */}
              {!itemsLoading && !itemsError && (
                <div>
                  {/* Results summary */}
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {searchItems(searchQuery).filter(item => selectedCategory ? item.category_id === selectedCategory : true).length} items
                    {selectedCategory && ` in category "${categories.find(c => c.id === selectedCategory)?.name}"`}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {searchItems(searchQuery)
                      .filter(item => selectedCategory ? item.category_id === selectedCategory : true)
                      .map((item) => (
                        <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200 group">
                          <CardHeader className="pb-2">
                            {/* Item Image */}
                            <div className="aspect-square bg-gray-100 rounded-md mb-3 overflow-hidden">
                              {item.image_url || item.thumbnail ? (
                                <img
                                  src={item.image_url || item.thumbnail}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`w-full h-full flex items-center justify-center text-gray-400 ${item.image_url ? 'hidden' : ''}`}>
                                <ImageIcon className="w-8 h-8" />
                              </div>
                            </div>

                            <div className="flex items-start justify-between">
                              <CardTitle className="text-base font-semibold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2">
                                {item.name}
                              </CardTitle>
                              <div className="flex gap-1 mt-1">
                                {item.is_available ? (
                                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Available"></div>
                                ) : (
                                  <div className="w-2 h-2 bg-red-500 rounded-full" title="Unavailable"></div>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              {/* Description */}
                              {item.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {item.description}
                                </p>
                              )}

                              {/* Price and Code */}
                              <div className="flex items-center justify-between">
                                <div className="text-lg font-bold" style={{color: '#9B1D20'}}>
                                  {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: selectedBrand?.default_currency || 'VND'
                                  }).format(item.price || 0)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.code}
                                </div>
                              </div>

                              {/* Category and availability */}
                              <div className="flex items-center justify-between text-sm">
                                <div className="text-gray-600">
                                  {item.category_name || 'Uncategorized'}
                                </div>
                                <div className={`font-medium ${item.is_available ? 'text-green-600' : 'text-red-600'}`}>
                                  {item.is_available ? 'Available' : 'Unavailable'}
                                </div>
                              </div>

                              {/* Dietary/Spice indicators */}
                              {(item.dietaryInfo?.length > 0 || item.spice_level) && (
                                <div className="flex items-center gap-2 text-xs">
                                  {item.dietaryInfo?.includes('vegetarian') && (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Veg</span>
                                  )}
                                  {item.dietaryInfo?.includes('gluten-free') && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">GF</span>
                                  )}
                                  {item.spice_level && item.spice_level > 0 && (
                                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                      🌶️ {item.spice_level}/3
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Action buttons */}
                              <div className="flex items-center justify-between pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  title="View Details"
                                  onClick={() => router.push(`/hub/brands/menu/items/${item.id}`)}
                                  className="text-gray-600 hover:text-red-600 border-gray-300 hover:border-red-300"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  title="Edit Item"
                                  onClick={() => router.push(`/hub/brands/menu/items/${item.id}/edit`)}
                                  className="text-gray-600 hover:text-red-600 border-gray-300 hover:border-red-300"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* No items found */}
              {!itemsLoading && !itemsError && searchItems(searchQuery).filter(item => selectedCategory ? item.category_id === selectedCategory : true).length === 0 && (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
                  <p className="text-gray-600 mb-4">
                    {selectedCategory && 'No items in this category. '}
                    {searchQuery && `No items matching "${searchQuery}". `}
                    Try adjusting your filters or add a new menu item.
                  </p>
                  <Button
                    onClick={() => router.push(`/hub/brands/menu/items/new?brand=${selectedBrandId}`)}
                    style={{backgroundColor: '#9B1D20'}}
                    className="text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Menu Item
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No brand selected */}
        {!selectedBrandId && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Please select a brand to view its menu</p>
          </div>
        )}
      </div>
    </HubLayout>
  );
}