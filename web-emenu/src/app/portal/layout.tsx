'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, Settings, Table as TableIcon, Utensils, Megaphone, History, Building2, Users, Shield, MessageSquare, HelpCircle } from 'lucide-react';

interface BranchItem { id: string; name: string; code: string; display_name?: string; }

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedBranchName, setSelectedBranchName] = useState<string>('None');

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
    async function loadBranches() {
      try {
        const res = await fetch('/api/branches');
        const json = await res.json();
        const list: BranchItem[] = Array.isArray(json?.data)
          ? json.data.map((b: { id: string; name: string; code: string; display_name?: string }) => ({ id: b.id, name: b.name, code: b.code, display_name: b.display_name }))
          : [];
        setBranches(list);
      } catch (e) {
        console.warn('Failed to load branches for sidebar impersonation:', e);
      } finally {
        readSelectedBranchCookie();
      }
    }
    loadBranches();
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

  return (
    <div className="min-h-screen flex">
      <aside className="w-72 bg-gradient-to-b from-orange-50 to-rose-50 border-r border-gray-200 p-6 hidden md:flex">
        <div className="w-full">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo_trim.png" alt="SOL eMenu" className="h-10 w-auto" />
            <div>
              <div className="text-xl font-bold tracking-tight text-gray-900">SOL eMenu</div>
              <div className="text-xs text-gray-500">Restaurant Portal</div>
            </div>
          </div>

          {/* Branch selector widget */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-500">Current Branch</div>
                <div className="text-sm font-semibold text-gray-900">{selectedBranchName}</div>
              </div>
            </div>
            <div className="mt-3">
              <Select value={selectedBranchId || 'none'} onValueChange={handleBranchSelect}>
                <SelectTrigger className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-rose-400">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-rose-500" />
                      <span className="text-sm font-medium">{selectedBranchName}</span>
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

          {/* Primary sections */}
          <nav className="flex flex-col gap-1 text-sm">
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/sync-logs">
              <History className="h-4 w-4" />
              <span>Sync Logs</span>
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/menu-management">
              <Utensils className="h-4 w-4" />
              <span>Menu Management</span>
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/master/brands-branches">
              <Building2 className="h-4 w-4" />
              <span>Branches</span>
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/tables-zones">
              <TableIcon className="h-4 w-4" />
              <span>Table List</span>
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/visual-tables">
              <TableIcon className="h-4 w-4" />
              <span>Visual Tables</span>
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/promotions">
              <Megaphone className="h-4 w-4" />
              <span>Promotions</span>
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/orders">
              <TableIcon className="h-4 w-4" />
              <span>Orders</span>
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/reports">
              <Settings className="h-4 w-4" />
              <span>Reports</span>
            </a>
          </nav>

          {/* Master Settings */}
          <div className="mt-6">
            <div className="text-xs uppercase text-gray-400 mb-2">Master Settings</div>
            <nav className="flex flex-col gap-1 text-sm">
              <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/master/staff">
                <Users className="h-4 w-4" />
                <span>Staff Management</span>
              </a>
              <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/master/roles">
                <Shield className="h-4 w-4" />
                <span>Permissions & Roles</span>
              </a>
            </nav>
          </div>

          {/* Support Section (post-auth) */}
          <div className="mt-6">
            <div className="text-xs uppercase text-gray-400 mb-2">Support</div>
            <nav className="flex flex-col gap-1 text-sm">
              <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="https://sol-crm.alphabits.team/hc/help-center/en/categories/account-login-users-management" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-4 w-4" />
                <span>IT Help Desk</span>
              </a>
              <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="https://sol-crm.alphabits.team/hc/help-center?ref=portal" target="_blank" rel="noopener noreferrer">
                <HelpCircle className="h-4 w-4" />
                <span>FAQ</span>
              </a>
            </nav>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}