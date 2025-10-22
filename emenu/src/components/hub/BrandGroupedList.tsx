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
  code: string;
  tables_count: number;
  active_tables?: number;
}

export function BrandGroupedList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development - Updated with real brand names from Directus
  useEffect(() => {
    const mockBrands: Brand[] = [
      {
        id: '1',
        name: 'Miwaku Premium',
        description: 'Premium Japanese dining experience',
        logo: '/images/brands/miwaku-premium.png',
        branches_count: 3,
        branches: [
          {
            id: '1-1',
            name: 'Miwaku Premium Landmark 81',
            code: 'MIWAKU_LANDMARK',
            tables_count: 28,
            active_tables: 24
          }
        ]
      },
      {
        id: '2',
        name: 'S79 Japanese Teppanyaki',
        description: 'Authentic Japanese teppanyaki restaurant',
        logo: '/images/brands/s79-teppanyaki.png',
        branches_count: 2,
        branches: [
          {
            id: '2-1',
            name: 'S79 Teppanyaki District 1',
            code: 'S79_D1',
            tables_count: 16,
            active_tables: 14
          },
          {
            id: '2-2',
            name: 'S79 Teppanyaki District 7',
            code: 'S79_D7',
            tables_count: 20,
            active_tables: 18
          }
        ]
      },
      {
        id: '3',
        name: 'Kohaku Sashimi & Yakiniku',
        description: 'Japanese sashimi and BBQ restaurant',
        logo: '/images/brands/kohaku-sashimi.png',
        branches_count: 2,
        branches: [
          {
            id: '3-1',
            name: 'Kohaku Sashimi District 1',
            code: 'KOHAKU_SASHIMI_D1',
            tables_count: 22,
            active_tables: 20
          },
          {
            id: '3-2',
            name: 'Kohaku Sashimi Thao Dien',
            code: 'KOHAKU_SASHIMI_TD',
            tables_count: 18,
            active_tables: 16
          }
        ]
      },
      {
        id: '4',
        name: 'Kohaku Sushi',
        description: 'Traditional Japanese sushi restaurant',
        logo: '/images/brands/kohaku-sushi.png',
        branches_count: 2,
        branches: [
          {
            id: '4-1',
            name: 'Kohaku Sushi District 1',
            code: 'KOHAKU_SUSHI_D1',
            tables_count: 14,
            active_tables: 12
          },
          {
            id: '4-2',
            name: 'Kohaku Sushi Phu My Hung',
            code: 'KOHAKU_SUSHI_PMH',
            tables_count: 18,
            active_tables: 15
          }
        ]
      },
      {
        id: '5',
        name: 'Kohaku Udon & Ramen',
        description: 'Japanese noodle house',
        logo: '/images/brands/kohaku-udon.png',
        branches_count: 2,
        branches: [
          {
            id: '5-1',
            name: 'Kohaku Udon District 1',
            code: 'KOHAKU_UDON_D1',
            tables_count: 24,
            active_tables: 20
          },
          {
            id: '5-2',
            name: 'Kohaku Udon District 3',
            code: 'KOHAKU_UDON_D3',
            tables_count: 16,
            active_tables: 14
          }
        ]
      },
      {
        id: '6',
        name: 'Date Nariya',
        description: 'Japanese specialty restaurant',
        logo: '/images/brands/date-nariya.png',
        branches_count: 1,
        branches: [
          {
            id: '6-1',
            name: 'Date Nariya District 1',
            code: 'DATE_NARIYA_D1',
            tables_count: 12,
            active_tables: 10
          }
        ]
      },
      {
        id: '7',
        name: 'Machida Shoten',
        description: 'Japanese dining establishment',
        logo: '/images/brands/machida-shoten.png',
        branches_count: 1,
        branches: [
          {
            id: '7-1',
            name: 'Machida Shoten District 1',
            code: 'MACHIDA_D1',
            tables_count: 8,
            active_tables: 6
          }
        ]
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setBrands(mockBrands);
      setIsLoading(false);
    }, 800);
  }, []);

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

  return (
    <div className="space-y-8">
      {brands.map((brand) => (
        <BrandGroup
          key={brand.id}
          brand={brand}
        />
      ))}
    </div>
  );
}