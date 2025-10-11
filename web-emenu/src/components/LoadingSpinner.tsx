'use client';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4 shadow-xl">
        <div className="relative">
          <div className={`${sizeClasses[size]} border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin`}></div>
        </div>
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
}