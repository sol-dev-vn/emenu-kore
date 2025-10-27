'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import HubSidebar from './HubSidebar';
import HubHeader from './HubHeader';
import HubAuthGuard from './HubAuthGuard';

interface HubLayoutProps {
  children: React.ReactNode;
  breadcrumb?: React.ReactNode;
  title?: string;
  subtitle?: string;
  requiredRoles?: string[];
}

export default function HubLayout({
  children,
  breadcrumb,
  title,
  subtitle,
  requiredRoles = []
}: HubLayoutProps) {
  const pathname = usePathname();

  return (
    <HubAuthGuard requiredRoles={requiredRoles}>
      <div className="min-h-screen flex bg-gradient-to-br from-brand-background via-gray-50 to-gray-100">
        <HubSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <HubHeader
            breadcrumb={breadcrumb}
            title={title}
            subtitle={subtitle}
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