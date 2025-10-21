// Performance optimization utilities

// Debounce function for search and API calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle function for scroll events and animations
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Memoization helper for expensive computations
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
}

// Preload critical resources
export function preloadResources(resources: Array<{
  href: string;
  as: 'script' | 'style' | 'image' | 'document';
  priority?: 'high' | 'low';
}>) {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.priority) {
      (link as any).fetchPriority = resource.priority;
    }
    document.head.appendChild(link);
  });
}

// Virtual scrolling helper for large lists
export class VirtualScroller<T> {
  private items: T[];
  private itemHeight: number;
  private containerHeight: number;
  private scrollTop: number = 0;

  constructor(items: T[], itemHeight: number, containerHeight: number) {
    this.items = items;
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
  }

  updateScrollTop(scrollTop: number) {
    this.scrollTop = scrollTop;
  }

  getVisibleItems(): { items: T[]; startIndex: number; endIndex: number } {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.itemHeight) + 1,
      this.items.length - 1
    );

    return {
      items: this.items.slice(startIndex, endIndex + 1),
      startIndex,
      endIndex
    };
  }

  getTotalHeight(): number {
    return this.items.length * this.itemHeight;
  }

  getOffsetY(): number {
    const { startIndex } = this.getVisibleItems();
    return startIndex * this.itemHeight;
  }
}

// Image optimization utilities
export function getOptimizedImageUrl(
  url: string,
  width: number,
  height?: number,
  quality: number = 80
): string {
  // If it's already an optimized URL, return as-is
  if (url.includes('?') && url.includes('width=')) {
    return url;
  }

  // For external images that don't support optimization parameters
  if (url.startsWith('http')) {
    return url;
  }

  // Add optimization parameters
  const params = new URLSearchParams({
    width: width.toString(),
    quality: quality.toString()
  });

  if (height) {
    params.append('height', height.toString());
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map();

  static startTimer(name: string): () => void {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.metrics.set(name, duration);

      // Log performance warnings
      if (duration > 100) {
        console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
      }
    };
  }

  static getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  static getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  static clearMetrics(): void {
    this.metrics.clear();
  }
}

// Bundle splitting utilities
export const lazyLoadComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(importFunc);
};

// Cache management
export class CacheManager<T> {
  private cache: Map<string, { data: T; timestamp: number; ttl: number }>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export default {
  debounce,
  throttle,
  memoize,
  createIntersectionObserver,
  preloadResources,
  VirtualScroller,
  getOptimizedImageUrl,
  PerformanceMonitor,
  lazyLoadComponent,
  CacheManager
};