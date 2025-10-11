'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Home, Settings, Table as TableIcon, Utensils, Megaphone, History, Building2, Users, Shield, MessageSquare, HelpCircle } from 'lucide-react';

interface BranchItem { id: string; name: string; code: string; }

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
      setSelectedBranchName(br ? `${br.name} (${br.code})` : value);
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
          ? json.data.map((b: { id: string; name: string; code: string }) => ({ id: b.id, name: b.name, code: b.code }))
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

  async function handleBranchChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const branchId = e.target.value || '';
    try {
      await fetch('/api/auth/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch_id: branchId })
      });
      setSelectedBranchId(branchId || null);
      const br = branches.find(b => b.id === branchId);
      setSelectedBranchName(br ? `${br.name} (${br.code})` : branchId || 'None');
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

          {/* Impersonation section */}
          <div className="mb-6 rounded-lg bg-white/70 border border-gray-200 p-3">
            <div className="text-xs uppercase text-gray-400">Impersonation</div>
            <div className="mt-2 text-sm">Current Branch:</div>
            <div className="mt-1 text-sm font-medium">{selectedBranchName}</div>
            <div className="mt-2">
              <select className="w-full border rounded px-2 py-1 text-sm" value={selectedBranchId || ''} onChange={handleBranchChange}>
                <option value="">None (All)</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary sections */}
          <nav className="flex flex-col gap-1 text-sm">
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/branch-settings">
              <Settings className="h-4 w-4" />
              <span>Branch Settings</span>
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/tables-zones">
              <TableIcon className="h-4 w-4" />
              <span>Table & Zones</span>
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/menu-combo">
              <Utensils className="h-4 w-4" />
              <span>Menu & Combo</span>
            </a>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/promotions">
              <Megaphone className="h-4 w-4" />
              <span>Promotions & Discount</span>
            </a>
          </nav>

          {/* Master Settings */}
          <div className="mt-6">
            <div className="text-xs uppercase text-gray-400 mb-2">Master Settings</div>
            <nav className="flex flex-col gap-1 text-sm">
              <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/master/sync-history">
                <History className="h-4 w-4" />
                <span>Data Sync History</span>
              </a>
              <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/master/brands-branches">
                <Building2 className="h-4 w-4" />
                <span>Brands & Branches</span>
              </a>
              <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/master/staff">
                <Users className="h-4 w-4" />
                <span>Store Manager & Staff</span>
              </a>
              <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="/portal/master/roles">
                <Shield className="h-4 w-4" />
                <span>Permission & Roles</span>
              </a>
            </nav>
          </div>

          {/* Support Section (post-auth) */}
          <div className="mt-6">
            <div className="text-xs uppercase text-gray-400 mb-2">Support</div>
            <nav className="flex flex-col gap-1 text-sm">
              <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="#">
                <MessageSquare className="h-4 w-4" />
                <span>IT Help Desk Chat</span>
              </a>
              <a className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-white/60 hover:text-black" href="#">
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