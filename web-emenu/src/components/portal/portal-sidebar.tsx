'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, Settings, Table as TableIcon, Utensils, Megaphone, History, Building2, Users, Shield, MessageSquare, HelpCircle, User as UserIcon, LogOut, ChevronDown, X, CheckCircle, Sun, Moon, Monitor, Menu, ChevronLeft, Store, Globe, ChevronRight, Bug } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useNavigationLoading } from '@/hooks/use-navigation-loading';
import type { User as DirectusUser } from '@/lib/directus';
import { useBranch } from '@/contexts/branch-context';

interface PortalSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentUser: DirectusUser | null;
  onLogout: () => void;
  theme: 'light' | 'dark' | 'auto';
  onThemeToggle: () => void;
}

const getThemeIcon = (theme: 'light' | 'dark' | 'auto') => {
  switch (theme) {
    case 'light':
      return <Sun className="h-4 w-4" />;
    case 'dark':
      return <Moon className="h-4 w-4" />;
    default:
      return <Monitor className="h-4 w-4" />;
  }
};

const formatUserName = (user: DirectusUser | null) => {
  if (!user) return 'Unknown User';

  const firstName = user.first_name?.trim();
  const lastName = user.last_name?.trim();
  const email = user.email?.trim();

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  } else if (email) {
    const emailName = email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }

  return 'User';
};

const getUserInitials = (user: DirectusUser | null) => {
  if (!user) return 'U';

  const firstName = user.first_name?.trim();
  const lastName = user.last_name?.trim();

  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  } else if (firstName) {
    return firstName.charAt(0).toUpperCase();
  } else if (lastName) {
    return lastName.charAt(0).toUpperCase();
  } else if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }

  return 'U';
};

