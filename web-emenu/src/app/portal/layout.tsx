'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

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
      <aside className="w-72 bg-white border-r border-gray-200 p-6 hidden md:flex">
        <div className="w-full">
          <div className="text-xl font-bold mb-4">SOL eMenu</div>

          {/* Impersonation section */}
          <div className="mb-6">
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
          <nav className="flex flex-col gap-2 text-sm">
            <a className="text-gray-700 hover:text-black" href="/portal">Dashboard</a>
            <a className="text-gray-700 hover:text-black" href="/portal/branch-settings">Branch Settings</a>
            <a className="text-gray-700 hover:text-black" href="/portal/tables-zones">Table & Zones</a>
            <a className="text-gray-700 hover:text-black" href="/portal/menu-combo">Menu & Combo</a>
            <a className="text-gray-700 hover:text-black" href="/portal/promotions">Promotions & Discount</a>
          </nav>

          {/* Master Settings */}
          <div className="mt-6">
            <div className="text-xs uppercase text-gray-400 mb-2">Master Settings</div>
            <nav className="flex flex-col gap-2 text-sm">
              <a className="text-gray-700 hover:text-black" href="/portal/master/sync-history">Data Sync History</a>
              <a className="text-gray-700 hover:text-black" href="/portal/master/brands-branches">Brands & Branches</a>
              <a className="text-gray-700 hover:text-black" href="/portal/master/staff">Store Manager & Staff</a>
              <a className="text-gray-700 hover:text-black" href="/portal/master/roles">Permission & Roles</a>
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