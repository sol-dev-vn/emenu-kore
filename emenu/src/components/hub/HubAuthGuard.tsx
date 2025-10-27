'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingPage from '@/components/ui/LoadingPage';

interface HubAuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

export default function HubAuthGuard({
  children,
  requiredRoles = [],
  fallbackPath = '/login'
}: HubAuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(fallbackPath);
      return;
    }

    // Check role-based access if roles are specified
    if (user && requiredRoles.length > 0 && !requiredRoles.includes(user.role || '')) {
      router.push('/hub'); // Redirect to hub dashboard if insufficient permissions
      return;
    }
  }, [user, isLoading, router, requiredRoles, fallbackPath]);

  // Show loading page while checking authentication
  if (isLoading) {
    return <LoadingPage />;
  }

  // Don't render anything if not authenticated or insufficient permissions
  if (!user || (requiredRoles.length > 0 && !requiredRoles.includes(user.role || ''))) {
    return null;
  }

  return <>{children}</>;
}