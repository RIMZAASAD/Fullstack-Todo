'use client';

import React from 'react';
import AuthLayout from '@/components/auth/auth-layout';
import SignupForm from '@/components/auth/signup-form';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const SignupPage: React.FC = () => {
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
      title="Join the productivity"
      subtitle="Create your account to start managing your daily tasks effectively."
      showBackLink={true}
      backLinkText="Back to welcome"
    >
      <SignupForm
        onSwitchToLogin={() => router.push('/login')}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-slate-400"
      >
        Already have an account?{' '}
        <button
          onClick={() => router.push('/login')}
          className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Sign in here
        </button>
      </motion.div>
    </AuthLayout>
  );
};

export default SignupPage;