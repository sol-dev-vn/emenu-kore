'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function LoadingOverlay({ isLoading, children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {/* Content with blur effect when loading */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isLoading
            ? 'opacity-30 blur-sm pointer-events-none'
            : 'opacity-100 blur-0'
        }`}
      >
        {children}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Loading...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}