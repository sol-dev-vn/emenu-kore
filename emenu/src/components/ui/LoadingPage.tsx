import LoadingSpinner from './LoadingSpinner';
import { COLORS, GRADIENTS } from '@/lib/styling-constants';

/**
 * Full-page loading component
 */
export default function LoadingPage() {
  return (
    <div className={`min-h-screen flex items-center justify-center ${GRADIENTS.background}`}>
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-gray-600" style={{ color: COLORS.text }}>
          Loading...
        </p>
      </div>
    </div>
  );
}