'use client';

import { useRouter } from 'next/navigation';
import { useLoading } from '@/contexts/loading-context';

export function useNavigationLoading() {
  const router = useRouter();
  const { setLoading } = useLoading();

  const navigateWithLoading = (href: string) => {
    // Only apply loading for internal portal links
    if (href.startsWith('/portal')) {
      setLoading(true);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Navigate after a brief delay to show loading state
      setTimeout(() => {
        router.push(href);
        // Hide loading after navigation
        setTimeout(() => setLoading(false), 300);
      }, 150);
    } else {
      // For external links or non-portal links, navigate normally
      router.push(href);
    }
  };

  return { navigateWithLoading };
}