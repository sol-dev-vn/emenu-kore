'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { useResponsiveNavigation } from '@/hooks/useResponsiveNavigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  LogOut,
  X,
  ChevronDown,
  User,
} from 'lucide-react';
import { getNavigationItems, getRoleBadgeColor, SidebarItem } from '@/lib/hub-navigation';

interface HubSidebarProps {
  className?: string;
}

export default function HubSidebar({ className }: HubSidebarProps) {
  const { sidebarOpen, closeSidebar, isMobile } = useResponsiveNavigation();
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const navigationItems = getNavigationItems(user?.role.name || '', t);

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
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        className
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
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={closeSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigationItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isActive={isItemActive(item.href)}
                expanded={expandedItems.includes(item.title)}
                onToggleExpand={toggleExpanded}
                onNavigate={handleNavigation}
              />
            ))}
          </nav>

          {/* User Profile Section */}
          <UserProfileSection
            user={user}
            logout={logout}
            getRoleBadgeColor={getRoleBadgeColor}
          />
        </div>
      </aside>
    </>
  );
}

interface SidebarNavItemProps {
  item: SidebarItem;
  isActive: boolean;
  expanded: boolean;
  onToggleExpand: (title: string) => void;
  onNavigate: (href: string) => void;
}

function SidebarNavItem({ item, isActive, expanded, onToggleExpand, onNavigate }: SidebarNavItemProps) {
  if (item.children && item.children.length > 0) {
    return (
      <div>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between h-auto p-3",
            expanded && "bg-gray-50"
          )}
          onClick={() => onToggleExpand(item.title)}
        >
          <div className="flex items-center">
            <item.icon className="h-4 w-4 mr-3" style={{ color: '#9B1D20' }} />
            <span className="font-medium">{item.title}</span>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            expanded && "rotate-180"
          )} />
        </Button>
        {expanded && (
          <div className="ml-4 mt-2 space-y-1">
            {item.children.map((child) => (
              <Button
                key={child.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-auto p-2 text-sm",
                  isItemActive(child.href) && "bg-red-50 text-red-700 border-r-2 border-red-600"
                )}
                onClick={() => onNavigate(child.href)}
              >
                <child.icon className="h-4 w-4 mr-2" />
                {child.title}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start h-auto p-3",
        isActive && "bg-red-50 text-red-700 border-r-2 border-red-600"
      )}
      onClick={() => onNavigate(item.href)}
    >
      <div className="flex items-center flex-1">
        <item.icon className="h-4 w-4 mr-3" style={{ color: isActive ? '#9B1D20' : '#6B7280' }} />
        <span className="font-medium">{item.title}</span>
      </div>
      {item.badge && (
        <Badge variant="secondary" className="ml-auto">
          {item.badge}
        </Badge>
      )}
    </Button>
  );
}

interface UserProfileSectionProps {
  user: any;
  logout: () => void;
  getRoleBadgeColor: (roleName: string) => string;
}

function UserProfileSection({ user, logout, getRoleBadgeColor }: UserProfileSectionProps) {
  const router = useRouter();

  return (
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
          Profile
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}

// Helper function for nested items
function isItemActive(href: string): boolean {
  const pathname = usePathname();
  if (href === '/hub') {
    return pathname === href;
  }
  return pathname.startsWith(href);
}