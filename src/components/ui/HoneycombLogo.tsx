import React from 'react';

export interface HoneycombLogoProps {
  size?: number;
  className?: string;
}

export function HoneycombLogo({ size = 32, className = '' }: HoneycombLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 2L20.6603 7V17L12 22L3.33975 17V7L12 2Z" 
        stroke="var(--accent)" 
        strokeWidth="2" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 6L16.3301 8.5V13.5L12 16L7.66987 13.5V8.5L12 6Z" 
        fill="var(--accent)"
        opacity="0.2"
      />
      <circle cx="12" cy="11" r="2" fill="var(--accent)" />
    </svg>
  );
}
