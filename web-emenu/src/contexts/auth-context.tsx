'use client';

// Augment Window type to avoid using `any` when attaching helpers
declare global {
  interface Window {
    reinitializeAuth?: () => Promise<void>;
    setAuthTokens?: (accessToken: string, refreshToken?: string | null) => void;
    __authTokens?: { accessToken: string; refreshToken?: string | null };
  }
}

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
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

  // In-memory tokens for Option B (Authorization header on frontend)
  const accessTokenRef = useRef<string | null>(null);
  const refreshTokenRef = useRef<string | null>(null);

  // Allow setting tokens from login flows (without persisting to storage)
  const setAuthTokens = (accessToken: string, refreshToken?: string | null) => {
    accessTokenRef.current = accessToken || null;
    refreshTokenRef.current = refreshToken ?? null;
    // Set token into Directus client to enable Authorization header
    directusClient.setAccessToken(accessToken || '');
    console.debug('Auth: In-memory tokens set. Access length:', accessToken?.length || 0);
  };

  // Get access token from cookies (dev-only) or in-memory ref
  const getAccessToken = (): string | null => {
    if (accessTokenRef.current) return accessTokenRef.current;

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

  // Get refresh token from in-memory ref first, then cookies
  const getRefreshToken = (): string | null => {
    if (refreshTokenRef.current) return refreshTokenRef.current;
    const match = document.cookie.match(/(?:^|; )directus_refresh_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  // Check if we have a valid session
  const checkSession = async (): Promise<boolean> => {
    // Prefer direct Directus call if we have an in-memory access token (Option B)
    if (accessTokenRef.current) {
      try {
        const userRes = await directusClient.getCurrentUser();
        if (userRes?.data) {
          console.debug('Auth: Directus user via Authorization header:', userRes.data.email);
          setCurrentUser(userRes.data);
          return true;
        }
      } catch (err) {
        console.warn('Auth: Directus /users/me failed with current token. Attempting refresh...', err);
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          try {
            const refreshRes = await directusClient.refresh(refreshToken);
            if (refreshRes?.data?.access_token) {
              setAuthTokens(refreshRes.data.access_token, refreshToken);
              const userRes = await directusClient.getCurrentUser();
              if (userRes?.data) {
                setCurrentUser(userRes.data);
                return true;
              }
            }
          } catch (refreshErr) {
            console.warn('Auth: Token refresh failed:', refreshErr);
          }
        }
        // Fall through to server-side validation next
      }
    }

    try {
      console.debug('Auth: Checking session via internal API (/api/auth/me)');

      // Prefer server-side session validation so we can use HttpOnly cookies
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json().catch(() => ({ data: null }));
        if (json && json.data) {
          console.debug('Auth: /api/auth/me returned user:', json.data.email);
          setCurrentUser(json.data);
          return true;
        }
        console.warn('Auth: /api/auth/me returned no user data');
        return false;
      }

      if (res.status === 401) {
        console.warn('Auth: /api/auth/me responded 401 (Unauthorized)');
        return false;
      }

      // If internal route failed unexpectedly, fall back to client-side token check
      console.warn('Auth: /api/auth/me failed, falling back to client-side token check');
    } catch (err) {
      console.warn('Auth: Error calling /api/auth/me, falling back:', err);
    }

    // Fallback path: try reading non-HttpOnly cookies (dev-only) and hitting Directus directly
    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      console.debug('Auth (fallback): Access token exists:', !!accessToken);
      console.debug('Auth (fallback): Refresh token exists:', !!refreshToken);

      if (!accessToken) {
        console.warn('Auth (fallback): No access token found');
        return false;
      }

      directusClient.setAccessToken(accessToken);
      const userRes = await directusClient.getCurrentUser();
      if (userRes?.data) {
        console.debug('Auth (fallback): Retrieved user:', userRes.data.email);
        setCurrentUser(userRes.data);
        return true;
      }
    } catch (err) {
      console.warn('Auth (fallback): Session validation failed:', err);

      // Try refresh if possible
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const refreshRes = await directusClient.refresh(refreshToken);
          if (refreshRes?.data?.access_token) {
            // Do NOT persist new token to cookie; keep in memory only for Option B
            setAuthTokens(refreshRes.data.access_token, refreshToken);
            const userRes = await directusClient.getCurrentUser();
            if (userRes?.data) {
              setCurrentUser(userRes.data);
              return true;
            }
          }
        } catch (refreshErr) {
          console.warn('Auth (fallback): Token refresh failed:', refreshErr);
        }
      }
    }

    return false;
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

    const attempt = async () => {
      try {
        const isValid = await checkSession();
        if (!isValid) {
          setError('No valid session found');
          setCurrentUser(null);
          return false;
        }
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication re-initialization failed';
        setError(errorMessage);
        setCurrentUser(null);
        return false;
      }
    };

    // Small retry/backoff to allow HttpOnly cookies to be set by the server
    // Attempts at ~150ms, ~350ms, ~700ms intervals
    const delays = [150, 350, 700];
    let success = false;

    // Initial tiny delay to let cookies propagate
    await new Promise(resolve => setTimeout(resolve, 100));

    for (const delay of delays) {
      success = await attempt();
      if (success) break;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    setIsLoading(false);
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

      // Clear in-memory tokens and client token
      accessTokenRef.current = null;
      refreshTokenRef.current = null;
      directusClient.setAccessToken('');
    }
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // If login page saved tokens on window for navigation, read them once
        if (typeof window !== 'undefined' && window.__authTokens?.accessToken) {
          console.debug('Auth: Found window.__authTokens, seeding in-memory tokens');
          setAuthTokens(window.__authTokens.accessToken, window.__authTokens.refreshToken);
          try { delete window.__authTokens; } catch { /* noop */ }
        }

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

  // Expose reinitializeAuth and setAuthTokens globally so non-context pages (e.g., login) can trigger them
  useEffect(() => {
    window.reinitializeAuth = reinitializeAuth;
    window.setAuthTokens = setAuthTokens;
    return () => {
      try { delete window.reinitializeAuth; } catch { /* noop */ }
      try { delete window.setAuthTokens; } catch { /* noop */ }
    };
  }, [reinitializeAuth]);

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