import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  className?: string;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  variant = 'default',
  className = '',
  hoverEffect = true
}) => {
  const variantClasses = {
    default: 'bg-slate-800/50 border-white/10',
    primary: 'bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/20',
    secondary: 'bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20',
    accent: 'bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20'
  };

  const CardComponent = hoverEffect ? motion.div : 'div';
  const cardProps = hoverEffect ? {
    whileHover: { y: -5, scale: 1.01 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      {...cardProps}
      className={`rounded-2xl border backdrop-blur-sm ${variantClasses[variant]} ${className}`}
    >
      {(title || description) && (
        <div className="p-6 border-b border-white/10">
          {title && <h3 className="text-xl font-bold text-white mb-1">{title}</h3>}
          {description && <p className="text-slate-400 text-sm">{description}</p>}
        </div>
      )}
      <div className={!(title || description) ? 'p-6' : 'p-6'}>
        {children}
      </div>
    </CardComponent>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-white/10 ${className}`}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-white ${className}`}>
    {children}
  </h3>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`p-6 border-t border-white/10 ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardContent, CardFooter, CardTitle };