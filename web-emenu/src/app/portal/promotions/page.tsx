'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { directusClient } from '@/lib/directus';

interface Promotion {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: string;
  discount_value: number;
  minimum_amount?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  applicable_items?: string[];
  applicable_categories?: string[];
  usage_limit?: number;
  usage_count: number;
  image_url?: string;
  branch_id?: string;
  external_source: string;
  external_id?: string;
  sync_status: string;
  created_at: string;
  updated_at: string;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadPromotions = async () => {
    try {
      // Read access token from cookie and set for Directus client
      const token = typeof document !== 'undefined'
        ? document.cookie
            .split('; ')
            .find((row) => row.startsWith('access_token='))
            ?.split('=')[1]
        : undefined;
      if (token) directusClient.setAccessToken(token);

      const filter: Record<string, unknown> = {};
      if (activeFilter) {
        filter.is_active = { _eq: activeFilter === 'true' };
      }
      if (typeFilter) {
        filter.type = { _eq: typeFilter };
      }
      if (searchQuery) {
        filter._or = [
          { name: { _icontains: searchQuery } },
          { code: { _icontains: searchQuery } },
          { description: { _icontains: searchQuery } },
        ];
      }

      const result = await directusClient.getItems<Promotion>('promotions', {
        page,
        limit: 20,
        sort: ['-start_date', 'name'],
        filter,
        fields: [
          'id',
          'name',
          'code',
          'description',
          'type',
          'discount_value',
          'minimum_amount',
          'start_date',
          'end_date',
          'is_active',
          'applicable_items',
          'applicable_categories',
          'usage_limit',
          'usage_count',
          'image_url',
          'branch_id',
          'external_source',
          'external_id',
          'sync_status',
          'created_at',
          'updated_at',
        ],
      });

      setPromotions(result.data || []);
    } catch (e) {
      setError('Failed to load promotions');
    }
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      await loadPromotions();
      setLoading(false);
    }
    loadData();
  }, [page, searchQuery, activeFilter, typeFilter]);

  const formatDiscount = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.discount_value}%`;
      case 'fixed':
        return `$${promotion.discount_value}`;
      case 'bogo':
        return 'Buy One Get One';
      case 'free_item':
        return 'Free Item';
      case 'combo':
        return 'Combo Deal';
      default:
        return promotion.discount_value.toString();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'bg-blue-100 text-blue-800';
      case 'fixed':
        return 'bg-green-100 text-green-800';
      case 'bogo':
        return 'bg-purple-100 text-purple-800';
      case 'free_item':
        return 'bg-orange-100 text-orange-800';
      case 'combo':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.start_date);
    const end = new Date(promotion.end_date);
    return promotion.is_active && now >= start && now <= end;
  };

  const getUsagePercentage = (promotion: Promotion) => {
    if (!promotion.usage_limit) return null;
    return Math.round((promotion.usage_count / promotion.usage_limit) * 100);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Promotions Management</h1>
          <p className="text-gray-600 mt-2">Manage discount codes, special offers, and promotional campaigns</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          Add Promotion
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search promotions..."
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Amount</option>
                <option value="bogo">Buy One Get One</option>
                <option value="free_item">Free Item</option>
                <option value="combo">Combo Deal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No promotions found
          </div>
        ) : (
          promotions.map((promotion) => {
            const isActive = isPromotionActive(promotion);
            const usagePercentage = getUsagePercentage(promotion);

            return (
              <Card key={promotion.id} className={`relative ${!isActive && 'opacity-75'}`}>
                {promotion.image_url && (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={promotion.image_url}
                      alt={promotion.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{promotion.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{promotion.code}</Badge>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(promotion.type)}`}>
                          {formatDiscount(promotion)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {isActive ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(promotion.sync_status)}`}>
                        {promotion.sync_status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {promotion.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {promotion.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span>{formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}</span>
                    </div>

                    {promotion.minimum_amount && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Minimum:</span>
                        <span>${promotion.minimum_amount}</span>
                      </div>
                    )}

                    {promotion.usage_limit && (
                      <div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Usage:</span>
                          <span>{promotion.usage_count} / {promotion.usage_limit}</span>
                        </div>
                        {usagePercentage !== null && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                usagePercentage >= 90 ? 'bg-red-500' :
                                usagePercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}