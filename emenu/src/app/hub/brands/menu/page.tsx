'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Edit,
  Eye,
} from 'lucide-react';

export default function BrandMenuPage() {
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

  // Mock data for brand menus
  const brandMenus = [
    {
      id: '1',
      brandId: '1',
      brandName: 'Miwaku Premium',
      name: 'Miwaku Premium Brand Menu',
      items: 89,
      categories: 7,
      lastUpdated: '2 hours ago',
      currency: 'VND',
      taxRate: 10,
      serviceRate: 5
    },
    {
      id: '2',
      brandId: '2',
      brandName: 'S79 Japanese Teppanyaki',
      name: 'S79 Teppanyaki Brand Menu',
      items: 76,
      categories: 6,
      lastUpdated: '1 day ago',
      currency: 'VND',
      taxRate: 10,
      serviceRate: 5
    },
    {
      id: '3',
      brandId: '3',
      brandName: 'Kohaku Sashimi & Yakiniku',
      name: 'Kohaku Sashimi & Yakiniku Brand Menu',
      items: 112,
      categories: 8,
      lastUpdated: '3 hours ago',
      currency: 'VND',
      taxRate: 10,
      serviceRate: 5
    },
    {
      id: '4',
      brandId: '4',
      brandName: 'Kohaku Sushi',
      name: 'Kohaku Sushi Brand Menu',
      items: 95,
      categories: 6,
      lastUpdated: '1 week ago',
      currency: 'VND',
      taxRate: 10,
      serviceRate: 5
    },
    {
      id: '5',
      brandId: '5',
      brandName: 'Kohaku Udon & Ramen',
      name: 'Kohaku Udon & Ramen Brand Menu',
      items: 68,
      categories: 5,
      lastUpdated: '2 days ago',
      currency: 'VND',
      taxRate: 10,
      serviceRate: 5
    },
    {
      id: '6',
      brandId: '6',
      brandName: 'Date Nariya',
      name: 'Date Nariya Brand Menu',
      items: 54,
      categories: 4,
      lastUpdated: '4 days ago',
      currency: 'VND',
      taxRate: 10,
      serviceRate: 5
    },
    {
      id: '7',
      brandId: '7',
      brandName: 'Machida Shoten',
      name: 'Machida Shoten Brand Menu',
      items: 42,
      categories: 4,
      lastUpdated: '5 days ago',
      currency: 'VND',
      taxRate: 10,
      serviceRate: 5
    }
  ];

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Brands', href: '/hub/brands'},
          {label: 'Brand Menu', active: true}
        ]} />
      }
      title="Brand Menus"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Brand Menus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brandMenus.map((menu) => (
            <Card key={menu.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base" style={{color: '#9B1D20'}}>{menu.brandName}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{menu.name}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Menu Items</p>
                      <p className="font-medium text-gray-900">{menu.items}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Categories</p>
                      <p className="font-medium text-gray-900">{menu.categories}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Currency</p>
                      <p className="font-medium text-gray-900">{menu.currency}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tax Rate</p>
                      <p className="font-medium text-gray-900">{menu.taxRate}%</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-1">
                    <p>Last updated: {menu.lastUpdated}</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" title="View Items">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" title="Edit Menu">
                      <Edit className="h-4 w-4" />
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