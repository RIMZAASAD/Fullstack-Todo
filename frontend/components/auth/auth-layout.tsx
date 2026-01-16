'use client';

import React from 'react';
import Link from 'next/link';
import { User, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBranding?: boolean;
  showBackLink?: boolean;
  backLinkText?: string;
  backLinkHref?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBranding = true,
  showBackLink = false,
  backLinkText = 'Back to Home',
  backLinkHref = '/',
}) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        {showBranding && (
          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl w-20 h-20 flex items-center justify-center shadow-2xl shadow-indigo-500/20"
            >
              <User className="h-10 w-10 text-indigo-400" />
            </motion.div>
          </div>
        )}

        <h2 className="text-center text-4xl font-bold tracking-tight text-white mb-2">
          <span className="gradient-text">{title}</span>
        </h2>

        {subtitle && (
          <p className="text-center text-slate-400 font-medium">
            {subtitle}
          </p>
        )}

        {showBackLink && (
          <div className="mt-4 flex justify-center">
            <Link
              href={backLinkHref}
              className="group flex items-center text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {backLinkText}
            </Link>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="glass px-6 sm:px-10 py-8 sm:py-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;