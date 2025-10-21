'use client';

import { ReactNode } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary via-[#7a1618] to-[#5a0f10]">
      {children}
    </div>
  );
}