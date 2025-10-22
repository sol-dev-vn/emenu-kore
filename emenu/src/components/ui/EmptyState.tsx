import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { COLORS } from '@/lib/styling-constants';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Consistent empty state component
 */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "text-center py-12",
      className
    )}>
      {icon && (
        <div className="mb-4 flex justify-center">
          <div className="text-gray-400">
            {icon}
          </div>
        </div>
      )}
      <h3
        className="text-lg font-medium text-gray-900 mb-2"
        style={{ color: COLORS.text }}
      >
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
}