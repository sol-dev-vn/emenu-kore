'use client';

import { Suspense } from 'react';
import QRMenuPageContent from './QRMenuPageContent';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function QRMenuPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <QRMenuPageContent />
    </Suspense>
  );
}