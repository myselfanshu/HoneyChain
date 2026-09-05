import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRVerification } from '@/components/verify/QRVerification';
import { StoryOfYourHoney } from '@/components/verify/StoryOfYourHoney';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { useTranslation } from '@/contexts/LanguageContext';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const VerifyPage: React.FC = () => {
  const { batchId = 'HC-2026-0142' } = useParams<{ batchId?: string }>();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col font-sans transition-colors">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        {/* Verification Top Nav */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[var(--border)] gap-3 flex-wrap">
          <Link 
            to="/overview"
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{t.consumer.enterPlatform}</span>
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 font-medium">
              <ShieldCheck size={14} />
              <span>{t.consumer.portalBadge}</span>
            </span>

            {/* Consumer Dedicated Language Selector */}
            <LanguageSelector />

            <ThemeToggle />
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-10">
          <span className="font-sans text-xs font-semibold tracking-[0.25em] text-[var(--accent)] uppercase block mb-1">
            {t.consumer.verifiedProvenance}
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif text-[var(--text-primary)] font-bold mb-2">
            {t.common.brandFullName}
          </h1>
          <p className="text-[var(--text-secondary)] uppercase tracking-widest text-xs font-medium">
            {t.consumer.tagline}
          </p>
        </div>

        {/* Dual Phone Showcase + Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch flex-1 pb-12">
          <div className="h-full flex items-center justify-center">
            <QRVerification batchId={batchId} />
          </div>
          <div className="h-full">
            <StoryOfYourHoney batchId={batchId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
