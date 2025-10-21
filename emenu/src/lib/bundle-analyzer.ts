// Bundle size analysis utilities

interface BundleInfo {
  name: string;
  size: number;
  gzipped: number;
  chunks: string[];
}

interface BundleAnalysis {
  total: BundleInfo;
  chunks: BundleInfo[];
  dependencies: Record<string, BundleInfo>;
  largestFiles: Array<{
    name: string;
    size: number;
    percentage: number;
  }>;
}

// Analyze bundle sizes (client-side)
export function analyzeBundleSizes(): Promise<BundleAnalysis> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(getEmptyAnalysis());
      return;
    }

    // Simulate bundle analysis (in real implementation, this would use webpack-bundle-analyzer data)
    const mockData: BundleAnalysis = {
      total: {
        name: 'Total Bundle',
        size: 1024 * 1024, // 1MB
        gzipped: 256 * 1024, // 256KB
        chunks: ['main', 'vendor', 'runtime']
      },
      chunks: [
        {
          name: 'main',
          size: 512 * 1024, // 512KB
          gzipped: 128 * 1024, // 128KB
          chunks: ['main']
        },
        {
          name: 'vendor',
          size: 384 * 1024, // 384KB
          gzipped: 96 * 1024, // 96KB
          chunks: ['vendor']
        },
        {
          name: 'runtime',
          size: 128 * 1024, // 128KB
          gzipped: 32 * 1024, // 32KB
          chunks: ['runtime']
        }
      ],
      dependencies: {
        'react': {
          name: 'react',
          size: 42 * 1024,
          gzipped: 13 * 1024,
          chunks: ['vendor']
        },
        'react-dom': {
          name: 'react-dom',
          size: 129 * 1024,
          gzipped: 35 * 1024,
          chunks: ['vendor']
        },
        '@directus/sdk': {
          name: '@directus/sdk',
          size: 85 * 1024,
          gzipped: 22 * 1024,
          chunks: ['vendor']
        },
        'lucide-react': {
          name: 'lucide-react',
          size: 156 * 1024,
          gzipped: 45 * 1024,
          chunks: ['vendor']
        }
      },
      largestFiles: [
        { name: 'lucide-react', size: 156 * 1024, percentage: 15.2 },
        { name: 'react-dom', size: 129 * 1024, percentage: 12.6 },
        { name: '@directus/sdk', size: 85 * 1024, percentage: 8.3 },
        { name: 'DirectusService', size: 45 * 1024, percentage: 4.4 }
      ]
    };

    setTimeout(() => resolve(mockData), 100);
  });
}

function getEmptyAnalysis(): BundleAnalysis {
  return {
    total: { name: 'Total', size: 0, gzipped: 0, chunks: [] },
    chunks: [],
    dependencies: {},
    largestFiles: []
  };
}

// Format bytes to human readable format
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Get bundle optimization recommendations
export function getBundleRecommendations(analysis: BundleAnalysis): string[] {
  const recommendations: string[] = [];

  // Check total bundle size
  if (analysis.total.size > 2 * 1024 * 1024) { // 2MB
    recommendations.push('Consider code splitting to reduce initial bundle size');
  }

  // Check gzipped size
  if (analysis.total.gzipped > 500 * 1024) { // 500KB
    recommendations.push('Gzipped bundle is large, optimize imports and dependencies');
  }

  // Check largest dependencies
  const largeDeps = Object.entries(analysis.dependencies)
    .filter(([, dep]) => dep.size > 100 * 1024); // 100KB

  if (largeDeps.length > 0) {
    recommendations.push(`Large dependencies detected: ${largeDeps.map(([name]) => name).join(', ')}`);
  }

  // Check for potential optimizations
  if (analysis.dependencies['lucide-react'] && analysis.dependencies['lucide-react'].size > 50 * 1024) {
    recommendations.push('Consider using specific icon imports from lucide-react instead of full library');
  }

  return recommendations;
}

// Preload critical chunks
export function preloadCriticalChunks() {
  if (typeof window === 'undefined') return;

  const criticalChunks = ['main', 'runtime'];

  criticalChunks.forEach(chunkName => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = `/static/js/${chunkName}.js`;
    document.head.appendChild(link);
  });
}

// Monitor bundle loading performance
export function monitorBundlePerformance() {
  if (typeof window === 'undefined') return;

  // Observe navigation timing
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.entryType === 'navigation') {
        const navEntry = entry as PerformanceNavigationTiming;
        const domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
        const loadComplete = navEntry.loadEventEnd - navEntry.loadEventStart;

        console.log('Bundle Performance:', {
          domContentLoaded: `${domContentLoaded.toFixed(2)}ms`,
          loadComplete: `${loadComplete.toFixed(2)}ms`,
          totalLoadTime: `${navEntry.loadEventEnd - navEntry.navigationStart.toFixed(2)}ms`
        });

        // Log performance warnings
        if (domContentLoaded > 1000) {
          console.warn('Slow DOM content loading detected');
        }
        if (loadComplete > 2000) {
          console.warn('Slow page load detected');
        }
      }
    });
  });

  observer.observe({ entryTypes: ['navigation'] });
}

// Resource hints for better loading
export function addResourceHints() {
  if (typeof document === 'undefined') return;

  // DNS prefetch for external domains
  const domains = [
    'https://your-directus-instance.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical domains
  const criticalDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  criticalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });
}

export default {
  analyzeBundleSizes,
  formatBytes,
  getBundleRecommendations,
  preloadCriticalChunks,
  monitorBundlePerformance,
  addResourceHints
};