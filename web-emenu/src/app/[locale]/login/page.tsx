'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next/navigation';

interface ErrorResponse { error?: string }

function LoginPageContent() {
  const t = useTranslations();
  const locale = useLocale();
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
      toast.success(t('auth.success'));
      const redirect = search.get('redirect') || `/${locale}/portal`;
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
      {/* Sidebar - Pre-auth */}
      <aside className="hidden md:flex w-72 bg-gradient-to-b from-orange-50 to-rose-50 border-r border-gray-200 p-6">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <img src="/logo_trim.png" alt="SOL eMenu" className="h-10 w-auto" />
              <div>
                <div className="text-xl font-bold tracking-tight text-gray-900">SOL eMenu</div>
                <div className="text-xs text-gray-500">{t('portal.dashboard')}</div>
              </div>
            </div>
            <button
              onClick={() => router.push(locale === 'en' ? '/vi/login' : '/en/login')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/60 rounded-md transition-colors"
              title={t('auth.language')}
            >
              🌐 {locale === 'en' ? 'EN' : 'VI'}
            </button>
          </div>
          <nav className="flex flex-col gap-2 text-sm text-gray-700">
            <span className="font-semibold text-gray-900">{t('auth.welcomeBack')}</span>
            <span className="text-gray-600">{t('auth.loginDescription')}</span>
          </nav>
          <div className="mt-4">
            <div className="text-xs uppercase text-gray-400 mb-2">Quick Links</div>
            <div className="flex flex-col gap-1 text-sm">
              <a className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/60 hover:text-black" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4"/><path d="M3 15a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4"/><path d="M7 11V7a5 5 0 1 1 10 0v4"/></svg>
                <span>Support</span>
              </a>
              <a className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-white/60 hover:text-black" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10a9 9 0 1 1-18 0"/><path d="M12 6v6l4 2"/></svg>
                <span>Contact</span>
              </a>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-sm">
          <CardHeader>
            <CardTitle>{t('auth.login')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">{t('auth.email')}</Label>
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
                <Label htmlFor="password">{t('auth.password')}</Label>
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
                  {loading ? t('common.loading') : t('auth.login')}
                </Button>
              </div>
            </form>

            <div className="mt-4 flex items-center justify-between">
              <Button variant="link" type="button" onClick={handleForgotPassword} disabled={resetLoading}>
                {resetLoading ? t('common.loading') : t('auth.forgotPassword')}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div>Loading...</div></div>}>
      <LoginPageContent />
    </Suspense>
  );
}