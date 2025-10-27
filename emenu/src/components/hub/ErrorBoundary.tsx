'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/contexts/I18nContext';
import { BRAND_COLORS } from '@/lib/styling-constants';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private toast = useToast();

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Show toast notification for error
    this.toast.toast({
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again.',
      variant: 'destructive',
      duration: 5000
    });

    // Log error to monitoring service in production
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} reset={this.handleReset} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-background">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-brand-primary" />
              </div>
              <CardTitle className="text-xl text-brand-primary">
                Something went wrong
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-center text-brand-text/70">
                We encountered an unexpected error. Please try again or contact support if the problem persists.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-100 p-3 rounded text-xs">
                  <p className="font-mono text-brand-primary mb-2">
                    Error: {this.state.error.message}
                  </p>
                  <p className="font-mono text-brand-text/50">
                    {this.state.error.stack}
                  </p>
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <Button
                  onClick={this.handleReset}
                  className="w-full bg-brand-primary hover:bg-brand-primary/90"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/hub'}
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Back to Hub
                </Button>
              </div>

              <div className="text-center text-xs text-brand-text/50">
                Error ID: {Date.now().toString(36)}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for handling async errors in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return React.useCallback((error: Error) => {
    setError(error);
  }, []);
}

// Component for handling specific error types
export function ErrorMessage({
  error,
  reset,
  title = "Error occurred",
  description
}: {
  error?: Error;
  reset: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <Card className="border-brand-primary/20 bg-brand-primary/5">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-brand-primary mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-brand-primary">{title}</h3>
            <p className="text-brand-text/80 text-sm mt-1">
              {description || error?.message || 'An unexpected error occurred.'}
            </p>
            {process.env.NODE_ENV === 'development' && error?.stack && (
              <details className="mt-2">
                <summary className="text-xs text-brand-primary cursor-pointer">Technical details</summary>
                <pre className="text-xs text-brand-text/60 mt-1 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </details>
            )}
            <Button
              onClick={reset}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}