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

export default function BrandManagementPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

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

  // Mock data for brands
  const brands = [
    {
      id: '1',
      name: 'Miwaku Premium',
      description: 'Premium Japanese dining experience',
      logo: '/images/brands/miwaku-premium.png',
      branches: 3,
      menuItems: 89,
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
      lastUpdated: '5 days ago',
      color: '#2F4F4F'
    }
  ];

  const filteredBrands = brands;

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
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleBrandMenu(brand.id)} title="View Brand Menu">
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