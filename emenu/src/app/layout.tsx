import '@/styles/globals.css';
import '@/styles/fonts.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import PublicLayout from './PublicLayout';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';

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

// Check if the current route is the home page
async function isHomePage() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  return pathname === '/';
}

// Check if the current route is an authentication page
async function isAuthPage() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  return pathname === '/login';
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const homePage = await isHomePage();
  const authPage = await isAuthPage();

  if (homePage || authPage) {
    // Use minimal layout for home and auth pages
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased font-sans min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
          <ThemeProvider>
            <AuthProvider>
              <I18nProvider>
                <PublicLayout>
                  {children}
                </PublicLayout>
              </I18nProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  }

  // Simple layout for all other pages (including hub)
return (
  <html lang="en" suppressHydrationWarning>
    <body className="antialiased font-sans min-h-screen">
      <ThemeProvider>
        <AuthProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </AuthProvider>
      </ThemeProvider>
    </body>
  </html>
);
}