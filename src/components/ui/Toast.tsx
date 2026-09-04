import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
  className?: string;
}

export function Toast({ message, type, onClose, duration = 3000, className = '' }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'border-green-200 dark:border-green-900',
    warning: 'border-yellow-200 dark:border-yellow-900',
    error: 'border-red-200 dark:border-red-900',
    info: 'border-blue-200 dark:border-blue-900',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-xl shadow-lg border bg-[var(--surface)] ${bgColors[type]} animate-in slide-in-from-top-2 fade-in duration-300 max-w-sm w-full ${className}`}>
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <p className="flex-1 text-sm font-sans text-[var(--text-primary)]">
        {message}
      </p>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
