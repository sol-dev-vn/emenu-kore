'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function TableLayoutsRedirectPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user) {
      // Redirect to the new tables page
      router.push('/hub/tables');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{borderColor: '#9B1D20'}}></div>
      </div>
    );
  }

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FFE4E1'}}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto mb-4" style={{borderColor: '#9B1D20'}}></div>
        <p className="text-gray-600">Redirecting to Table Layouts...</p>
      </div>
    </div>
  );
}