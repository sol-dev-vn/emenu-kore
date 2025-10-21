'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CacheManager, debounce, PerformanceMonitor } from '@/lib/performance';

interface UseOptimizedDataOptions<T> {
  fetcher: () => Promise<T>;
  dependencies?: any[];
  cacheKey?: string;
  cacheTTL?: number;
  staleWhileRevalidate?: boolean;
  refreshInterval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
}

interface UseOptimizedDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  mutate: (newData: T | ((prev: T | null) => T)) => void;
}

// Global cache instance
const globalCache = new CacheManager(5 * 60 * 1000); // 5 minutes default

export function useOptimizedData<T>({
  fetcher,
  dependencies = [],
  cacheKey,
  cacheTTL = 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate = true,
  refreshInterval,
  onSuccess,
  onError,
  retryCount = 3,
  retryDelay = 1000
}: UseOptimizedDataOptions<T>): UseOptimizedDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate cache key if not provided
  const finalCacheKey = cacheKey || `fetch_${JSON.stringify(dependencies)}`;

  // Debounced refetch function
  const debouncedRefetch = useCallback(
    debounce(async () => {
      const finishTimer = PerformanceMonitor.startTimer(`fetch_${finalCacheKey}`);

      try {
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        // Check cache first
        const cachedData = globalCache.get(finalCacheKey);
        if (cachedData && staleWhileRevalidate) {
          setData(cachedData);
          setLoading(false);
        }

        const response = await fetcher();

        // Cache the new data
        globalCache.set(finalCacheKey, response, cacheTTL);

        setData(response);
        setError(null);
        setLoading(false);

        onSuccess?.(response);
        finishTimer();
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err);
          setLoading(false);
          onError?.(err);
          finishTimer();
        }
      }
    }, 300),
    [fetcher, finalCacheKey, cacheTTL, staleWhileRevalidate, onSuccess, onError]
  );

  // Fetch data with retry logic
  const fetchDataWithRetry = useCallback(async (attempt = 1) => {
    try {
      await debouncedRefetch();
    } catch (err) {
      if (attempt < retryCount) {
        setTimeout(() => fetchDataWithRetry(attempt + 1), retryDelay * attempt);
      }
    }
  }, [debouncedRefetch, retryCount, retryDelay]);

  // Initial fetch and dependency changes
  useEffect(() => {
    fetchDataWithRetry();
  }, dependencies);

  // Refresh interval
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      fetchDataWithRetry();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchDataWithRetry]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchDataWithRetry();
  }, [fetchDataWithRetry]);

  const mutate = useCallback((newData: T | ((prev: T | null) => T)) => {
    const updatedData = typeof newData === 'function'
      ? (newData as Function)(data)
      : newData;

    setData(updatedData);
    globalCache.set(finalCacheKey, updatedData, cacheTTL);
  }, [data, finalCacheKey, cacheTTL]);

  return {
    data,
    loading,
    error,
    refetch,
    mutate
  };
}

// Hook for paginated data
export function usePaginatedData<T>({
  fetcher,
  pageSize = 20,
  initialPage = 1,
  ...options
}: Omit<UseOptimizedDataOptions<{ data: T[]; total: number }>, 'dependencies'> & {
  pageSize?: number;
  initialPage?: number;
}) {
  const [page, setPage] = useState(initialPage);
  const [allData, setAllData] = useState<T[]>([]);

  const { data, loading, error, refetch } = useOptimizedData({
    fetcher: () => fetcher(page, pageSize),
    dependencies: [page, pageSize],
    ...options
  });

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAllData(data.data);
      } else {
        setAllData(prev => [...prev, ...data.data]);
      }
    }
  }, [data, page]);

  const loadMore = useCallback(() => {
    if (data && allData.length < data.total) {
      setPage(prev => prev + 1);
    }
  }, [data, allData.length]);

  const reset = useCallback(() => {
    setPage(1);
    setAllData([]);
  }, []);

  return {
    data: allData,
    loading,
    error,
    refetch,
    loadMore,
    reset,
    hasMore: data ? allData.length < data.total : false,
    total: data?.total || 0,
    currentPage: page
  };
}

// Hook for infinite scroll
export function useInfiniteScroll<T>(
  usePaginatedDataResult: ReturnType<typeof usePaginatedData<T>>,
  options: {
    threshold?: number;
    rootMargin?: string;
  } = {}
) {
  const { data, loading, error, loadMore, hasMore } = usePaginatedDataResult;
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading || isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      await loadMore();
    } finally {
      setIsFetchingMore(false);
    }
  }, [hasMore, loading, isFetchingMore, loadMore]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading && !isFetchingMore) {
          handleLoadMore();
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '100px'
      }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleLoadMore, hasMore, loading, isFetchingMore, options.threshold, options.rootMargin]);

  return {
    ...usePaginatedDataResult,
    isFetchingMore,
    loadMoreRef
  };
}

export default useOptimizedData;