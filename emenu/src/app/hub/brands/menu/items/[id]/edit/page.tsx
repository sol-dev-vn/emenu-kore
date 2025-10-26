'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { MenuItemForm } from '@/components/hub/MenuItemForm';
import { MenuItem } from '@/hooks/use-directus-data';
import { useDirectusMenuItems } from '@/hooks/use-directus-data';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditMenuItemPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  const { toast } = useToast();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [brandMenuId, setBrandMenuId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { updateMenuItem } = useDirectusMenuItems(brandMenuId);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!itemId) return;

      setLoading(true);
      setError(null);

      try {
        // First fetch the item details
        const response = await fetch(`/api/directus/menu-items/${itemId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch menu item details');
        }

        const itemData: MenuItem = await response.json();
        setItem(itemData);
        setBrandMenuId(itemData.brand_menu || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu item');
        console.error('Error fetching menu item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const handleSave = async (itemData: Partial<MenuItem>) => {
    if (!item || !itemId) {
      throw new Error('No item to update');
    }

    setSaving(true);
    try {
      await updateMenuItem(parseInt(itemId), itemData);
      toast({
        title: 'Success',
        description: 'Menu item updated successfully!',
      });
      router.push(`/hub/brands/menu/items/${itemId}`);
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update menu item. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    if (item) {
      router.push(`/hub/brands/menu/items/${item.id}`);
    } else {
      router.push('/hub/brands/menu');
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
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Menu Item</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleGoBack}>
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
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Menu Item Not Found</h2>
            <p className="text-gray-600 mb-4">The menu item you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
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
          {label: 'Brand Menu', href: `/hub/brands/menu?brand=${brandMenuId}`},
          {label: item.name, href: `/hub/brands/menu/items/${item.id}`},
          {label: 'Edit', active: true}
        ]} />
      }
      title={`Edit ${item.name}`}
      subtitle="Update menu item information and settings"
      style={{color: '#9B1D20'}}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <MenuItemForm
          item={item}
          brandMenuId={brandMenuId}
          onSave={handleSave}
          loading={saving}
        />
      </div>
    </HubLayout>
  );
}