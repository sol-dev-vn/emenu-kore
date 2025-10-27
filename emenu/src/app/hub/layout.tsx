'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import HubSidebar from '@/components/hub/HubSidebar';
import HubHeader from '@/components/hub/HubHeader';
import HubAuthGuard from '@/components/hub/HubAuthGuard';
import { Breadcrumb } from '@/components/hub/Breadcrumb';

interface HubRouteLayoutProps {
  children: ReactNode;
}

export default function HubRouteLayout({
  children,
}: HubRouteLayoutProps) {
  const pathname = usePathname();

  // Generate dynamic header content based on route
  const getHeaderContent = () => {
    if (pathname === '/hub') {
      return {
        breadcrumb: [{label: 'Overview', active: true}],
        title: 'Dashboard',
        subtitle: 'Welcome to your restaurant management dashboard'
      };
    }

    if (pathname === '/hub/live') {
      return {
        breadcrumb: [
          {label: 'Overview', href: '/hub'},
          {label: 'Live Dashboard', active: true}
        ],
        title: 'Live Dashboard',
        subtitle: 'Real-time branch monitoring and operations'
      };
    }

    // Default header
    return {
      breadcrumb: [{label: 'Hub', active: true}],
      title: 'Hub',
      subtitle: 'Restaurant Management System'
    };
  };

  const headerContent = getHeaderContent();

  return (
    <HubAuthGuard>
      <div className="min-h-screen flex bg-gradient-to-br from-brand-background via-gray-50 to-gray-100">
        <HubSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <HubHeader
            breadcrumb={<Breadcrumb items={headerContent.breadcrumb} />}
            title={headerContent.title}
            subtitle={headerContent.subtitle}
          />

          {/* Main Content Area */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </HubAuthGuard>
  );
}