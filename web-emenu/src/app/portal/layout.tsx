'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, Settings, Table as TableIcon, Utensils, Megaphone, History, Building2, Users, Shield, MessageSquare, HelpCircle, User, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BranchItem { id: string; name: string; code: string; display_name?: string; }

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedBranchName, setSelectedBranchName] = useState<string>('None');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const pathname = usePathname();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
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
        // Load current user
        const userRes = await fetch('/api/auth/me');
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUser(userData);
        }

        // Load branches
        const res = await fetch('/api/branches');
        const json = await res.json();
        const list: BranchItem[] = Array.isArray(json?.data)
          ? json.data.map((b: { id: string; name: string; code: string; display_name?: string }) => ({ id: b.id, name: b.name, code: b.code, display_name: b.display_name }))
          : [];
        setBranches(list);
      } catch (e) {
        console.warn('Failed to load data:', e);
      } finally {
        readSelectedBranchCookie();
      }
    }
    loadData();
    // Also read cookie on focus to reflect external changes
    const onFocus = () => readSelectedBranchCookie();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  async function handleBranchSelect(branchId: string) {
    try {
      if (branchId === 'none') {
        await fetch('/api/auth/impersonate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ branch_id: null })
        });
        setSelectedBranchId(null);
        setSelectedBranchName('None');
      } else {
        await fetch('/api/auth/impersonate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ branch_id: branchId })
        });
        setSelectedBranchId(branchId);
        const br = branches.find(b => b.id === branchId);
        setSelectedBranchName(br ? `${br.display_name || br.name} (${br.code})` : branchId);
      }
    } catch (e) {
      console.error('Failed to set selected branch:', e);
    }
  }

  const navItems = [
    { href: '/portal', icon: Home, label: 'Dashboard' },
    { href: '/portal/sync-logs', icon: History, label: 'Sync Logs' },
    { href: '/portal/menu-management', icon: Utensils, label: 'Menu Management' },
    { href: '/portal/master/brands-branches', icon: Building2, label: 'Branches' },
    { href: '/portal/tables-zones', icon: TableIcon, label: 'Table List' },
    { href: '/portal/visual-tables', icon: TableIcon, label: 'Visual Tables' },
    { href: '/portal/promotions', icon: Megaphone, label: 'Promotions' },
    { href: '/portal/orders', icon: TableIcon, label: 'Orders' },
    { href: '/portal/reports', icon: Settings, label: 'Reports' },
  ];

  const masterSettingsItems = [
    { href: '/portal/master/staff', icon: Users, label: 'Staff Management' },
    { href: '/portal/master/roles', icon: Shield, label: 'Permissions & Roles' },
  ];

  const supportItems = [
    { href: 'https://sol-crm.alphabits.team/hc/help-center/en/categories/account-login-users-management', icon: MessageSquare, label: 'IT Help Desk', external: true },
    { href: 'https://sol-crm.alphabits.team/hc/help-center?ref=portal', icon: HelpCircle, label: 'FAQ', external: true },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-72 bg-gradient-to-b from-orange-50 to-rose-50 border-r border-gray-200 hidden md:flex flex-col fixed h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src="/logo_trim.png" alt="SOL eMenu" className="h-10 w-auto" />
            <div>
              <div className="text-xl font-bold tracking-tight text-gray-900">SOL eMenu</div>
              <div className="text-xs text-gray-500">Restaurant Portal</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Primary sections */}
          <nav className="flex flex-col gap-1 text-sm mb-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                    isActive
                      ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                      : 'text-gray-700 hover:bg-white/60 hover:text-black'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Master Settings */}
          <div className="mb-6">
            <div className="text-xs uppercase text-gray-400 mb-2">Master Settings</div>
            <nav className="flex flex-col gap-1 text-sm">
              {masterSettingsItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
                      isActive
                        ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                        : 'text-gray-700 hover:bg-white/60 hover:text-black'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Support Section */}
          <div className="mb-6">
            <div className="text-xs uppercase text-gray-400 mb-2">Support</div>
            <nav className="flex flex-col gap-1 text-sm">
              {supportItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black transition-colors"
                    {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 bg-white/50">
          {/* Branch selector widget */}
          <div className="mb-4 rounded-xl border border-gray-200 bg-white/80 p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500">Current Branch</div>
                <div className="text-sm font-semibold text-gray-900 truncate">{selectedBranchName}</div>
              </div>
            </div>
            <div className="mt-2">
              <Select value={selectedBranchId || 'none'} onValueChange={handleBranchSelect}>
                <SelectTrigger className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs shadow-inner focus:outline-none focus:ring-2 focus:ring-rose-400">
                  <SelectValue>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-rose-500" />
                      <span className="text-xs font-medium truncate">{selectedBranchName}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="none" className="cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">None (All)</span>
                    </div>
                  </SelectItem>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id} className="cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{b.display_name || b.name}</span>
                        <span className="text-[10px] rounded bg-gray-100 px-2 py-0.5 text-gray-600">#{b.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center">
                {currentUser?.first_name ? (
                  <span className="text-sm font-semibold">
                    {currentUser.first_name[0]}{currentUser.last_name?.[0] || ''}
                  </span>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">
                  {currentUser?.first_name && currentUser?.last_name
                    ? `${currentUser.first_name} ${currentUser.last_name}`
                    : currentUser?.email || 'Loading...'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {currentUser?.role?.name || 'Staff'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - with left padding to account for fixed sidebar */}
      <div className="flex-1 md:ml-72">
        {children}
      </div>
    </div>
  );
}