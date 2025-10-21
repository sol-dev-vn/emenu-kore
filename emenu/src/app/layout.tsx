import '@/styles/globals.css';
import '@/styles/fonts.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import PublicLayout from './PublicLayout';
import VisualEditingLayout from '@/components/layout/VisualEditingLayout';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { fetchSiteData } from '@/lib/directus/fetchers';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { globals } = await fetchSiteData();

    const siteTitle = globals?.title || 'SOL eMenu';
    const siteDescription = globals?.description || 'Digital menu experience powered by SOL';
    const faviconURL = globals?.favicon ? getDirectusAssetURL(globals.favicon) : '/favicon.ico';

    return {
      title: {
        default: siteTitle,
        template: `%s | ${siteTitle}`,
      },
      description: siteDescription,
      icons: {
        icon: faviconURL,
      },
    };
  } catch (error) {
    // Fallback metadata if Directus is not available
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
        <body className="antialiased font-sans min-h-screen bg-gradient-to-br from-[#9B1D20] via-[#7a1618] to-[#5a0f10]">
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

  try {
    const { globals, headerNavigation, footerNavigation } = await fetchSiteData();
    const accentColor = globals?.accent_color || '#6644ff';

    return (
      <html lang="en" style={{ '--accent-color': accentColor } as React.CSSProperties} suppressHydrationWarning>
        <body className="antialiased font-sans flex flex-col min-h-screen">
          <ThemeProvider>
            <AuthProvider>
              <I18nProvider>
                <VisualEditingLayout
                  headerNavigation={headerNavigation}
                  footerNavigation={footerNavigation}
                  globals={globals}
                >
                  <main className="flex-grow">{children}</main>
                </VisualEditingLayout>
              </I18nProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  } catch (error) {
    // Fallback layout if Directus is not available
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased font-sans flex flex-col min-h-screen">
          <ThemeProvider>
            <AuthProvider>
              <I18nProvider>
                <main className="flex-grow">{children}</main>
              </I18nProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    );
  }
}