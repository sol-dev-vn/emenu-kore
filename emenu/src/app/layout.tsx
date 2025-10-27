import '@/styles/globals.css';
import '@/styles/fonts.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import PublicLayout from './PublicLayout';
import HubLayout from '@/components/hub/HubLayout';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { getLayoutType } from '@/lib/layout-utils';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: 'SOL eMenu',
      template: `%s | SOL eMenu`,
    },
    description: 'Digital menu experience powered by SOL',
    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';

  const layoutType = getLayoutType(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-white text-gray-900">
        <ThemeProvider>
          <AuthProvider>
            <I18nProvider>
              {layoutType === 'public' ? (
                <PublicLayout>
                  {children}
                </PublicLayout>
              ) : (
                children
              )}
            </I18nProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}