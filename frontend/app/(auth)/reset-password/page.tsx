
'use client';

import React, { useState, useEffect } from 'react';
import AuthLayout from '@/components/auth/auth-layout';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { checkPasswordStrength, getPasswordStrengthColor, getPasswordStrengthBg, PasswordStrength } from '@/lib/utils/password-strength';

const ResetPasswordContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token.');
        }
    }, [token]);

    useEffect(() => {
        if (password) {
            const strength = checkPasswordStrength(password);
            setPasswordStrength(strength);
        } else {
            setPasswordStrength(null);
        }
    }, [password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (passwordStrength && passwordStrength.score < 2) {
            setError('Password is too weak. Must include uppercase, lowercase, number, and special character.');
            return;
        }

        if (!token) {
            setError('Missing reset token');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    new_password: password
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to reset password');
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <AuthLayout
                title="Password Reset Complete"
                subtitle="Your password has been successfully updated."
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

                    <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
                    <p className="text-slate-400 mb-8">
                        You can now sign in with your new password.
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
            title="Set new password"
            subtitle="Please enter your new password below."
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

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-300">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                placeholder="Min. 8 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {password && passwordStrength && (
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-slate-400">Password Strength:</span>
                                    <span className={`text-xs font-semibold ${getPasswordStrengthColor(passwordStrength)}`}>
                                        {passwordStrength.message}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            passwordStrength.level === 'weak' ? 'bg-red-500' :
                                            passwordStrength.level === 'medium' ? 'bg-amber-500' :
                                            'bg-emerald-500'
                                        }`}
                                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="mt-2 text-xs text-slate-400">
                                    <p className={`${passwordStrength.requirements.minLength ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {passwordStrength.requirements.minLength ? '✓' : '○'} Minimum 8 characters
                                    </p>
                                    <div className="flex flex-wrap gap-x-4">
                                        <p className={`${passwordStrength.requirements.hasUpperCase ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {passwordStrength.requirements.hasUpperCase ? '✓' : '○'} Uppercase letter
                                        </p>
                                        <p className={`${passwordStrength.requirements.hasLowerCase ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {passwordStrength.requirements.hasLowerCase ? '✓' : '○'} Lowercase letter
                                        </p>
                                        <p className={`${passwordStrength.requirements.hasNumbers ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {passwordStrength.requirements.hasNumbers ? '✓' : '○'} Number
                                        </p>
                                        <p className={`${passwordStrength.requirements.hasSpecialChars ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {passwordStrength.requirements.hasSpecialChars ? '✓' : '○'} Special character
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-300">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                                placeholder="Re-enter password"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !token}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl text-white font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Resetting...
                        </span>
                    ) : (
                        'Reset Password'
                    )}
                </button>
            </form>
        </AuthLayout>
    );
};

const ResetPasswordPage: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
};

export default ResetPasswordPage;
