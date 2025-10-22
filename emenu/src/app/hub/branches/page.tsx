'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HubLayout from '@/components/hub/HubLayout';
import { Breadcrumb } from '@/components/hub/Breadcrumb';
import { BrandGroupedList } from '@/components/hub/BrandGroupedList';

export default function BranchesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#9B1D20'}}></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <HubLayout
      breadcrumb={
        <Breadcrumb items={[
          {label: 'Overview', href: '/hub'},
          {label: 'Restaurants', href: '/hub/branches'},
          {label: 'Locations', active: true}
        ]} />
      }
      title="Restaurant Locations"
      subtitle="View and manage all restaurant branches grouped by brand"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Branch Listings */}
        <BrandGroupedList />
      </div>
    </HubLayout>
  );
}
