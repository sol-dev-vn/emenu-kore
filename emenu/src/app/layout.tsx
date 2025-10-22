import '@/styles/globals.css';
import '@/styles/fonts.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import PublicLayout from './PublicLayout';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { isPublicLayout } from '@/lib/layout-utils';

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

  const usePublicLayout = isPublicLayout(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <ThemeProvider>
          <AuthProvider>
            <I18nProvider>
              {usePublicLayout ? (
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