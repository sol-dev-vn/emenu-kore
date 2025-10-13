import { cookies } from 'next/headers';

// Token management utilities
export const getToken = async (tokenName: 'access_token' | 'refresh_token') => {
	const cookieStore = await cookies();
	return cookieStore.get(tokenName)?.value;
};

export const setToken = async (
	tokenName: 'access_token' | 'refresh_token',
	tokenValue: string,
	maxAge: number
) => {
	const cookieStore = await cookies();
	cookieStore.set(tokenName, tokenValue, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge,
		path: '/',
	});
};

export const clearTokens = async () => {
	const cookieStore = await cookies();
	cookieStore.delete('access_token');
	cookieStore.delete('refresh_token');
};

// Role-based access control utilities
export const hasRole = (userRole: string, requiredRoles: string | string[]) => {
	if (Array.isArray(requiredRoles)) {
		return requiredRoles.includes(userRole);
	}
	return userRole === requiredRoles;
};

export const canAccessResource = (
	userRole: string,
	resource: string,
	action: string = 'read'
) => {
	// Define role permissions
	const permissions: Record<string, Record<string, string[]>> = {
		Administrator: {
			restaurants: ['read', 'write', 'delete'],
			menus: ['read', 'write', 'delete'],
			staff: ['read', 'write', 'delete'],
			reports: ['read', 'write', 'delete'],
			settings: ['read', 'write', 'delete'],
		},
		Manager: {
			restaurants: ['read', 'write'],
			menus: ['read', 'write'],
			staff: ['read', 'write'],
			reports: ['read'],
		},
		Staff: {
			restaurants: ['read'],
			menus: ['read', 'write'],
			staff: ['read'],
		},
	};

	// Check if user has permission for the specific resource and action
	return permissions[userRole]?.[resource]?.includes(action) || false;
};

// Authentication check for API routes
export const isAuthenticated = async () => {
	const token = await getToken('access_token');
	return !!token;
};

// Get user agent information for logging
export const getUserAgent = (request: Request) => {
	return request.headers.get('user-agent') || 'unknown';
};

// Get client IP for logging
export const getClientIP = (request: Request) => {
	const forwarded = request.headers.get('x-forwarded-for');
	const realIP = request.headers.get('x-real-ip');
	
	if (forwarded) {
		return forwarded.split(',')[0].trim();
	}
	
	if (realIP) {
		return realIP;
	}
	
	return 'unknown';
};