import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './badge';

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  variant = 'default',
  className = ''
}) => {
  const variantClasses = {
    default: 'bg-slate-800/50 border-white/10',
    primary: 'bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20',
    secondary: 'bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20',
    accent: 'bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20'
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${variantClasses[variant]} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/5 rounded-xl">
          {icon}
        </div>
        {trend && trendValue && (
          <Badge
            variant={trend === 'up' ? 'success' : 'destructive'}
            className="text-xs font-semibold"
          >
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </Badge>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm font-medium">{title}</div>
      {description && (
        <div className="mt-3 text-xs text-slate-500">{description}</div>
      )}
    </motion.div>
  );
};

export { StatsCard };