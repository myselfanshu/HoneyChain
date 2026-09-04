import React from 'react';
import HeroSection from '@/components/hero/HeroSection';
import ValuePillars from '@/components/hero/ValuePillars';
import { Link } from 'react-router-dom';
import { Box, Award, GitBranch, ShoppingBag, QrCode, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[var(--background)] text-[var(--text-primary)] space-y-12 pb-16 animate-fade-in">
      {/* Editorial Hero */}
      <HeroSection />

      {/* Core Brand Pillars: TRACE, VERIFY, PREDICT, CONNECT */}
      <ValuePillars />

      {/* Interactive Platform Tour / Feature Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-serif uppercase tracking-[0.25em] text-[var(--accent)] font-semibold block mb-2">
            The Honey Chain Ecosystem
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--text-primary)] tracking-tight">
            How Every Drop Tells Its Story
          </h2>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-3 leading-relaxed">
            From IoT acoustic hive telemetry in Uttar Pradesh to consumer smartphone verification at the dinner table.
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
                Telemetry & Journal
              </span>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                Smart Hives
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Acoustic frequency analysis, internal temperature, colony humidity, and automated swarm early warning indicators.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
              <span>Explore Apiary Hives</span>
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
                Digital Certificate
              </span>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                Honey Passport
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Immutable origin certificates, floral pollen classification, moisture levels, HMF analysis, and 96/100 Trust Score.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
              <span>Inspect Batch HC-0142</span>
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
                Polygon PoS Consensus
              </span>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                Traceability
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Chain of custody handoffs signed by beekeepers, labs, processors, and packers with verified transaction hashes.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
              <span>View Block Ledger</span>
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
                Jar Label QR Scan
              </span>
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                Consumer QR Story
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Scan the physical jar to instantly reveal batch origins, harvest timestamp, laboratory tests, and beekeeper notes.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[var(--border)] flex items-center justify-between text-xs font-semibold text-[var(--accent)]">
              <span>Open Mobile Preview</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
