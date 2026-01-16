'use client';

import React, { useState } from 'react';
import AuthLayout from '@/components/auth/auth-layout';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to send reset email');
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <AuthLayout
                title="Check your email"
                subtitle="We've sent password reset instructions to your email address."
                showBackLink={false}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">Email Sent!</h3>
                    <p className="text-slate-400 mb-8">
                        If an account exists for <span className="text-white font-semibold">{email}</span>, you will receive password reset instructions shortly.
                    </p>

                    <button
                        onClick={() => router.push('/login')}
                        className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </button>
                </motion.div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email address and we'll send you instructions to reset your password."
            showBackLink={true}
            backLinkText="Back to sign in"
            backLinkHref="/login"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-300">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl text-white font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                        </span>
                    ) : (
                        'Send Reset Instructions'
                    )}
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => router.push('/login')}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        Remember your password? <span className="font-semibold text-indigo-400">Sign in</span>
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
