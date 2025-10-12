'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, Settings, Table as TableIcon, Utensils, Megaphone, History, Building2, Users, Shield, MessageSquare, HelpCircle, User as UserIcon, LogOut, ChevronDown, X, CheckCircle, Sun, Moon, Monitor, Menu, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import type { User as DirectusUser } from '@/lib/directus';
import { directusClient } from '@/lib/directus';

interface BranchItem { id: string; name: string; code: string; display_name?: string; }

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedBranchName, setSelectedBranchName] = useState<string>('None');
  const [currentUser, setCurrentUser] = useState<DirectusUser | null>(null);
  const [showBranchDialog, setShowBranchDialog] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [deliveryQueueCollapsed, setDeliveryQueueCollapsed] = useState(true);
  const pathname = usePathname();

  // Auto-collapse sidebar when on Live Dashboard
  useEffect(() => {
    setIsSidebarCollapsed(pathname === '/portal/visual-tables');
  }, [pathname]);

  async function handleLogout() {
    try {
      const match = document.cookie.match(/(?:^|; )directus_refresh_token=([^;]+)/);
      const refreshToken = match ? decodeURIComponent(match[1]) : '';
      if (refreshToken) {
        await directusClient.logout(refreshToken);
      }
      document.cookie = 'directus_access_token=; path=/; max-age=0';
      document.cookie = 'directus_refresh_token=; path=/; max-age=0';
    } catch (e) {
      console.warn('Logout encountered an issue:', e);
    } finally {
      router.push('/login');
    }
  }

  function readSelectedBranchCookie() {
    const match = document.cookie.match(/(?:^|; )selected_branch=([^;]+)/);
    const value = match ? decodeURIComponent(match[1]) : null;
    setSelectedBranchId(value);
    if (value) {
      const br = branches.find(b => b.id === value);
      setSelectedBranchName(br ? `${br.display_name || br.name} (${br.code})` : value);
    } else {
      setSelectedBranchName('None');
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        loadTheme();

        const tokenMatch = document.cookie.match(/(?:^|; )directus_access_token=([^;]+)/);
        const accessToken = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
        if (accessToken) {
          directusClient.setAccessToken(accessToken);
        }

        try {
          const userRes = await directusClient.getCurrentUser();
          if (userRes?.data) {
            setCurrentUser(userRes.data);
          }
        } catch (err) {
          console.warn('Failed to load current user:', err);
        }

        try {
          const res = await directusClient.getBranches();
          const list: BranchItem[] = Array.isArray(res?.data)
            ? res.data.map((b: { id: string; name: string; code: string; display_name?: string }) => ({ id: b.id, name: b.name, code: b.code, display_name: b.display_name }))
            : [];
          setBranches(list);
        } catch (err) {
          console.warn('Failed to load branches:', err);
        }
      } catch (e) {
        console.warn('Failed to load data:', e);
      } finally {
        readSelectedBranchCookie();
      }
    }
    loadData();
    const onFocus = () => readSelectedBranchCookie();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  async function handleBranchSelect(branchId: string) {
    try {
      if (branchId === 'none') {
        localStorage.setItem('selected_branch', 'none');
        document.cookie = 'selected_branch=none; path=/; max-age=31536000';
        setSelectedBranchId(null);
        setSelectedBranchName('None');
      } else {
        localStorage.setItem('selected_branch', branchId);
        document.cookie = `selected_branch=${branchId}; path=/; max-age=31536000`;
        setSelectedBranchId(branchId);
        const br = branches.find(b => b.id === branchId);
        setSelectedBranchName(br ? `${br.display_name || br.name} (${br.code})` : branchId);
      }
    } catch (e) {
      console.error('Failed to set selected branch:', e);
    }
  }

  // Theme management functions
  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  };

  const applyTheme = (themeValue: 'light' | 'dark' | 'auto') => {
    const root = document.documentElement;

    if (themeValue === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', themeValue === 'dark');
    }

    localStorage.setItem('theme', themeValue);
  };

  const handleThemeToggle = () => {
    const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const navItems = [
    { href: '/portal/visual-tables', icon: TableIcon, label: 'Live Dashboard', isProminent: true },
    { href: '/portal/menu-management', icon: Utensils, label: 'Menu Management' },
    { href: '/portal/tables-zones', icon: TableIcon, label: 'Table List' },
    { href: '/portal/promotions', icon: Megaphone, label: 'Promotions' },
    { href: '/portal/orders', icon: TableIcon, label: 'Orders' },
    { href: '/portal/master/brands-branches', icon: Building2, label: 'Branches management' },
  ];

  const platformSettingsItems = [
    { href: '/portal', icon: Home, label: 'Admin Overview', adminOnly: true },
    { href: '/portal/master/staff', icon: Users, label: 'Staff Management', adminOnly: true },
    { href: '/portal/master/roles', icon: Shield, label: 'Permissions & Roles', adminOnly: true },
    { href: '/portal/master/brands-branches', icon: Building2, label: 'Branches', adminOnly: true },
    { href: '/portal/sync-logs', icon: History, label: 'Sync Logs', adminOnly: true },
    { href: '/portal/reports', icon: Settings, label: 'Executive Summary', adminOnly: true },
  ];

  const supportItems = [
    { href: 'https://sol-crm.alphabits.team/hc/help-center/en/categories/account-login-users-management', icon: MessageSquare, label: 'IT Help Desk', external: true },
    { href: 'https://sol-crm.alphabits.team/hc/help-center?ref=portal', icon: HelpCircle, label: 'FAQ', external: true },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors">
      {mounted && (
        <>
          <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-72'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col fixed h-full shadow-sm transition-all duration-300 ease-in-out`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/logo_trim.png" alt="SOL eMenu" className={`${isSidebarCollapsed ? 'h-8 w-auto' : 'h-10 w-auto'} transition-all duration-300`} />
                  {!isSidebarCollapsed && (
                    <div>
                      <div className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">SOL eMenu</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Restaurant Portal</div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                  {isSidebarCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Primary sections */}
              <nav className="flex flex-col gap-2 text-sm mb-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  const isProminent = item.isProminent;

                  if (isProminent) {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} rounded-lg px-4 py-3 font-semibold transition-all transform hover:scale-[1.02] ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg ring-2 ring-blue-500/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-800'
                            : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 hover:from-blue-100 dark:hover:from-blue-900/30 hover:to-indigo-100 dark:hover:to-indigo-900/30 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {!isSidebarCollapsed && (
                          <>
                            <span className="text-base">{item.label}</span>
                            {isActive && (
                              <div className="ml-auto">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              </div>
                            )}
                          </>
                        )}
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} rounded-lg px-4 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {!isSidebarCollapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>

              {/* Secondary sections */}
              <div className="mt-6 space-y-4">
                {/* Platform Settings */}
                <div>
                  {!isSidebarCollapsed && (
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Platform Settings</div>
                  )}
                  <nav className="flex flex-col gap-2 text-sm">
                    {platformSettingsItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} rounded-lg px-4 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {!isSidebarCollapsed && <span>{item.label}</span>}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
                {/* Support */}
                <div>
                  {!isSidebarCollapsed && (
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Support</div>
                  )}
                  <nav className="flex flex-col gap-2 text-sm">
                    {supportItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} rounded-lg px-4 py-2 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300`}
                        >
                          <Icon className="h-5 w-5" />
                          {!isSidebarCollapsed && <span>{item.label}</span>}
                        </a>
                      );
                    })}
                  </nav>
                </div>
                {/* User Info */}
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <UserIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    {!isSidebarCollapsed && (
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {(currentUser?.first_name || currentUser?.last_name)
                            ? `${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim()
                            : (currentUser?.email || 'User')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {currentUser?.title || ''}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={handleLogout}
                      className="ml-auto p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      title="Logout"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
          </aside>

          {/* Main content */}
          <main className={`${isSidebarCollapsed ? 'ml-16' : 'ml-72'} flex-1`}>
            {children}
          </main>
        </>
      )}
    </div>
  );
}