import { cn } from '@/lib/utils';
import { COLORS } from '@/lib/styling-constants';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Consistent loading spinner component
 */
export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-200 border-t-current',
        sizeClasses[size],
        className
      )}
      style={{ borderTopColor: COLORS.primary }}
    />
  );
}