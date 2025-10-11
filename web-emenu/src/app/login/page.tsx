'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ErrorResponse { error?: string }

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    // Load available OAuth providers
    fetch('/api/auth/providers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.providers)) setProviders(data.providers);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data: ErrorResponse = await res.json().catch(() => ({} as ErrorResponse));
        throw new Error(data.error || 'Invalid credentials');
      }
      toast.success('Logged in successfully');
      const redirect = search.get('redirect') || '/portal';
      router.push(redirect);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      return toast.error('Please enter your email to reset password');
    }
    setResetLoading(true);
    try {
      const reset_url = `${window.location.origin}/reset-password`;
      const res = await fetch('/api/auth/password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reset_url }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send reset email');
      }
      toast.success('Password reset email sent. Check your inbox.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar skeleton */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex flex-col gap-4 w-full">
          <div className="text-xl font-bold">SOL eMenu</div>
          <nav className="flex flex-col gap-2 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Restaurant Portal</span>
            <span>Manage branches</span>
            <span>Menu & items</span>
            <span>Orders</span>
            <span>Staff</span>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-sm">
          <CardHeader>
            <CardTitle>Login to Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </form>

            <div className="mt-4 flex items-center justify-between">
              <Button variant="link" type="button" onClick={handleForgotPassword} disabled={resetLoading}>
                {resetLoading ? 'Sending...' : 'Forgot Password?'}
              </Button>
            </div>

            {providers.length > 0 && (
              <div className="mt-6">
                <div className="text-sm text-gray-600 mb-2">Or sign in with</div>
                <div className="flex flex-wrap gap-2">
                  {providers.map((p) => (
                    <Button key={p} variant="outline" type="button" onClick={() => router.push(`/api/auth/oauth/${p}`)}>
                      {p}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}