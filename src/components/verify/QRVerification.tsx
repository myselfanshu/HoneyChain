import React from 'react';
import { CheckCircle2, QrCode, ArrowRight, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QRVerificationProps {
  batchId?: string;
}

export const QRVerification: React.FC<QRVerificationProps> = ({ batchId = 'HC-2026-0142' }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
      {/* Phone 1: Scan View */}
      <div className="flex flex-col items-center">
        <span className="text-xs font-serif uppercase tracking-widest text-[var(--accent)] font-semibold mb-3">
          Consumer Verification (Mobile)
        </span>
        
        {/* Smartphone Frame */}
        <div className="w-[280px] h-[520px] rounded-[40px] p-3 bg-neutral-900 shadow-2xl border-4 border-neutral-700 relative flex flex-col">
          {/* Phone Speaker Notch */}
          <div className="w-24 h-4 bg-neutral-800 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
            <div className="w-8 h-1 bg-neutral-600 rounded-full" />
          </div>

          {/* Screen Content */}
          <div className="flex-1 rounded-[30px] bg-[var(--surface)] p-5 flex flex-col items-center justify-between text-center overflow-hidden border border-[var(--border)]">
            <div className="pt-2">
              <span className="font-serif font-bold text-xs tracking-wider text-[var(--text-secondary)] block">HONEY CHAIN</span>
              <h4 className="font-serif text-sm font-bold text-[var(--text-primary)] mt-1">
                Scan the QR on your honey jar
              </h4>
            </div>

            {/* QR Code Graphic Frame */}
            <div className="p-4 rounded-2xl bg-white shadow-inner border border-neutral-200 relative my-auto">
              <svg width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Simulated crisp QR code pattern with finder patterns */}
                {/* Top-Left Finder */}
                <rect x="5" y="5" width="26" height="26" rx="4" fill="#1C1C1C" />
                <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                <rect x="13" y="13" width="10" height="10" rx="1" fill="#1C1C1C" />

                {/* Top-Right Finder */}
                <rect x="69" y="5" width="26" height="26" rx="4" fill="#1C1C1C" />
                <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                <rect x="77" y="13" width="10" height="10" rx="1" fill="#1C1C1C" />

                {/* Bottom-Left Finder */}
                <rect x="5" y="69" width="26" height="26" rx="4" fill="#1C1C1C" />
                <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                <rect x="13" y="77" width="10" height="10" rx="1" fill="#1C1C1C" />

                {/* Data modules */}
                <rect x="37" y="8" width="6" height="6" fill="#1C1C1C" />
                <rect x="47" y="12" width="6" height="6" fill="#1C1C1C" />
                <rect x="57" y="8" width="6" height="6" fill="#1C1C1C" />
                <rect x="37" y="22" width="6" height="6" fill="#1C1C1C" />
                <rect x="51" y="24" width="6" height="6" fill="#1C1C1C" />
                
                <rect x="8" y="37" width="6" height="6" fill="#1C1C1C" />
                <rect x="20" y="47" width="6" height="6" fill="#1C1C1C" />
                <rect x="12" y="55" width="6" height="6" fill="#1C1C1C" />
                <rect x="35" y="35" width="8" height="8" rx="2" fill="#D4920A" />
                <rect x="47" y="45" width="8" height="8" rx="2" fill="#D4920A" />
                <rect x="59" y="35" width="8" height="8" rx="2" fill="#D4920A" />
                
                <rect x="72" y="38" width="6" height="6" fill="#1C1C1C" />
                <rect x="84" y="48" width="6" height="6" fill="#1C1C1C" />
                <rect x="76" y="58" width="6" height="6" fill="#1C1C1C" />

                <rect x="38" y="62" width="6" height="6" fill="#1C1C1C" />
                <rect x="50" y="68" width="6" height="6" fill="#1C1C1C" />
                <rect x="62" y="62" width="6" height="6" fill="#1C1C1C" />
                <rect x="40" y="78" width="6" height="6" fill="#1C1C1C" />
                <rect x="54" y="82" width="6" height="6" fill="#1C1C1C" />
                <rect x="72" y="74" width="6" height="6" fill="#1C1C1C" />
                <rect x="84" y="84" width="6" height="6" fill="#1C1C1C" />
              </svg>
            </div>

            {/* Verification Status Pill */}
            <div className="w-full bg-[var(--surface-secondary)] p-2.5 rounded-xl border border-[var(--border)]">
              <span className="font-mono text-xs font-bold text-[var(--accent)] block">{batchId}</span>
              <div className="flex items-center justify-center gap-1 text-green-600 text-[11px] font-bold mt-0.5">
                <CheckCircle2 size={12} />
                <span>VERIFIED BATCH ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone 2: Result View */}
      <div className="flex flex-col items-center">
        <span className="text-xs font-serif uppercase tracking-widest text-[var(--accent)] font-semibold mb-3">
          Verification Result
        </span>
        
        {/* Smartphone Frame */}
        <div className="w-[280px] h-[520px] rounded-[40px] p-3 bg-neutral-900 shadow-2xl border-4 border-neutral-700 relative flex flex-col">
          {/* Phone Speaker Notch */}
          <div className="w-24 h-4 bg-neutral-800 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
            <div className="w-8 h-1 bg-neutral-600 rounded-full" />
          </div>

          {/* Screen Content */}
          <div className="flex-1 rounded-[30px] bg-[var(--surface)] p-5 flex flex-col items-center justify-between text-center overflow-hidden border border-[var(--border)]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-green-700 dark:text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-green-500/20">
                <CheckCircle2 size={11} />
                <span>VERIFIED BATCH</span>
              </div>
              <span className="font-mono text-[10px] text-[var(--text-secondary)] block uppercase tracking-wider">
                BATCH ID: {batchId}
              </span>
              <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">MUSTARD GOLD</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">Uttar Pradesh • Mustard</p>
              <p className="text-[10px] text-[var(--accent)] font-medium">Harvested on 28 Aug 2026</p>
            </div>

            {/* Honey Jar Visual on Coaster */}
            <div className="my-1 relative w-24 h-28 flex items-center justify-center">
              <svg width="84" height="108" viewBox="0 0 120 150">
                <ellipse cx="60" cy="142" rx="42" ry="7" fill="var(--border)" />
                <path
                  d="M 28 36 L 92 36 C 96 36, 100 40, 99 46 L 95 130 C 94 136, 88 140, 82 140 L 38 140 C 32 140, 26 136, 25 130 L 21 46 C 20 40, 24 36, 28 36 Z"
                  fill="rgba(255, 255, 255, 0.05)"
                  stroke="var(--border)"
                  strokeWidth="1.5"
                />
                <defs>
                  <linearGradient id="qrJarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="50%" stopColor="#EAB308" />
                    <stop offset="100%" stopColor="#CA8A04" />
                  </linearGradient>
                </defs>
                <path
                  d="M 27 50 Q 60 46 93 50 L 91 128 C 90 133, 85 136, 80 136 L 40 136 C 35 136, 30 133, 29 128 Z"
                  fill="url(#qrJarGrad)"
                />
                <rect x="42" y="72" width="36" height="36" rx="3" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />
                <text x="60" y="88" textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="serif" fill="var(--accent)">
                  HC
                </text>
                <path d="M 22 24 L 98 24 C 100 24, 102 26, 101 28 L 97 36 L 23 36 L 19 28 C 18 26, 20 24, 22 24 Z" fill="#78350F" />
                <rect x="20" y="20" width="80" height="5" rx="2" fill="#92400E" />
              </svg>
            </div>

            {/* Provenance Action Link */}
            <Link 
              to={`/honey-passport/${batchId}`}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--accent)] text-white font-medium text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>View Full Story & Certificate</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRVerification;
