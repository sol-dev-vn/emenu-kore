'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { cn } from '@/lib/utils';
import {
  Home,
  Utensils,
  Store,
  Layout,
  QrCode,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search
} from 'lucide-react';

interface SidebarItem {
  title: string;
  icon: any;
  href: string;
  description?: string;
  badge?: string;
  children?: SidebarItem[];
}

interface HubLayoutProps {
  children: React.ReactNode;
  breadcrumb?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function HubLayout({ children, breadcrumb, title, subtitle }: HubLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  // Define navigation items based on user role
  const getNavigationItems = (): SidebarItem[] => {
    const baseItems: SidebarItem[] = [
      {
        title: t('navigation.dashboard'),
        icon: Home,
        href: '/hub',
        description: t('dashboard.subtitle')
      },
    ];

    const roleBasedItems: SidebarItem[] = [];

    if (user?.role.name === 'Administrator' || user?.role.name === 'Manager') {
      roleBasedItems.push(
        {
          title: t('navigation.menuManagement'),
          icon: Utensils,
          href: '/hub/menus',
          description: t('menu.subtitle')
        },
        {
          title: t('navigation.branchManagement'),
          icon: Store,
          href: '/hub/branches',
          description: t('branches.subtitle'),
          badge: 'New'
        },
        {
          title: t('navigation.tableLayouts'),
          icon: Layout,
          href: '/hub/layouts',
          description: t('tableLayouts.subtitle')
        },
        {
          title: t('navigation.qrCodes'),
          icon: QrCode,
          href: '/hub/qr',
          description: t('qrCodes.subtitle')
        }
      );
    }

    if (user?.role.name === 'Administrator') {
      roleBasedItems.push(
        {
          title: t('navigation.settings'),
          icon: Settings,
          href: '/hub/settings',
          description: t('settings.subtitle')
        }
      );
    }

    // Staff-specific items
    if (user?.role.name === 'Staff') {
      roleBasedItems.push(
        {
          title: 'My Restaurant',
          icon: Store,
          href: `/hub/restaurant/${user.id}`,
          description: 'Manage your assigned restaurant'
        }
      );
    }

    return [...baseItems, ...roleBasedItems];
  };

  const navigationItems = getNavigationItems();

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isItemActive = (href: string) => {
    if (href === '/hub') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'Administrator':
        return 'bg-red-600 text-white';
      case 'Manager':
        return 'bg-blue-600 text-white';
      case 'Staff':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <img
                className="h-8 w-auto mr-3"
                src="/images/logo.svg"
                alt="SOL eMenu"
              />
              <span className="text-lg font-semibold text-gray-900">SOL eMenu Hub</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigationItems.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  <div>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between h-auto p-3",
                        expandedItems.includes(item.title) && "bg-gray-50"
                      )}
                      onClick={() => toggleExpanded(item.title)}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4 mr-3" style={{color: '#9B1D20'}} />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        expandedItems.includes(item.title) && "rotate-180"
                      )} />
                    </Button>
                    {expandedItems.includes(item.title) && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.children.map((child) => (
                          <Button
                            key={child.href}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start h-auto p-2 text-sm",
                              isItemActive(child.href) && "bg-red-50 text-red-700 border-r-2 border-red-600"
                            )}
                            onClick={() => handleNavigation(child.href)}
                          >
                            <child.icon className="h-4 w-4 mr-2" />
                            {child.title}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-auto p-3",
                      isItemActive(item.href) && "bg-red-50 text-red-700 border-r-2 border-red-600"
                    )}
                    onClick={() => handleNavigation(item.href)}
                  >
                    <div className="flex items-center flex-1">
                      <item.icon className="h-4 w-4 mr-3" style={{color: isItemActive(item.href) ? '#9B1D20' : '#6B7280'}} />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={user?.first_name} />
                <AvatarFallback>
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <Badge className={cn("text-xs mt-1", getRoleBadgeColor(user?.role.name || ''))}>
                  {user?.role.name}
                </Badge>
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm"
                onClick={() => router.push('/hub/profile')}
              >
                <User className="h-4 w-4 mr-2" />
                {t('navigation.profile')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('auth.logout')}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button & Breadcrumb */}
              <div className="flex items-center flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-4 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>

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

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}