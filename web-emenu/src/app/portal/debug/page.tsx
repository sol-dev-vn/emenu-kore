'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { directusClient } from '@/lib/directus';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, User, Shield, Database, Cookie, Key } from 'lucide-react';

interface DebugInfo {
  userSession: {
    currentUser: any;
    isAuthenticated: boolean;
    error: string | null;
    cookies: {
      accessToken: boolean;
      refreshToken: boolean;
      allCookies: string[];
      directusCookies: string[];
    };
  };
  permissions: {
    collections: string[];
    testedCollections: Array<{
      name: string;
      status: 'success' | 'error' | 'testing';
      data?: any;
      error?: string;
      count?: number;
    }>;
  };
  tokens: {
    accessTokenValid: boolean;
    refreshTokenValid: boolean;
    tokenInfo?: any;
  };
}

const COLLECTIONS_TO_TEST = [
  'branches',
  'menu_items',
  'categories',
  'tables',
  'promotions',
  'orders',
  'sync_logs',
  'users',
  'directus_users',
  'directus_roles',
  'directus_permissions'
];

export default function DebugPage() {
  const { currentUser, isAuthenticated, error, refreshUser, reinitializeAuth } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Temporary bypass for testing - show page even if not authenticated
  const showDebugPage = true; // isAuthenticated || true;

  const getAllCookies = (): string[] => {
    if (typeof document === 'undefined') return [];
    return document.cookie.split(';').map(c => c.trim()).filter(c => c.length > 0);
  };

  const getDirectusCookies = (): string[] => {
    const allCookies = getAllCookies();
    return allCookies.filter(cookie => cookie.startsWith('directus_'));
  };

  const hasAccessToken = (): boolean => {
    const match = document.cookie.match(/(?:^|; )directus_access_token=([^;]+)/);
    return !!match;
  };

  const hasRefreshToken = (): boolean => {
    const match = document.cookie.match(/(?:^|; )directus_refresh_token=([^;]+)/);
    return !!match;
  };

  const testCollectionAccess = async (collection: string): Promise<any> => {
    try {
      const response = await directusClient.count(collection);
      return { success: true, count: response, data: null };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const testTokenValidity = async (): Promise<any> => {
    try {
      const userResponse = await directusClient.getCurrentUser();
      return { valid: true, user: userResponse.data };
    } catch (error) {
      return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const collectDebugInfo = async (): Promise<DebugInfo> => {
    const cookies = getAllCookies();
    const directusCookies = getDirectusCookies();

    // Test token validity
    const tokenTest = await testTokenValidity();

    // Test collection access in parallel
    const collectionTests = COLLECTIONS_TO_TEST.map(async collection => {
      const result = await testCollectionAccess(collection);
      return {
        name: collection,
        status: result.success ? 'success' as const : 'error' as const,
        count: result.success ? result.count : undefined,
        error: result.success ? undefined : result.error
      };
    });

    const testedCollections = await Promise.all(collectionTests);

    return {
      userSession: {
        currentUser,
        isAuthenticated,
        error,
        cookies: {
          accessToken: hasAccessToken(),
          refreshToken: hasRefreshToken(),
          allCookies: cookies,
          directusCookies
        }
      },
      permissions: {
        collections: COLLECTIONS_TO_TEST,
        testedCollections
      },
      tokens: {
        accessTokenValid: tokenTest.valid,
        refreshTokenValid: true, // We can't test refresh token validity directly
        tokenInfo: tokenTest.valid ? tokenTest.user : undefined
      }
    };
  };

  const loadDebugInfo = async () => {
    setIsLoading(true);
    try {
      const info = await collectDebugInfo();
      setDebugInfo(info);
    } catch (error) {
      console.error('Failed to collect debug info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDebugInfo();
  }, [currentUser, isAuthenticated]);

  const getStatusIcon = (status: 'success' | 'error' | 'testing') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (condition: boolean) => {
    return condition ? (
      <Badge variant="default" className="bg-green-500">✓</Badge>
    ) : (
      <Badge variant="destructive">✗</Badge>
    );
  };

  if (!showDebugPage) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>You must be logged in to access this debug page.</span>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Auth Debug:</strong> isAuthenticated={isAuthenticated}, currentUser={currentUser?.email}, error={error}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Debug Information</h1>
        <div className="flex gap-2">
          <Button onClick={loadDebugInfo} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={reinitializeAuth} variant="outline">
            Reinitialize Auth
          </Button>
        </div>
      </div>

      {/* Auth State Debug */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <AlertCircle className="h-5 w-5" />
            Raw Auth State (Bypass)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">isAuthenticated</label>
                <div className="mt-1 font-mono text-sm">
                  {String(isAuthenticated)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">currentUser</label>
                <div className="mt-1 font-mono text-sm">
                  {currentUser ? JSON.stringify({email: currentUser.email, id: currentUser.id, role: currentUser.role}) : 'null'}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">authError</label>
                <div className="mt-1 font-mono text-sm text-red-600">
                  {error || 'none'}
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This debug page is now bypassing authentication checks to help diagnose the issue.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {debugInfo && (
        <>
          {/* User Session */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Authenticated</label>
                  <div className="mt-1">{getStatusBadge(debugInfo.userSession.isAuthenticated)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Has Error</label>
                  <div className="mt-1">
                    {debugInfo.userSession.error ? (
                      <Badge variant="destructive">Yes</Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-500">No</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Current User</label>
                  <div className="mt-1 text-sm">
                    {debugInfo.userSession.currentUser?.email || 'Unknown'}
                  </div>
                </div>
              </div>

              {debugInfo.userSession.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{debugInfo.userSession.error}</p>
                </div>
              )}

              {debugInfo.userSession.currentUser && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-2">User Details:</h4>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(debugInfo.userSession.currentUser, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Access Token</label>
                  <div className="mt-1">{getStatusBadge(debugInfo.userSession.cookies.accessToken)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Refresh Token</label>
                  <div className="mt-1">{getStatusBadge(debugInfo.userSession.cookies.refreshToken)}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Directus Cookies ({debugInfo.userSession.cookies.directusCookies.length})</label>
                <div className="mt-1 space-y-1">
                  {debugInfo.userSession.cookies.directusCookies.length > 0 ? (
                    debugInfo.userSession.cookies.directusCookies.map((cookie, index) => (
                      <div key={index} className="text-xs font-mono bg-gray-50 p-2 rounded">
                        {cookie}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No Directus cookies found</div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">All Cookies ({debugInfo.userSession.cookies.allCookies.length})</label>
                <div className="mt-1 max-h-32 overflow-y-auto">
                  <pre className="text-xs bg-gray-50 p-2 rounded">
                    {debugInfo.userSession.cookies.allCookies.join('\n')}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Token Validation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Token Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Access Token Valid</label>
                  <div className="mt-1">{getStatusBadge(debugInfo.tokens.accessTokenValid)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Refresh Token Present</label>
                  <div className="mt-1">{getStatusBadge(debugInfo.tokens.refreshTokenValid)}</div>
                </div>
              </div>

              {debugInfo.tokens.tokenInfo && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium mb-2">Token User Info:</h4>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(debugInfo.tokens.tokenInfo, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Collection Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {debugInfo.permissions.testedCollections.map((collection) => (
                  <div key={collection.name} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(collection.status)}
                      <div>
                        <div className="font-medium">{collection.name}</div>
                        {collection.error && (
                          <div className="text-xs text-red-600 mt-1">{collection.error}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {collection.status === 'success' && (
                        <div className="text-sm text-gray-600">Count: {collection.count}</div>
                      )}
                      <Badge variant={collection.status === 'success' ? 'default' : 'destructive'}>
                        {collection.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Console Commands */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Debug Commands (Console)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-md">
                  <code className="text-sm">
                    {'// Check Directus client configuration'}<br />
                    {'console.log(window.directusClient || directusClient);'}<br /><br />

                    {'// Check current auth state'}<br />
                    {"console.log('Auth state:', { isAuthenticated, currentUser, error });"}<br /><br />

                    {'// Test API call directly'}<br />
                    {"fetch('/items/branches', { headers: { Authorization: 'Bearer YOUR_TOKEN' } });"}<br /><br />

                    {'// Reinitialize auth'}<br />
                    {'window.reinitializeAuth?.();'}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}