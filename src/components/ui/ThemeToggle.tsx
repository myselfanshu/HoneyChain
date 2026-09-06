import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--surface)] transition-colors border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-50 ${className}`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 transition-all duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="w-5 h-5 transition-all duration-300 rotate-0 scale-100" />
      )}
    </button>
  );
}
