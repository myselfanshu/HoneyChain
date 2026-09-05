import React from 'react';
import { CheckCircle, Award, ShieldCheck, Sparkles, QrCode } from 'lucide-react';
import { Batch } from '@/data/types';
import { Link } from 'react-router-dom';

interface HoneyPassportProps {
  batch: Batch;
}

export const HoneyPassportCard: React.FC<HoneyPassportProps> = ({ batch }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 shadow-lg transition-all duration-300">
      {/* Decorative Ornate Amber Corner Accents */}
      <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-[var(--accent)]/70 pointer-events-none rounded-tl-sm" />
      <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-[var(--accent)]/70 pointer-events-none rounded-tr-sm" />
      <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-[var(--accent)]/70 pointer-events-none rounded-bl-sm" />
      <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-[var(--accent)]/70 pointer-events-none rounded-br-sm" />

      {/* Background Subtle Watermark Stamp */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 opacity-5 dark:opacity-10 pointer-events-none rotate-12 select-none">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" className="text-[var(--accent)]">
          <circle cx="100" cy="100" r="90" strokeWidth="2" strokeDasharray="6,4" />
          <circle cx="100" cy="100" r="75" strokeWidth="3" />
          <path id="curve" d="M 30,100 A 70,70 0 1,1 170,100" fill="none" />
          <text fontSize="11" fontWeight="bold" letterSpacing="3" fill="currentColor">
            <textPath href="#curve" startOffset="50%" textAnchor="middle">
              HONEY CHAIN PROVENANCE
            </textPath>
          </text>
          <circle cx="100" cy="100" r="30" strokeWidth="2" />
          <polygon points="100,80 106,94 120,94 109,103 113,117 100,108 87,117 91,103 80,94 94,94" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
        {/* Left Column: Product Jar Presentation */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-[var(--surface-secondary)] to-[var(--surface)] border border-[var(--border)] shrink-0 w-full sm:w-60">
          <div className="relative w-36 h-44 flex items-center justify-center">
            {/* Ambient Honey Glow */}
            <div className="absolute w-28 h-28 rounded-full bg-amber-500/20 blur-xl pointer-events-none" />
            
            {/* Realistic Glass Jar SVG */}
            <svg width="110" height="140" viewBox="0 0 120 150" className="relative z-10 drop-shadow-lg">
              {/* Pedestal Coaster */}
              <ellipse cx="60" cy="142" rx="42" ry="7" fill="var(--border)" />
              <rect x="22" y="136" width="76" height="6" rx="2" fill="var(--text-tertiary)" opacity="0.4" />
              
              {/* Outer Jar Wall */}
              <path
                d="M 28 36 L 92 36 C 96 36, 100 40, 99 46 L 95 130 C 94 136, 88 140, 82 140 L 38 140 C 32 140, 26 136, 25 130 L 21 46 C 20 40, 24 36, 28 36 Z"
                fill="rgba(255, 255, 255, 0.05)"
                stroke="var(--border)"
                strokeWidth="1.5"
              />
              {/* Honey Fluid */}
              <defs>
                <linearGradient id="passportHoneyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#EAB308" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#CA8A04" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d="M 27 50 Q 60 46 93 50 L 91 128 C 90 133, 85 136, 80 136 L 40 136 C 35 136, 30 133, 29 128 Z"
                fill="url(#passportHoneyGrad)"
              />
              {/* Label */}
              <rect x="42" y="72" width="36" height="38" rx="3" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />
              <text x="60" y="88" textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="serif" fill="var(--accent)">
                HC
              </text>
              <text x="60" y="98" textAnchor="middle" fontSize="6" fontFamily="sans-serif" letterSpacing="0.5" fill="var(--text-secondary)">
                BATCH
              </text>
              {/* Lid */}
              <path
                d="M 22 24 L 98 24 C 100 24, 102 26, 101 28 L 97 36 L 23 36 L 19 28 C 18 26, 20 24, 22 24 Z"
                fill="#78350F"
              />
              <rect x="20" y="20" width="80" height="5" rx="2" fill="#92400E" />
              <line x1="24" y1="36" x2="96" y2="36" stroke="#D97706" strokeWidth="2" strokeDasharray="3,1" />
            </svg>
          </div>

          <div className="mt-3 text-center">
            <span className="font-mono text-xs font-semibold text-[var(--accent)] tracking-wider block">
              {batch.id}
            </span>
            <span className="font-serif font-bold text-sm text-[var(--text-primary)]">
              {batch.name}
            </span>
          </div>

          <Link 
            to={`/verify/${batch.id}`}
            className="mt-4 flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline font-medium"
          >
            <QrCode size={13} />
            <span>Consumer QR Link</span>
          </Link>
        </div>

        {/* Right Column: Provenance Certificate Attributes */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-serif tracking-[0.2em] uppercase text-[var(--accent)] font-semibold">
                  Official Digital Provenance
                </span>
                <Sparkles size={13} className="text-[var(--accent)]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-0.5 tracking-tight">
                HONEY PASSPORT
              </h2>
            </div>
            
            <div className="flex items-center gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 px-3.5 py-1.5 rounded-full border border-green-500/20 text-xs font-bold tracking-wider self-start sm:self-auto">
              <CheckCircle size={15} />
              <span>VERIFIED ✓</span>
            </div>
          </div>

          {/* 6 Grid Fields matching Reference Exactly */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-6">
            <div>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Origin
              </span>
              <span className="font-serif font-bold text-base sm:text-lg text-[var(--text-primary)] block">
                {batch.location}, India
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Harvest Hive
              </span>
              <Link 
                to={`/smart-hives/${batch.hiveId}`}
                className="font-serif font-bold text-base sm:text-lg text-[var(--accent)] hover:underline block"
              >
                {batch.hiveId} →
              </Link>
            </div>

            <div>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Harvest Date
              </span>
              <span className="font-serif font-bold text-base sm:text-lg text-[var(--text-primary)] block">
                28 Aug 2026
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Floral Source
              </span>
              <span className="font-serif font-bold text-base sm:text-lg text-[var(--text-primary)] block">
                {batch.passport.floralSource}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Quantity
              </span>
              <span className="font-serif font-bold text-base sm:text-lg text-[var(--text-primary)] block">
                {batch.weightKg} kg
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Quality
              </span>
              <span className="font-serif font-bold text-base sm:text-lg text-green-600 dark:text-green-400 block">
                Verified (Grade A)
              </span>
            </div>
          </div>

          {/* Lab Telemetry Specs */}
          <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[var(--text-secondary)] block">Moisture</span>
              <span className="font-bold text-[var(--text-primary)] text-sm">{batch.passport.moisture}%</span>
              <span className="text-[10px] text-green-600 font-medium">Safe (&lt; 18%)</span>
            </div>
            <div className="border-x border-[var(--border)]">
              <span className="text-[var(--text-secondary)] block">Purity</span>
              <span className="font-bold text-[var(--text-primary)] text-sm">{batch.passport.purity}%</span>
              <span className="text-[10px] text-green-600 font-medium">Unadulterated</span>
            </div>
            <div>
              <span className="text-[var(--text-secondary)] block">HMF Level</span>
              <span className="font-bold text-[var(--text-primary)] text-sm">{batch.passport.hmfLevel} mg/kg</span>
              <span className="text-[10px] text-green-600 font-medium">Raw & Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoneyPassportCard;
