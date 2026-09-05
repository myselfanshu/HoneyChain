import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

export type StatusType = 'healthy' | 'watch' | 'inspect' | 'verified' | 'active' | 'inactive';

export interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { t } = useTranslation();
  const baseClasses = 'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium font-sans whitespace-nowrap';
  
  const statusConfig: Record<StatusType, { classes: string; label: string; icon?: boolean }> = {
    healthy: { classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: t.common.healthy },
    watch: { classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: t.common.watch },
    inspect: { classes: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: t.common.inspect },
    verified: { classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: t.common.verified, icon: true },
    active: { classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: t.common.active },
    inactive: { classes: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400', label: t.common.inactive },
  };

  const config = statusConfig[status] || statusConfig.healthy;

  return (
    <span className={`${baseClasses} ${config.classes} ${className}`}>
      {config.icon && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
      {config.label}
    </span>
  );
}
