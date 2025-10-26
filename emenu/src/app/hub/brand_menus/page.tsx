'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Plus, Search, Filter, Edit } from 'lucide-react';
import { useDirectusBrandMenus, useDirectusMenuItems } from '@/hooks/use-directus-data';

export default function BrandMenusPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const {
    brands,
    loading: brandsLoading,
    error: brandsError,
    refetch: refetchBrands
  } = useDirectusBrandMenus();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#9B1D20'}}></div>
      </div>
    );
  }

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Brands', href: '/hub/brands'},
          {label: 'Brand Menus', active: true}
        ]} />
      }
      title="Brand Menus"
      subtitle="Select a brand to view its menu items"
      style={{color: '#9B1D20'}}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Card key={brand.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/hub/brands/menu?brand=${brand.id}`)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Brand Logo */}
                    <div
                      className="flex items-center justify-center w-12 h-12 rounded-full"
                      style={{ backgroundColor: `${brand.brand_color || '#9B1D20'}20` }}
                    >
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="text-white font-bold text-lg">
                          {brand.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    {/* Brand Info */}
                    <div>
                      <CardTitle className="text-lg" style={{color: '#9B1D20'}}>
                        {brand.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{brand.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Locations</p>
                      <p className="font-medium">{brand.branch_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Menu Items</p>
                      <p className="font-medium">{brand.menu_items_count || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      title="View Brand Menu"
                    >
                      View Menu
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      title="View Brand Branches"
                      onClick={() => router.push(`/hub/branches?brand=${brand.id}`)}
                    >
                      View Locations
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