'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = null
}) => {
  const router = useRouter();
  const { state } = useAuth();

  useEffect(() => {
    // If user is not authenticated and not loading, redirect to login
    if (!state.isLoading && !state.isAuthenticated) {
      router.push('/login');
    }
  }, [state.isAuthenticated, state.isLoading, router]);

  // If loading, show fallback or nothing
  if (state.isLoading) {
    return fallback || <div>Loading...</div>;
  }

  // If not authenticated, show fallback or nothing
  if (!state.isAuthenticated) {
    return fallback || null;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;