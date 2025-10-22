import { cn } from '@/lib/utils';
import { LAYOUT_CLASSES } from '@/lib/styling-constants';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Reusable page container component with consistent padding and max-width
 */
export default function PageContainer({
  children,
  className,
  size = 'lg'
}: PageContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-8xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      `${sizeClasses[size]} mx-auto px-4 sm:px-6 lg:px-8`,
      className
    )}>
      {children}
    </div>
  );
}