import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="relative flex items-center justify-center">
      <div className={`absolute ${sizeClasses[size]} border-indigo-500/20 rounded-full animate-pulse transition-all`} />
      <div className={`absolute ${sizeClasses[size]} border-t-indigo-500 rounded-full animate-spin transition-all`} />
    </div>
  );
};

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  showRetry = false
}) => {
  return (
    <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-[2rem] backdrop-blur-xl" role="alert">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center">
          <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-red-100">{message}</p>
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors"
            >
              Retry Connection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface SkeletonLoaderProps {
  height?: string;
  width?: string;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  height = 'h-4',
  width = 'w-full',
  className = ''
}) => {
  return (
    <div className={`${height} ${width} bg-white/5 rounded-2xl animate-pulse ${className} border border-white/5`} />
  );
};

interface WithLoadingProps {
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}

export const WithLoading: React.FC<WithLoadingProps> = ({
  loading,
  error,
  onRetry,
  children,
  skeleton
}) => {
  if (loading) {
    if (skeleton) return <>{skeleton}</>;
    return (
      <div className="flex flex-col justify-center items-center py-20 px-6 glass rounded-[3rem] border-white/5 min-h-[400px]">
        <LoadingSpinner size="lg" className="mb-8" />
        <div className="space-y-4 text-center">
          <div className="h-6 w-48 bg-white/5 rounded-full animate-pulse mx-auto" />
          <div className="h-4 w-32 bg-white/5 rounded-full animate-pulse mx-auto opacity-50" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <ErrorMessage
          message={error}
          onRetry={onRetry}
          showRetry={!!onRetry}
        />
      </div>
    );
  }

  return <>{children}</>;
};

// Hook for managing loading and error states
export const useLoadingError = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const executeWithHandling = async (promise: Promise<any>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await promise;
      return result;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setLoading,
    setError,
    executeWithHandling,
  };
};