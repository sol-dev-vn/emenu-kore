'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Users,
  Settings,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';
import { BrandGroup } from './BrandGroup';

interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  branches_count: number;
  branches: Branch[];
}

interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  status: 'active' | 'inactive' | 'maintenance';
  tables_count: number;
  opening_hours?: string;
  manager?: {
    name: string;
    email: string;
  };
  created_at: string;
}

interface BrandGroupedListProps {
  searchTerm?: string;
}

export function BrandGroupedList({ searchTerm = '' }: BrandGroupedListProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  useEffect(() => {
    const mockBrands: Brand[] = [
      {
        id: '1',
        name: 'SOL Pizza',
        description: 'Authentic Italian pizza restaurant chain',
        logo: '/images/brands/sol-pizza.png',
        branches_count: 12,
        branches: [
          {
            id: '1-1',
            name: 'SOL Pizza - District 1',
            address: '123 Nguyễn Huệ Street, District 1, Ho Chi Minh City',
            phone: '+84 28 3821 1234',
            status: 'active',
            tables_count: 24,
            opening_hours: '10:00 - 22:00',
            manager: {
              name: 'John Smith',
              email: 'john.smith@solpizza.com'
            },
            created_at: '2023-01-15'
          },
          {
            id: '1-2',
            name: 'SOL Pizza - District 3',
            address: '456 Võ Văn Tần Street, District 3, Ho Chi Minh City',
            phone: '+84 28 3930 5678',
            status: 'active',
            tables_count: 18,
            opening_hours: '11:00 - 23:00',
            manager: {
              name: 'Sarah Johnson',
              email: 'sarah.j@solpizza.com'
            },
            created_at: '2023-03-20'
          },
          {
            id: '1-3',
            name: 'SOL Pizza - Thao Dien',
            address: '789 Nguyễn Văn Hưởng Street, District 2, Ho Chi Minh City',
            phone: '+84 28 3744 9012',
            status: 'maintenance',
            tables_count: 32,
            opening_hours: '10:00 - 22:00',
            manager: {
              name: 'Mike Chen',
              email: 'mike.chen@solpizza.com'
            },
            created_at: '2023-06-10'
          }
        ]
      },
      {
        id: '2',
        name: 'SOL Burger',
        description: 'Gourmet burger restaurant with premium ingredients',
        logo: '/images/brands/sol-burger.png',
        branches_count: 8,
        branches: [
          {
            id: '2-1',
            name: 'SOL Burger - Vincom Center',
            address: '72 Lê Thánh Tôn Street, District 1, Ho Chi Minh City',
            phone: '+84 28 3821 3456',
            status: 'active',
            tables_count: 16,
            opening_hours: '10:30 - 22:30',
            manager: {
              name: 'Emily Davis',
              email: 'emily.d@solburger.com'
            },
            created_at: '2023-02-28'
          },
          {
            id: '2-2',
            name: 'SOL Burger - Takashimaya',
            address: '92 Cộng Hòa Street, Tân Bình District, Ho Chi Minh City',
            phone: '+84 28 3812 7890',
            status: 'active',
            tables_count: 20,
            opening_hours: '10:00 - 22:00',
            manager: {
              name: 'David Wilson',
              email: 'david.w@solburger.com'
            },
            created_at: '2023-04-15'
          }
        ]
      },
      {
        id: '3',
        name: 'SOL Cafe',
        description: 'Cozy coffee shop with light meals and desserts',
        logo: '/images/brands/sol-cafe.png',
        branches_count: 6,
        branches: [
          {
            id: '3-1',
            name: 'SOL Cafe - Dong Khoi',
            address: '201 Đồng Khởi Street, District 1, Ho Chi Minh City',
            phone: '+84 28 3821 2345',
            status: 'active',
            tables_count: 12,
            opening_hours: '07:00 - 22:00',
            manager: {
              name: 'Lisa Anderson',
              email: 'lisa.a@solcafe.com'
            },
            created_at: '2023-05-01'
          },
          {
            id: '3-2',
            name: 'SOL Cafe - Thao Dien',
            address: '101 Nguyễn Văn Hưởng Street, District 2, Ho Chi Minh City',
            phone: '+84 28 3744 5678',
            status: 'inactive',
            tables_count: 8,
            opening_hours: '07:00 - 20:00',
            manager: {
              name: 'Tom Brown',
              email: 'tom.b@solcafe.com'
            },
            created_at: '2023-07-20'
          }
        ]
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setBrands(mockBrands);
      setFilteredBrands(mockBrands);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter brands and branches based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBrands(brands);
      return;
    }

    const filtered = brands.map(brand => ({
      ...brand,
      branches: brand.branches.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(brand => brand.branches.length > 0);

    setFilteredBrands(filtered);
  }, [searchTerm, brands]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="border rounded-lg p-4">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Branches</h3>
            <p className="text-red-600">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredBrands.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-12">
          <div className="text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
            <p className="text-gray-500">
              {searchTerm ? `No branches match "${searchTerm}"` : 'No branches are available at the moment.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {filteredBrands.map((brand) => (
        <BrandGroup
          key={brand.id}
          brand={brand}
        />
      ))}
    </div>
  );
}