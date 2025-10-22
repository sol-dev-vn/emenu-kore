'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BranchCard } from './BranchCard';
import { Users, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

interface BrandGroupProps {
  brand: Brand;
}

export function BrandGroup({ brand }: BrandGroupProps) {
  const totalTables = brand.branches.reduce((sum, branch) => sum + branch.tables_count, 0);
  const totalActiveTables = brand.branches.reduce((sum, branch) => sum + (branch.active_tables || Math.floor(branch.tables_count * 0.8)), 0);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Brand Logo */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <Store className="h-6 w-6 text-gray-500" />
              )}
            </div>

            {/* Brand Info */}
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {brand.name}
                <Badge variant="secondary" className="text-xs">
                  {brand.branches_count} locations
                </Badge>
              </CardTitle>
              {brand.description && (
                <p className="text-gray-600 text-sm mt-1">{brand.description}</p>
              )}
            </div>
          </div>

          {/* Brand Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-2xl font-bold text-gray-900">{totalActiveTables}</span>
              </div>
              <p className="text-sm text-gray-500">Active Tables</p>
            </div>

            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-2xl font-bold text-gray-900">{totalTables}</span>
              </div>
              <p className="text-sm text-gray-500">Total Tables</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brand.branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              brandName={brand.name}
            />
          ))}
        </div>

        {brand.branches.length === 0 && (
          <div className="text-center py-8">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
            <p className="text-gray-500">This brand doesn't have any branches yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}