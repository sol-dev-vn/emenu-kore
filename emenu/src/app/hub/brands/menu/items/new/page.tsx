'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { MenuItemForm } from '@/components/hub/MenuItemForm';
import { MenuItem } from '@/hooks/use-directus-data';
import { useDirectusMenuItems } from '@/hooks/use-directus-data';
import { useToast } from '@/hooks/use-toast';

export default function NewMenuItemPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const brandMenuId = searchParams.get('brand') || '';

  const { createMenuItem } = useDirectusMenuItems(brandMenuId);
  const [saving, setSaving] = useState<boolean>(false);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <HubLayout title="Loading...">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2" style={{borderColor: '#9B1D20'}}></div>
        </div>
      </HubLayout>
    );
  }

  if (!brandMenuId) {
    return (
      <HubLayout title="Error">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Brand Selected</h2>
            <p className="text-gray-600 mb-4">Please select a brand before creating a menu item.</p>
          </div>
        </div>
      </HubLayout>
    );
  }

  const handleSave = async (itemData: Partial<MenuItem>) => {
    if (!brandMenuId) {
      throw new Error('No brand menu ID provided');
    }

    setSaving(true);
    try {
      await createMenuItem(itemData);
      toast({
        title: 'Success',
        description: 'Menu item created successfully!',
      });
      router.push(`/hub/brands/menu?brand=${brandMenuId}`);
    } catch (error) {
      console.error('Error creating menu item:', error);
      toast({
        title: 'Error',
        description: 'Failed to create menu item. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Brands', href: '/hub/brands'},
          {label: 'Brand Menu', href: `/hub/brands/menu?brand=${brandMenuId}`},
          {label: 'New Item', active: true}
        ]} />
      }
      title="Create New Menu Item"
      subtitle="Add a new menu item to your brand menu"
      style={{color: '#9B1D20'}}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <MenuItemForm
          brandMenuId={brandMenuId}
          onSave={handleSave}
          loading={saving}
        />
      </div>
    </HubLayout>
  );
}