/**
 * Layout routing utilities to determine which layout to use based on path
 */

export type LayoutType = 'public' | 'hub' | 'default';

/**
 * Determines the layout type based on the pathname
 */
export function getLayoutType(pathname: string): LayoutType {
  // Public pages that use the centered public layout
  if (pathname === '/' || pathname === '/login' || pathname.startsWith('/qr')) {
    return 'public';
  }

  // Hub pages (admin dashboard)
  if (pathname.startsWith('/hub')) {
    return 'hub';
  }

  // Default layout for all other pages
  return 'default';
}

/**
 * Checks if a path should use the public layout
 */
export function isPublicLayout(pathname: string): boolean {
  return getLayoutType(pathname) === 'public';
}

/**
 * Checks if a path is a hub page
 */
export function isHubPage(pathname: string): boolean {
  return getLayoutType(pathname) === 'hub';
}