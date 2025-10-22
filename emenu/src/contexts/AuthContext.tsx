'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	role: {
		id: string;
		name: string;
	};
	avatar?: string;
	title?: string;
	description?: string;
	location?: string;
	status: string;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const isAuthenticated = !!user;

	// Check authentication status on mount
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch('/api/auth/me');
				if (response.ok) {
					const data = await response.json();
					if (data.success) {
						setUser(data.user);
					}
				}
			} catch (error) {
				console.error('Auth check error:', error);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	const login = async (email: string, password: string, rememberMe = false) => {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, rememberMe }),
				credentials: 'include',
			});

			const data = await response.json();

			if (data.success) {
				setUser(data.user);
				return { success: true };
			} else {
				return { success: false, error: data.error };
			}
		} catch (error) {
			console.error('Login error:', error);
			return { success: false, error: 'Network error' };
		}
	};

	const logout = async () => {
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			setUser(null);
			// Use window.location for a full page refresh to ensure cookies are properly cleared
			window.location.href = '/login';
		}
	};

	const refreshUser = async () => {
		try {
			const response = await fetch('/api/auth/me', {
				credentials: 'include',
			});
			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					setUser(data.user);
				}
			}
		} catch (error) {
			console.error('Refresh user error:', error);
		}
	};

	// Function to refresh token automatically
	useEffect(() => {
		if (!isAuthenticated) return;

		const interval = setInterval(async () => {
			try {
				const response = await fetch('/api/auth/refresh', {
					method: 'POST',
					credentials: 'include',
				});

				if (!response.ok) {
					// Token refresh failed, logout user
					logout();
				}
			} catch (error) {
				console.error('Token refresh error:', error);
				logout();
			}
		}, 14 * 60 * 1000); // Refresh every 14 minutes (tokens expire after 15)

		return () => clearInterval(interval);
	}, [isAuthenticated]);

	const value: AuthContextType = {
		user,
		isLoading,
		isAuthenticated,
		login,
		logout,
		refreshUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};