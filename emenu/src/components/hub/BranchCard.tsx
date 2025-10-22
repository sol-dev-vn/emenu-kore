'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  code: string;
  tables_count: number;
  active_tables?: number;
}

interface BranchCardProps {
  branch: Branch;
  brandName: string;
}

export function BranchCard({ branch, brandName }: BranchCardProps) {
  const activeTables = branch.active_tables || Math.floor(branch.tables_count * 0.8); // Default to 80% if not provided

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        {/* Branch Name and Code */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {branch.name}
          </h3>
          <p className="text-sm text-gray-500">{brandName}</p>
          <p className="text-xs text-gray-400 font-mono">{branch.code}</p>
        </div>

        {/* Tables Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">
              {branch.tables_count} total
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-600">
              {activeTables} active
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}