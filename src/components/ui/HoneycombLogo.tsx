import React from 'react';
import { useTranslation } from '@/contexts/LanguageContext';

export interface HoneycombLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

export const HoneycombLogo: React.FC<HoneycombLogoProps> = ({ 
  size = 32, 
  className = '',
  showWordmark = false
}) => {
  const { t } = useTranslation();

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Precision Geometric Mark: Honeycomb + Interlocking Provenance Chain Link + Honey Droplet */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="hc-amber-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="hc-inner-grad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="hc-glow" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Outer Hexagon Chamber with subtle corner facets */}
        <path
          d="M24 3.5L42.5 13.8V34.2L24 44.5L5.5 34.2V13.8L24 3.5Z"
          stroke="url(#hc-amber-grad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Interlocking Inner Geometric Traceability Chain Links */}
        <path
          d="M24 9L37.5 16.5V31.5L24 39L10.5 31.5V16.5L24 9Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeOpacity="0.4"
          strokeDasharray="3 2"
        />

        {/* Concentric Flow Facet */}
        <path
          d="M24 14.5L32.5 19.5V28.5L24 33.5L15.5 28.5V19.5L24 14.5Z"
          fill="url(#hc-inner-grad)"
          stroke="url(#hc-amber-grad)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Central Provenance Node & Honey Drop */}
        <circle cx="24" cy="24" r="3.5" fill="url(#hc-glow)" />
        <circle cx="24" cy="24" r="1.5" fill="#ffffff" opacity="0.9" />

        {/* Top/Bottom Subtle Node Connector Accents */}
        <circle cx="24" cy="4" r="1.5" fill="#f59e0b" />
        <circle cx="42.5" cy="14" r="1.5" fill="#f59e0b" />
        <circle cx="42.5" cy="34" r="1.5" fill="#f59e0b" />
        <circle cx="24" cy="44" r="1.5" fill="#f59e0b" />
        <circle cx="5.5" cy="34" r="1.5" fill="#f59e0b" />
        <circle cx="5.5" cy="14" r="1.5" fill="#f59e0b" />
      </svg>

      {/* Optional Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <span className="font-serif font-bold text-lg leading-none tracking-wide text-[var(--text-primary)]">
            {t.common.brandName}
          </span>
          <span className="font-sans text-[0.62rem] font-bold tracking-[0.25em] text-[var(--accent)] mt-1">
            {t.common.brandSub}
          </span>
        </div>
      )}
    </div>
  );
};

export default HoneycombLogo;
