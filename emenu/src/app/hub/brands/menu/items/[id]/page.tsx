'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Image as ImageIcon,
  Clock,
  DollarSign,
  Tag,
  ChefHat,
  AlertCircle
} from 'lucide-react';
import { MenuItem as BaseMenuItem } from '@/hooks/use-brand-menus';

interface MenuItem extends BaseMenuItem {
  currency: string;
  imageUrl?: string;
  images?: string[];
  dietaryInfo?: string[];
  allergenInfo?: string[];
  prepTime?: number;
  spiceLevel?: number;
  thumbnail?: string;
}

export default function MenuItemDetailPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!itemId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/directus/menu-items/${itemId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch menu item details');
        }

        const itemData: MenuItem = await response.json();
        setItem(itemData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu item');
        console.error('Error fetching menu item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const handleDelete = async () => {
    if (!item || !confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/directus/menu-items/${item.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }

      router.push('/hub/brands/menu');
    } catch (err) {
      console.error('Error deleting menu item:', err);
      alert('Failed to delete menu item. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <HubLayout title="Loading...">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2" style={{borderColor: '#9B1D20'}}></div>
        </div>
      </HubLayout>
    );
  }

  if (error) {
    return (
      <HubLayout title="Error">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Menu Item</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </HubLayout>
    );
  }

  if (!item) {
    return (
      <HubLayout title="Menu Item Not Found">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Menu Item Not Found</h2>
            <p className="text-gray-600 mb-4">The menu item you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push('/hub/brands/menu')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </div>
      </HubLayout>
    );
  }

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Brands', href: '/hub/brands'},
          {label: 'Brand Menu', href: '/hub/brands/menu'},
          {label: item.name, active: true}
        ]} />
      }
      title={item.name}
      subtitle={`Menu item details and management`}
      style={{color: '#9B1D20'}}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/hub/brands/menu')}
            className="text-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/hub/brands/menu/items/${item.id}/edit`)}
              style={{backgroundColor: '#9B1D20'}}
              className="text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Item
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Item Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {item.imageUrl || item.thumbnail ? (
                    <img
                      src={item.imageUrl || item.thumbnail}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center text-gray-400 ${item.imageUrl ? 'hidden' : ''}`}>
                    <ImageIcon className="w-12 h-12" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Item Name</label>
                    <p className="text-lg font-semibold text-gray-900">{item.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Item Code</label>
                    <p className="text-lg font-mono text-gray-900">{item.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900">{item.category_name || 'Uncategorized'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`font-medium ${item.is_available ? 'text-green-600' : 'text-red-600'}`}>
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>

                {item.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{item.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: item.currency || 'VND'
                  }).format(item.price || 0)}
                </div>
              </CardContent>
            </Card>

            {/* Item Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Item Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.prepTime && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Preparation Time</p>
                      <p className="text-gray-600">{item.prepTime} minutes</p>
                    </div>
                  </div>
                )}

                {item.spiceLevel && item.spiceLevel > 0 && (
                  <div className="flex items-center gap-3">
                    <ChefHat className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Spice Level</p>
                      <p className="text-gray-600">
                        {'🌶️'.repeat(item.spiceLevel)} {item.spiceLevel}/3
                      </p>
                    </div>
                  </div>
                )}

                {item.unit_name && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Unit</p>
                    <p className="text-gray-600">{item.unit_name}</p>
                  </div>
                )}

                {item.print_group && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Print Group</p>
                    <p className="text-gray-600">{item.print_group}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dietary Information */}
            {item.dietaryInfo && item.dietaryInfo.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Dietary Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {item.dietaryInfo.map((diet, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"
                      >
                        {diet}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Allergen Information */}
            {item.allergenInfo && item.allergenInfo.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Allergens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {item.allergenInfo.map((allergen, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </HubLayout>
  );
}