import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-2xl ${className}`}>
      <div className="w-16 h-16 mb-4 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--text-secondary)]">
        <Icon className="w-8 h-8 opacity-50" />
      </div>
      <h3 className="mb-2 text-lg font-serif font-medium text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="mb-6 max-w-md text-sm font-sans text-[var(--text-secondary)]">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
