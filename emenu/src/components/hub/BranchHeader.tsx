'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Phone,
  Clock,
  Users,
  Settings,
  QrCode,
  Store
} from 'lucide-react';
import { BRAND_COLORS } from '@/lib/styling-constants';

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
    phone?: string;
  };
  brand: {
    id: string;
    name: string;
    logo?: string;
  };
  created_at: string;
}

interface BranchHeaderProps {
  branch: Branch;
}

export function BranchHeader({ branch }: BranchHeaderProps) {
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

  return (
    <div className="space-y-6">
      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {/* Brand Logo */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
                {branch.brand.logo ? (
                  <img
                    src={branch.brand.logo}
                    alt={branch.brand.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <Store className="h-8 w-8 text-gray-500" />
                )}
              </div>

              <div>
                <CardTitle className="text-2xl flex items-center gap-3 mb-2">
                  {branch.name}
                  <Badge
                    className={`text-sm ${getStatusColor(branch.status)}`}
                    variant="secondary"
                  >
                    <span className="mr-1">{getStatusIcon(branch.status)}</span>
                    {branch.status}
                  </Badge>
                </CardTitle>
                <p className="text-gray-600 font-medium">{branch.brand.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                QR Codes
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Address */}
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Address</p>
                <p className="text-sm text-gray-600">{branch.address}</p>
              </div>
            </div>

            {/* Phone */}
            {branch.phone && (
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{branch.phone}</p>
                </div>
              </div>
            )}

            {/* Opening Hours */}
            {branch.opening_hours && (
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Hours</p>
                  <p className="text-sm text-gray-600">{branch.opening_hours}</p>
                </div>
              </div>
            )}

            {/* Tables */}
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Tables</p>
                <p className="text-sm text-gray-600">{branch.tables_count} tables</p>
              </div>
            </div>
          </div>

          {/* Manager Info */}
          {branch.manager && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Branch Manager</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-sm text-gray-600">{branch.manager.name}</p>
                    <p className="text-sm text-gray-500">{branch.manager.email}</p>
                    {branch.manager.phone && (
                      <p className="text-sm text-gray-500">{branch.manager.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-brand-primary">
                  ₱45,678
                </p>
                <p className="text-xs text-green-600">+12% from yesterday</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-brand-primary">
                  {Math.floor(branch.tables_count * 0.7)}
                </p>
                <p className="text-xs text-gray-500">of {branch.tables_count} tables</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wait Time</p>
                <p className="text-2xl font-bold text-brand-primary">
                  15 min
                </p>
                <p className="text-xs text-orange-600">Above average</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Staff on Duty</p>
                <p className="text-2xl font-bold text-brand-primary">
                  12
                </p>
                <p className="text-xs text-gray-500">8 waiters, 4 kitchen</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}