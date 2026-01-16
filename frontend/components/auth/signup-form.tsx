import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkPasswordStrength, getPasswordStrengthColor, getPasswordStrengthBg, PasswordStrength } from '@/lib/utils/password-strength';

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const { signup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (password) {
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  }, [password]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name) {
      newErrors.name = 'Full name is required';
    }

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength && passwordStrength.score < 2) {
      newErrors.password = 'Password is too weak. Must include uppercase, lowercase, number, and special character.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await signup(name, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      setErrors({ form: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = (error?: string) => `
    block w-full pl-10 pr-3 py-2.5 border 
    ${error ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5'} 
    rounded-xl text-white placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
    transition-all duration-200
  `;

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
          Full Name
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-500">
            <User className="h-5 w-5" />
          </div>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses(errors.name)}
          />
        </div>
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 text-xs text-red-400 ml-1"
            >
              {errors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
          Email address
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-500">
            <Mail className="h-5 w-5" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses(errors.email)}
          />
        </div>
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 text-xs text-red-400 ml-1"
            >
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
          Password
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-500">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses(errors.password)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-indigo-400 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <AnimatePresence>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 text-xs text-red-400 ml-1"
            >
              {errors.password}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Password Strength Indicator */}
        {password && passwordStrength && (
          <div className="mt-2">
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">
          Confirm Password
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-500">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClasses(errors.confirmPassword)}
          />
        </div>
        <AnimatePresence>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 text-xs text-red-400 ml-1"
            >
              {errors.confirmPassword}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {errors.form && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl bg-red-500/10 p-4 border border-red-500/20"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-400">{errors.form}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/25 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <>
              Create Account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </motion.div>
    </form>
  );
};

export default SignupForm;