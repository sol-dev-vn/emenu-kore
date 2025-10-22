import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook for managing layout state that depends on pathname changes
 */
export function useLayoutState() {
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return {
    isReady,
    pathname,
  };
}

/**
 * Hook for debounced resize events
 */
export function useDebounceResize<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for getting window size with debouncing
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const debouncedWindowSize = useDebounceResize(windowSize, 100);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return debouncedWindowSize;
}