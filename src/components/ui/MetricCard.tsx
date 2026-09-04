import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: string | number;
  trendUp?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  className = '',
}: MetricCardProps) {
  const isPositive = trendUp ?? (typeof trend === 'number' && trend > 0);

  return (
    <div className={`bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-3 transition-shadow hover:shadow-md ${className}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-[var(--text-secondary)] font-sans text-sm font-medium">{title}</h3>
        {Icon && <Icon className="text-[var(--accent)] w-5 h-5" />}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[var(--text-primary)] font-serif text-3xl font-semibold">{value}</span>
        {unit && <span className="text-[var(--text-secondary)] font-sans text-lg">{unit}</span>}
      </div>
      {(subtitle || trend !== undefined) && (
        <div className="flex items-center gap-2 text-sm">
          {trend !== undefined && (
            <span
              className={`flex items-center gap-1 ${
                isPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'
              }`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {typeof trend === 'number' ? `${Math.abs(trend)}%` : trend}
            </span>
          )}
          {subtitle && <span className="text-[var(--text-secondary)]">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
