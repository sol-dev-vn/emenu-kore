'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasRole } from '@/lib/auth';

interface WithRoleAccessProps {
	allowedRoles: string | string[];
	children: React.ReactNode;
	fallback?: React.ReactNode;
	redirectTo?: string;
}

export const WithRoleAccess = ({
	allowedRoles,
	children,
	fallback = <div>You don't have permission to access this page.</div>,
	redirectTo = '/hub',
}: WithRoleAccessProps) => {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && user) {
			if (!hasRole(user.role.name, allowedRoles)) {
				router.push(redirectTo);
			}
		}
	}, [user, isLoading, router, allowedRoles, redirectTo]);

	if (isLoading) {
		return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
	}

	if (!user) {
		return <div className="flex items-center justify-center min-h-screen">Please log in.</div>;
	}

	if (!hasRole(user.role.name, allowedRoles)) {
		return <div className="flex items-center justify-center min-h-screen">{fallback}</div>;
	}

	return <>{children}</>;
};

// Hook for checking if user has specific role
export const useRoleAccess = (requiredRoles: string | string[]) => {
	const { user } = useAuth();
	
	if (!user) {
		return false;
	}
	
	return hasRole(user.role.name, requiredRoles);
};

// Hook for checking if user can perform specific action on a resource
export const useResourceAccess = (resource: string, action: string = 'read') => {
	const { user } = useAuth();
	
	if (!user) {
		return false;
	}
	
	// Import canAccessResource dynamically to avoid SSR issues
	const { canAccessResource } = require('@/lib/auth');
	return canAccessResource(user.role.name, resource, action);
};