export default function PortalSidebar({
  isCollapsed,
  onToggleCollapse,
  currentUser,
  onLogout,
  theme,
  onThemeToggle,
}: PortalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { navigateWithLoading } = useNavigationLoading();
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const [isPlatformManagementCollapsed, setIsPlatformManagementCollapsed] = useState(true);
  const [isSupportCollapsed, setIsSupportCollapsed] = useState(true);

  const {
    branches,
    selectedBranchId,
    selectedBranch,
    isLoading: isLoadingBranches,
    error: branchError,
    selectBranch,
    getActiveBranches,
  } = useBranch();

  const activeBranches = getActiveBranches();
  const selectedBranchName = selectedBranchId === 'all'
    ? 'All Branches'
    : selectedBranch?.display_name || selectedBranch?.name || 'None';

  const navItems = [
    { href: '/portal/visual-tables', icon: TableIcon, label: 'Live Dashboard', isProminent: true },
    { href: '/portal/menu-management', icon: Utensils, label: 'Menu Management' },
    { href: '/portal/tables-zones', icon: TableIcon, label: 'Table List' },
    { href: '/portal/promotions', icon: Megaphone, label: 'Promotions' },
    { href: '/portal/orders', icon: TableIcon, label: 'Orders' },
    { href: '/portal/master/brands-branches', icon: Building2, label: 'Branches Management' },
  ];

  const platformManagementItems = [
    { href: '/portal', icon: Home, label: 'Admin Overview', adminOnly: true },
    { href: '/portal/master/staff', icon: Users, label: 'Staff Management', adminOnly: true },
    { href: '/portal/master/roles', icon: Shield, label: 'Permissions & Roles', adminOnly: true },
    { href: '/portal/sync-logs', icon: History, label: 'Sync Logs', adminOnly: true },
  ];

  const supportItems = [
    { href: '/portal/debug', icon: Bug, label: 'Debug Info', adminOnly: true },
    { href: 'https://sol-crm.alphabits.team/hc/help-center/en/categories/account-login-users-management', icon: MessageSquare, label: 'IT Help Desk', external: true },
    { href: 'https://sol-crm.alphabits.team/hc/help-center?ref=portal', icon: HelpCircle, label: 'FAQ', external: true },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-72'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col fixed h-full shadow-sm transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo_trim.png" alt="SOL eMenu" className={`${isCollapsed ? 'h-8 w-auto' : 'h-10 w-auto'} transition-all duration-300`} />
            {!isCollapsed && (
              <div>
                <div className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">SOL eMenu</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Restaurant Portal</div>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Branch Selection */}
        {!isCollapsed && (
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Current Branch</div>
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowBranchSelector(!showBranchSelector)}
                className="w-full justify-between text-left h-auto p-3 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                disabled={isLoadingBranches}
              >
                <div className="flex items-center gap-2">
                  {selectedBranchId === 'all' ? (
                    <Globe className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Store className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                  <span className="text-sm font-medium truncate">
                    {isLoadingBranches ? 'Loading...' : selectedBranchName}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </Button>

              {branchError && (
                <div className="mt-1 text-xs text-red-500 dark:text-red-400">
                  Failed to load branches
                </div>
              )}

              {showBranchSelector && !isLoadingBranches && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {/* All Branches Option */}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        selectBranch('all');
                        setShowBranchSelector(false);
                      }}
                      className={`w-full justify-start text-left h-8 px-2 py-1 text-sm ${
                        selectedBranchId === 'all' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">All Branches</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">View data from all branches</div>
                        </div>
                      </div>
                    </Button>

                    {/* Individual Branches */}
                    {activeBranches.map((branch) => (
                      <Button
                        key={branch.id}
                        variant="ghost"
                        onClick={() => {
                          selectBranch(branch.id);
                          setShowBranchSelector(false);
                        }}
                        className={`w-full justify-start text-left h-8 px-2 py-1 text-sm ${
                          selectedBranchId === branch.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div>
                            <div className="font-medium">{branch.display_name || branch.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{branch.code}</div>
                          </div>
                        </div>
                      </Button>
                    ))}

                    {activeBranches.length === 0 && !isLoadingBranches && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                        No active branches available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Primary sections */}
        <nav className="flex flex-col gap-2 text-sm mb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isProminent = item.isProminent;

            if (isProminent) {
              return (
                <button
                  key={item.href}
                  onClick={() => navigateWithLoading(item.href)}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} rounded-lg px-4 py-3 font-semibold transition-all transform hover:scale-[1.02] w-full text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg ring-2 ring-blue-500/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-800'
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 hover:from-blue-100 dark:hover:from-blue-900/30 hover:to-indigo-100 dark:hover:to-indigo-900/30 border border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && (
                    <>
                      <span className="text-base">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            }

            return (
              <button
                key={item.href}
                onClick={() => navigateWithLoading(item.href)}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} rounded-lg px-4 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left ${
                  isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Secondary sections */}
        <div className="mt-6 space-y-4">
          {/* Platform Management (renamed from Platform Settings) */}
          <div>
            <button
              onClick={() => setIsPlatformManagementCollapsed(!isPlatformManagementCollapsed)}
              className={`w-full flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors`}
            >
              <span>Platform Management</span>
              <ChevronRight className={`h-3 w-3 transition-transform ${!isPlatformManagementCollapsed ? 'rotate-90' : ''}`} />
            </button>

            {!isPlatformManagementCollapsed && (
              <nav className="flex flex-col gap-2 text-sm">
                {platformManagementItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <button
                      key={item.href}
                      onClick={() => navigateWithLoading(item.href)}
                      className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} rounded-lg px-4 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left ${
                        isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Support */}
          <div>
            {!isCollapsed && (
              <button
                onClick={() => setIsSupportCollapsed(!isSupportCollapsed)}
                className={`w-full flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors`}
              >
                <span>Support</span>
                <ChevronRight className={`h-3 w-3 transition-transform ${!isSupportCollapsed ? 'rotate-90' : ''}`} />
              </button>
            )}

            {!isSupportCollapsed && (
              <nav className="flex flex-col gap-2 text-sm">
                {supportItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} rounded-lg px-4 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300`}
                    >
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </a>
                  );
                })}
              </nav>
            )}
          </div>

          </div>
      </div>

      {/* User Info */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          {isCollapsed ? (
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                {getUserInitials(currentUser)}
              </div>
              <button
                onClick={onLogout}
                className="absolute -bottom-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {getUserInitials(currentUser)}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {formatUserName(currentUser)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentUser?.title || 'Staff Member'}
                </div>
                {currentUser?.email && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {currentUser.email}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={onThemeToggle}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Toggle Theme"
                >
                  {getThemeIcon(theme)}
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}