'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { directusClient } from '@/lib/directus';
import type { User as DirectusUser } from '@/lib/directus';

interface AuthContextType {
  currentUser: DirectusUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  reinitializeAuth: () => Promise<void>;
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<DirectusUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get access token from cookies
  const getAccessToken = (): string | null => {
    const allCookies = document.cookie;
    console.debug('Auth: Available cookies:', allCookies);
    console.debug('Auth: Cookie count:', allCookies.split(';').filter(c => c.trim()).length);

    const match = allCookies.match(/(?:^|; )directus_access_token=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    console.debug('Auth: Extracted access token length:', token ? token.length : 0);
    console.debug('Auth: Access token exists:', !!token);

    // Additional debugging for cookie availability
    if (allCookies.includes('directus_')) {
      console.debug('Auth: Found Directus cookies in document.cookie');
    } else {
      console.warn('Auth: No Directus cookies found in document.cookie');
    }

    return token;
  };

  // Get refresh token from cookies
  const getRefreshToken = (): string | null => {
    const match = document.cookie.match(/(?:^|; )directus_refresh_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  // Check if we have a valid session
  const checkSession = async (): Promise<boolean> => {
    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      console.debug('Auth: Checking session...');
      console.debug('Auth: Access token exists:', !!accessToken);
      console.debug('Auth: Refresh token exists:', !!refreshToken);

      if (!accessToken) {
        console.warn('Auth: No access token found');
        return false;
      }

      // Set the access token on the client
      directusClient.setAccessToken(accessToken);
      console.debug('Auth: Set access token on Directus client');

      // Try to get current user to validate token
      const userRes = await directusClient.getCurrentUser();
      if (userRes?.data) {
        console.debug('Auth: Successfully retrieved user data:', userRes.data.email);
        setCurrentUser(userRes.data);
        return true;
      }

      return false;
    } catch (err) {
      console.warn('Session validation failed:', err);

      // If access token is invalid, try to refresh
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const refreshRes = await directusClient.refresh(refreshToken);
          if (refreshRes?.data?.access_token) {
            // Update the access token cookie
            document.cookie = `directus_access_token=${refreshRes.data.access_token}; path=/; max-age=${refreshRes.data.expires}`;
            directusClient.setAccessToken(refreshRes.data.access_token);

            // Try getting user again
            const userRes = await directusClient.getCurrentUser();
            if (userRes?.data) {
              setCurrentUser(userRes.data);
              return true;
            }
          }
        } catch (refreshErr) {
          console.warn('Token refresh failed:', refreshErr);
        }
      }

      return false;
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const isValid = await checkSession();
      if (!isValid) {
        setError('Session expired');
        setCurrentUser(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh user data';

      // Special handling for permission errors
      if (errorMessage.includes('403') || errorMessage.includes('permission')) {
        setError('Your account lacks necessary permissions. Please contact your administrator.');
      } else {
        setError(errorMessage);
      }

      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Force re-initialize authentication (useful after login)
  const reinitializeAuth = async (): Promise<void> => {
    console.debug('Auth: Reinitializing authentication...');
    setIsLoading(true);
    setError(null);

    try {
      // Add delay to ensure cookies are available
      await new Promise(resolve => setTimeout(resolve, 200));

      const isValid = await checkSession();
      if (!isValid) {
        setError('No valid session found');
        setCurrentUser(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication re-initialization failed';
      setError(errorMessage);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await directusClient.logout(refreshToken);
      }
    } catch (err) {
      console.warn('Logout API call failed:', err);
    } finally {
      // Always clear local state and cookies
      setCurrentUser(null);
      setError(null);

      // Clear auth cookies
      document.cookie = 'directus_access_token=; path=/; max-age=0';
      document.cookie = 'directus_refresh_token=; path=/; max-age=0';

      // Clear token from client
      directusClient.setAccessToken('');
    }
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Add a small delay to ensure cookies are available after login
        await new Promise(resolve => setTimeout(resolve, 100));

        const isValid = await checkSession();
        if (!isValid) {
          setError('No valid session found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication check failed');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for storage events (for cross-tab auth state sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_state_change') {
        refreshUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Periodic session validation (every 5 minutes)
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(async () => {
      const isValid = await checkSession();
      if (!isValid) {
        await logout();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [currentUser]);

  const value: AuthContextType = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    error,
    refreshUser,
    logout,
    reinitializeAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}