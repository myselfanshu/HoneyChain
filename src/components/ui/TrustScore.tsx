import React from 'react';

export interface TrustScoreProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TrustScore({ score, maxScore = 100, size = 'md', className = '' }: TrustScoreProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  
  // Size configurations
  const sizes = {
    sm: { svg: 60, stroke: 4, text: 'text-xl', sub: 'text-[10px]' },
    md: { svg: 120, stroke: 8, text: 'text-4xl', sub: 'text-sm' },
    lg: { svg: 180, stroke: 12, text: 'text-6xl', sub: 'text-lg' },
  };
  
  const { svg: sizePx, stroke, text, sub } = sizes[size];
  const center = sizePx / 2;
  const radius = center - stroke;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getLabel = (s: number) => {
    if (s >= 90) return 'Excellent';
    if (s >= 75) return 'Good';
    if (s >= 50) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative" style={{ width: sizePx, height: sizePx }}>
        {/* Background track */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="var(--accent)"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline">
            <span className={`font-serif font-bold text-[var(--text-primary)] ${text}`}>
              {score}
            </span>
            <span className={`font-sans text-[var(--text-secondary)] ${sub} ml-1`}>
              /{maxScore}
            </span>
          </div>
        </div>
      </div>
      
      {/* Label */}
      <span className={`mt-2 font-sans font-medium text-[var(--text-secondary)] ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {getLabel(score)}
      </span>
    </div>
  );
}
