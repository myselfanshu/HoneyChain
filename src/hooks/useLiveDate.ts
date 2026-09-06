import { useState, useEffect } from 'react';

/**
 * Helper to format a date into DD MMM YYYY (e.g., '06 Sep 2026')
 * using Intl.DateTimeFormat with the user's local timezone.
 */
export function formatLiveDate(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).formatToParts(date);

  const day = parts.find((p) => p.type === 'day')?.value ?? String(date.getDate()).padStart(2, '0');
  const month = parts.find((p) => p.type === 'month')?.value ?? '';
  const year = parts.find((p) => p.type === 'year')?.value ?? String(date.getFullYear());

  return `${day} ${month} ${year}`;
}

/**
 * Reusable React hook for a reactive live local calendar date.
 * Automatically checks and updates at least once per minute and cleans up on unmount.
 */
export function useLiveDate(): { formattedDate: string; accessibleLabel: string; date: Date } {
  const [date, setDate] = useState<Date>(() => new Date());
  const [formattedDate, setFormattedDate] = useState<string>(() => formatLiveDate());

  useEffect(() => {
    // Check every minute (60,000 ms) for date change while page remains open
    const timer = setInterval(() => {
      const now = new Date();
      setDate(now);
      setFormattedDate(formatLiveDate(now));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const accessibleLabel = `Current date: ${formattedDate}`;

  return { formattedDate, accessibleLabel, date };
}
