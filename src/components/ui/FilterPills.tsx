import React from 'react';

export interface FilterPillsProps {
  options: string[];
  selected: string;
  onChange: (option: string) => void;
  className?: string;
}

export function FilterPills({ options, selected, onChange, className = '' }: FilterPillsProps) {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 ${className}`}>
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-colors ${
              isSelected
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)]'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
