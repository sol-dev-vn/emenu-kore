'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useResponsiveNavigation } from '@/hooks/useResponsiveNavigation';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import {
  Menu,
  Bell,
  Search
} from 'lucide-react';

interface HubHeaderProps {
  breadcrumb?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function HubHeader({ breadcrumb, title, subtitle }: HubHeaderProps) {
  const { sidebarOpen, toggleSidebar, isMobile } = useResponsiveNavigation();

  return (
    <>
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button & Breadcrumb */}
            <div className="flex items-center flex-1">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-4"
                  onClick={toggleSidebar}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}

              {/* Breadcrumb */}
              {breadcrumb && (
                <div className="hidden md:block">
                  {breadcrumb}
                </div>
              )}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <Button variant="ghost" size="sm">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      {(title || subtitle) && (
        <div className="bg-white border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}