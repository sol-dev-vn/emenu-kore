'use client';

import React, { useEffect, useState } from 'react';
import PortalSidebar from '@/components/portal/portal-sidebar';
import { BranchProvider } from '@/contexts/branch-context';
import { AuthProvider } from '@/contexts/auth-context';
import { LoadingProvider } from '@/contexts/loading-context';
import LoadingOverlay from '@/components/ui/loading-overlay';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/contexts/loading-context';
import { useAuth } from '@/contexts/auth-context';

interface BranchItem { id: string; name: string; code: string; display_name?: string; }

function PortalLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading: isPageLoading } = useLoading();
  const { currentUser, isLoading: isAuthLoading, logout, reinitializeAuth } = useAuth();
  const [mounted, setMounted] = useState(false);

  // State for theme
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Expose reinitializeAuth globally for login page
    if (typeof window !== 'undefined') {
      window.reinitializeAuth = reinitializeAuth;
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete window.reinitializeAuth;
      }
    };
  }, [reinitializeAuth]);

  // Auto-collapse sidebar when on Live Dashboard
  useEffect(() => {
    setIsSidebarCollapsed(pathname === '/portal/visual-tables');
  }, [pathname]);

  async function handleLogout() {
    try {
      await logout();
    } catch (e) {
      console.warn('Logout encountered an issue:', e);
    } finally {
      router.push('/login');
    }
  }

  useEffect(() => {
    if (mounted) {
      // Load theme
      loadTheme();
    }
  }, [mounted]);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

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

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Show loading state while authentication is being checked
  if (!mounted || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors">
      <>
        <PortalSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
          currentUser={currentUser}
          onLogout={handleLogout}
          theme={theme}
          onThemeToggle={handleThemeToggle}
        />

        {/* Main content */}
        <main className={`${isSidebarCollapsed ? 'ml-16' : 'ml-72'} flex-1 transition-all duration-300`}>
          <LoadingOverlay isLoading={isPageLoading}>
            {children}
          </LoadingOverlay>
        </main>
      </>
    </div>
  );
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <BranchProvider>
          <PortalLayoutContent>{children}</PortalLayoutContent>
        </BranchProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}