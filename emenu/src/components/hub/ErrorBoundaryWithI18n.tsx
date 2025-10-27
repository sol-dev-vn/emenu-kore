'use client';

import React from 'react';
import { ErrorBoundary as BaseErrorBoundary } from './ErrorBoundary';
import { useI18n } from '@/contexts/I18nContext';

interface ErrorBoundaryWithI18nProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export function ErrorBoundaryWithI18n({ children, fallback }: ErrorBoundaryWithI18nProps) {
  const { t } = useI18n();

  const I18nFallbackComponent = ({ error, reset }: { error?: Error; reset: () => void }) => {
    if (fallback) {
      const FallbackComponent = fallback;
      return <FallbackComponent error={error} reset={reset} />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-brand-background">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl text-brand-primary mb-4">
              {t('common.error')}
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-center text-brand-text/70">
              {t('errors.pageNotFound')}
            </p>

            {process.env.NODE_ENV === 'development' && error && (
              <div className="bg-gray-100 p-3 rounded text-xs">
                <p className="font-mono text-brand-primary mb-2">
                  Error: {error.message}
                </p>
                <p className="font-mono text-brand-text/50">
                  {error.stack}
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <button
                onClick={reset}
                className="w-full bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-primary/90 transition-colors flex items-center justify-center"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('common.retry')}
              </button>

              <button
                onClick={() => window.location.href = '/hub'}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('common.back')}
              </button>
            </div>

            <div className="text-center text-xs text-brand-text/50">
              Error ID: {Date.now().toString(36)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BaseErrorBoundary fallback={I18nFallbackComponent}>
      {children}
    </BaseErrorBoundary>
  );
}

export default ErrorBoundaryWithI18n;