import React from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  );
};

const DialogContent: React.FC<DialogContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-800 rounded-lg shadow-xl w-full max-w-md border border-slate-700 ${className}`}>
      {children}
    </div>
  );
};

const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return (
    <div className="px-6 py-4 border-b border-slate-700">
      {children}
    </div>
  );
};

const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
  return (
    <h3 className="text-lg font-medium text-slate-100">
      {children}
    </h3>
  );
};

const DialogTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger };