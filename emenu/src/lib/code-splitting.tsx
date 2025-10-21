'use client';

import { lazy } from 'react';
import { lazyLoadComponent } from '@/lib/performance';

// Lazy load heavy components
export const LazyQRCodeGenerator = lazyLoadComponent(() =>
  import('@/components/hub/QRCodeGenerator')
);

export const LazyTableLayoutEditor = lazyLoadComponent(() =>
  import('@/components/hub/TableLayoutEditor')
);

export const LazyMenuEditor = lazyLoadComponent(() =>
  import('@/components/hub/MenuEditor')
);

export const LazyDataVisualization = lazyLoadComponent(() =>
  import('@/components/charts/DataVisualization')
);

export const LazyBrandAnalytics = lazyLoadComponent(() =>
  import('@/components/hub/BrandAnalytics')
);

export const LazyAdvancedSearch = lazyLoadComponent(() =>
  import('@/components/ui/advanced-search')
);

export const LazyImageGallery = lazyLoadComponent(() =>
  import('@/components/ui/image-gallery')
);

// Route-based code splitting
export const LazyBranchesPage = lazyLoadComponent(() =>
  import('@/app/hub/branches/page')
);

export const LazyMenusPage = lazyLoadComponent(() =>
  import('@/app/hub/menus/page')
);

export const LazyQRPage = lazyLoadComponent(() =>
  import('@/app/hub/qr/page')
);

export const LazyLayoutsPage = lazyLoadComponent(() =>
  import('@/app/hub/layouts/page')
);

export const LazyProfilePage = lazyLoadComponent(() =>
  import('@/app/hub/profile/page')
);

export const LazySettingsPage = lazyLoadComponent(() =>
  import('@/app/hub/settings/page')
);

// Preload critical routes
export function preloadRoutes() {
  if (typeof window !== 'undefined') {
    // Preload dashboard
    import('@/app/hub/page');

    // Preload commonly used components
    import('@/components/hub/BranchCard');
    import('@/components/hub/BrandGroup');
    import('@/components/ui/search-filter');
  }
}

// Dynamic imports based on user interaction
export const dynamicImports = {
  // Load chart components only when needed
  loadCharts: () => import('@/components/charts/SimpleBarChart'),

  // Load form components only when needed
  loadForms: () => import('@/components/ui/form'),

  // Load modal components only when needed
  loadModals: () => import('@/components/ui/modal'),

  // Load advanced search only when needed
  loadSearch: () => import('@/components/ui/advanced-search'),

  // Load file upload only when needed
  loadFileUpload: () => import('@/components/ui/file-upload')
};

// Component wrapper for lazy loading with loading state
export function LazyWrapper({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <React.Suspense
      fallback={
        fallback || (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
          </div>
        )
      }
    >
      {children}
    </React.Suspense>
  );
}

export default {
  LazyQRCodeGenerator,
  LazyTableLayoutEditor,
  LazyMenuEditor,
  LazyDataVisualization,
  LazyBrandAnalytics,
  LazyAdvancedSearch,
  LazyImageGallery,
  LazyBranchesPage,
  LazyMenusPage,
  LazyQRPage,
  LazyLayoutsPage,
  LazyProfilePage,
  LazySettingsPage,
  preloadRoutes,
  dynamicImports,
  LazyWrapper
};