import React from 'react';
import { Calendar } from 'lucide-react';
import { useLiveDate } from '@/hooks/useLiveDate';

export interface LiveDateDisplayProps {
  className?: string;
  showIcon?: boolean;
  iconSize?: number;
  iconClassName?: string;
  variant?: 'pill' | 'chip' | 'inline';
}

/**
 * Reusable live calendar date display component.
 * Automatically updates every minute and provides accessible aria-labels.
 */
export const LiveDateDisplay: React.FC<LiveDateDisplayProps> = ({
  className,
  showIcon = false,
  iconSize = 14,
  iconClassName = 'text-[var(--accent)]',
}) => {
  const { formattedDate, accessibleLabel } = useLiveDate();

  return (
    <div
      className={className}
      role="time"
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      {showIcon && <Calendar size={iconSize} className={iconClassName} aria-hidden="true" />}
      <span>{formattedDate}</span>
    </div>
  );
};

export default LiveDateDisplay;
