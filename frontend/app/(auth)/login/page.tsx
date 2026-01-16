'use client';

import React from 'react';
import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
  const { state } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (state.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [state.isAuthenticated, router]);

  if (state.isAuthenticated) {
    return null;
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue your productivity journey."
      showBackLink={true}
      backLinkText="Back to welcome"
    >
      <LoginForm
        onSwitchToSignup={() => router.push('/signup')}
        onForgotPassword={() => {
          router.push('/forgot-password');
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-slate-400"
      >
        Don't have an account?{' '}
        <button
          onClick={() => router.push('/signup')}
          className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Create an account
        </button>
      </motion.div>
    </AuthLayout>
  );
};

export default LoginPage;