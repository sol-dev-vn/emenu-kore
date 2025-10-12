'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('dev@sol.com.vn');
  const [password, setPassword] = useState('adminuser');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('=== TEST LOGIN START ===');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Current cookies:', document.cookie);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setResult(data);

      // Check cookies after login
      setTimeout(() => {
        console.log('Cookies after login:', document.cookie);
        console.log('Has access token:', document.cookie.includes('directus_access_token'));
        console.log('Has refresh token:', document.cookie.includes('directus_refresh_token'));
        console.log('=== TEST LOGIN END ===');
      }, 100);

    } catch (err) {
      console.error('Test login error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const checkCookies = () => {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const directusCookies = cookies.filter(c => c.startsWith('directus_'));

    console.log('=== COOKIE CHECK ===');
    console.log('All cookies:', cookies);
    console.log('Directus cookies:', directusCookies);
    console.log('Access token present:', document.cookie.includes('directus_access_token'));
    console.log('Refresh token present:', document.cookie.includes('directus_refresh_token'));

    alert(`Directus cookies found: ${directusCookies.length}\n\n${directusCookies.join('\n')}`);
  };

  const testAuthContext = () => {
    // Test if auth context functions are available
    console.log('=== AUTH CONTEXT TEST ===');
    console.log('window.reinitializeAuth available:', !!window.reinitializeAuth);

    if (window.reinitializeAuth) {
      window.reinitializeAuth();
    } else {
      alert('window.reinitializeAuth not available - need to visit portal page first');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Test Login Page</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Testing...' : 'Test Login'}
            </button>

            <button
              onClick={checkCookies}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Check Cookies
            </button>

            <button
              onClick={testAuthContext}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Test Auth Context
            </button>

            <button
              onClick={() => router.push('/portal/debug')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Go to Debug Page
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h3 className="font-medium text-green-800 mb-2">Success!</h3>
            <pre className="text-sm text-green-700 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <h3 className="font-medium text-red-800 mb-2">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h3 className="font-medium text-blue-800 mb-2">Instructions</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Open browser developer console (F12)</li>
            <li>2. Click "Test Login" to test the API call</li>
            <li>3. Click "Check Cookies" to see what cookies are set</li>
            <li>4. Click "Test Auth Context" to test auth re-initialization</li>
            <li>5. Click "Go to Debug Page" to check auth state</li>
            <li>6. Watch console logs for detailed debugging info</li>
          </ol>
        </div>
      </div>
    </div>
  );
}