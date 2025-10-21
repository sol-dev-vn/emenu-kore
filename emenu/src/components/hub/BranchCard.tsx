'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Phone,
  Clock,
  Users,
  Settings,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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

interface BranchCardProps {
  branch: Branch;
  brandName: string;
}

export function BranchCard({ branch, brandName }: BranchCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢';
      case 'inactive':
        return '⚫';
      case 'maintenance':
        return '🟡';
      default:
        return '⚫';
    }
  };

  const handleViewDetails = () => {
    router.push(`/hub/branches/${branch.id}`);
  };

  const handleEdit = () => {
    router.push(`/hub/branches/${branch.id}/edit`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {branch.name}
            </h3>
            <p className="text-sm text-gray-500">{brandName}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              className={`text-xs ${getStatusColor(branch.status)}`}
              variant="secondary"
            >
              <span className="mr-1">{getStatusIcon(branch.status)}</span>
              {branch.status}
            </Badge>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-2">
            {branch.address}
          </p>
        </div>

        {/* Contact Info */}
        {branch.phone && (
          <div className="flex items-center space-x-2 mb-3">
            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-600">{branch.phone}</p>
          </div>
        )}

        {/* Opening Hours */}
        {branch.opening_hours && (
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-600">{branch.opening_hours}</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">
              {branch.tables_count} tables
            </span>
          </div>

          {branch.manager && (
            <div className="flex items-center space-x-1">
              <Settings className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {branch.manager.name}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="flex items-center space-x-1"
            >
              <Eye className="h-3 w-3" />
              <span>View</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="flex items-center space-x-1"
            >
              <Edit className="h-3 w-3" />
              <span>Edit</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="p-1"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}