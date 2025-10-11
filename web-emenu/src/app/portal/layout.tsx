'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:flex">
        <div className="w-full">
          <div className="text-xl font-bold mb-4">SOL eMenu</div>
          <nav className="flex flex-col gap-2 text-sm">
            <a className="text-gray-700 hover:text-black" href="/portal">Dashboard</a>
            <a className="text-gray-700 hover:text-black" href="/portal/branches">Branches</a>
            <a className="text-gray-700 hover:text-black" href="/portal/menu">Menu</a>
            <a className="text-gray-700 hover:text-black" href="/portal/orders">Orders</a>
            <a className="text-gray-700 hover:text-black" href="/portal/staff">Staff</a>
          </nav>
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