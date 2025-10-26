'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building,
  Eye,
  Utensils,
  MapPin,
  Camera,
  Upload
} from 'lucide-react';
import { useDirectusBrands, useDirectusBrandMenus } from '@/hooks/use-directus-data';

export default function BrandManagementPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Use Directus hooks to get real data
  const {
    brands,
    loading: brandsLoading,
    error: brandsError
  } = useDirectusBrands();

  const {
    brandMenus,
    loading: menusLoading,
    error: menusError
  } = useDirectusBrandMenus();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || brandsLoading || menusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#9B1D20'}}></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);

  const handleLogoUpload = async (brandId: string) => {
    // TODO: Implement logo upload via Directus API
    console.log(`Upload logo for brand ${brandId}`);
  };

  const handleBrandMenu = (brandId: string) => {
    router.push(`/hub/brands/menu?brand=${brandId}`);
  };

  const handleBrandBranches = (brandId: string) => {
    router.push(`/hub/branches?brand=${brandId}`);
  };

  // Error state
  if (brandsError || menusError) {
    return (
      <HubLayout
        breadcrumb={
          <Breadcrumb items={[
            {label: 'Overview', href: '/hub'},
            {label: 'Brand Management', active: true}
          ]} />
        }
        title="Brand Management"
        subtitle="Error loading brand data"
        style={{color: '#9B1D20'}}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading brand data</p>
            <p className="text-gray-600">{brandsError || menusError}</p>
          </div>
        </div>
      </HubLayout>
    );
  }

  // Transform brand menus for display with real brand data
  const displayBrands = brandMenus.map(menu => {
    const brand = brands.find(b => b.id === menu.brand);
    return {
      id: menu.brand,
      name: brand?.name || menu.brandName || 'Unknown Brand',
      description: brand?.description || `${menu.name} management`,
      logo: brand?.logo || null,
      branches: 1, // TODO: Get actual branch count from branches collection
      menuItems: menu.items || 0,
      lastUpdated: menu.lastUpdated || 'Unknown',
      color: brand?.brand_color || '#9B1D20',
      brandMenuId: menu.id // Store the brand menu ID for navigation
    };
  });

  const filteredBrands = displayBrands;

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
      style={{color: '#9B1D20'}}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Brand Logo */}
                    <div
                      className="relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer group"
                      style={{ backgroundColor: `${brand.color}20` }}
                      onMouseEnter={() => setHoveredBrand(brand.id)}
                      onMouseLeave={() => setHoveredBrand(null)}
                      onClick={() => handleLogoUpload(brand.id)}
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

                      {/* Upload overlay on hover */}
                      {hoveredBrand === brand.id && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full group-hover:bg-opacity-70 transition-all duration-200">
                          <Upload className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Brand Info */}
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2" style={{color: '#9B1D20'}}>
                        {brand.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{brand.description}</p>
                    </div>
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
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleBrandMenu(brand.brandMenuId)} title="View Brand Menu">
                      <Utensils className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleBrandBranches(brand.id)} title="View Brand Branches">
                      <MapPin className="h-4 w-4" />
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