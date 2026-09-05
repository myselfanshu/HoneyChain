import React from 'react';
import HeroSection from '@/components/hero/HeroSection';
import { Link } from 'react-router-dom';
import { Box, Award, GitBranch, QrCode, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full min-h-screen bg-[var(--background)] text-[var(--text-primary)] space-y-16 pb-20 animate-fade-in">
      {/* Editorial Hero with Integrated 3D Visual & Core Pillars */}
      <HeroSection />

      {/* Interactive Platform Tour / Feature Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-serif uppercase tracking-[0.25em] text-[var(--accent)] font-semibold block mb-2">
            {t.hero.ecosystemTitle}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
            {t.hero.ecosystemHeading}
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-3 leading-relaxed">
            {t.hero.ecosystemSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Smart Hives */}
          <Link 
            to="/smart-hives" 
            className="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] flex items-center justify-center mb-5 border border-[var(--border)] group-hover:scale-105 transition-transform">
                <Box size={24} />
              </div>
              <span className="font-mono text-[10px] text-[var(--accent)] uppercase font-semibold block mb-1">
                {t.hero.card1Badge}
              </span>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                {t.nav.smartHives}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t.hero.card1Desc}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
              <span>{t.hero.card1Button}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Honey Passport */}
          <Link 
            to="/honey-passport" 
            className="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] flex items-center justify-center mb-5 border border-[var(--border)] group-hover:scale-105 transition-transform">
                <Award size={24} />
              </div>
              <span className="font-mono text-[10px] text-[var(--accent)] uppercase font-semibold block mb-1">
                {t.hero.card2Badge}
              </span>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                {t.nav.honeyPassport}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t.hero.card2Desc}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
              <span>{t.hero.card2Button}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Blockchain Traceability */}
          <Link 
            to="/traceability" 
            className="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] flex items-center justify-center mb-5 border border-[var(--border)] group-hover:scale-105 transition-transform">
                <GitBranch size={24} />
              </div>
              <span className="font-mono text-[10px] text-[var(--accent)] uppercase font-semibold block mb-1">
                {t.hero.card3Badge}
              </span>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                {t.nav.traceability}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t.hero.card3Desc}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
              <span>{t.hero.card3Button}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Consumer Verification */}
          <Link 
            to="/verify/HC-2026-0142" 
            className="group p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] flex items-center justify-center mb-5 border border-[var(--border)] group-hover:scale-105 transition-transform">
                <QrCode size={24} />
              </div>
              <span className="font-mono text-[10px] text-[var(--accent)] uppercase font-semibold block mb-1">
                {t.hero.card4Badge}
              </span>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                {t.overview.qrStory}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t.hero.card4Desc}
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
              <span>{t.hero.card4Button}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
