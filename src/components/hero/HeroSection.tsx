import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, Play, Route, ShieldCheck, Sparkles, HeartHandshake } from 'lucide-react';
import HeroVisual3D from './HeroVisual3D';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-[88vh] flex flex-col justify-between px-4 sm:px-6 lg:px-8 pt-8 pb-12 overflow-hidden max-w-7xl mx-auto">
      {/* Top Bar / Intro Trigger */}
      <div className="flex justify-end mb-6">
        <Link
          to="/honey-passport/HC-2026-0142"
          className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] bg-[var(--surface)] hover:bg-[var(--surface-secondary)] px-4 py-2 rounded-full border border-[var(--border)] transition-all shadow-xs hover:border-[var(--accent)]"
        >
          <Play size={11} className="text-[var(--accent)] fill-[var(--accent)]" />
          <span>Watch Provenance Journey</span>
          <span className="text-[var(--accent)] font-bold">›</span>
        </Link>
      </div>

      {/* Main 2-Column Hero Grid matching Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center flex-1 my-auto">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-6 flex flex-col items-start z-10 space-y-6">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[1.05] text-[var(--text-primary)] font-bold tracking-tight">
            EVERY DROP<br />
            <span className="text-[var(--accent)] font-serif">HAS A STORY.</span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-[var(--text-secondary)] max-w-lg leading-relaxed">
            Honey Chain connects beekeepers, hives and consumers through transparency, intelligence and trust.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3 w-full sm:w-auto">
            <Link
              to="/overview"
              className="px-8 py-3.5 bg-[var(--accent)] text-white font-sans font-bold tracking-widest text-xs uppercase rounded-full flex items-center justify-center gap-2 hover:opacity-95 shadow-md shadow-amber-500/20 hover:shadow-lg transition-all"
            >
              <span>EXPLORE PLATFORM</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/verify/HC-2026-0142"
              className="px-8 py-3.5 border border-[var(--border)] text-[var(--text-primary)] bg-[var(--surface)] font-sans font-bold tracking-widest text-xs uppercase rounded-full flex items-center justify-center hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-xs"
            >
              <span>VERIFY A BATCH</span>
            </Link>
          </div>

          <div className="pt-2 text-[var(--text-secondary)] hidden sm:block">
            <div className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center">
              <ArrowDown size={14} className="text-[var(--accent)] animate-bounce" />
            </div>
          </div>
        </div>

        {/* Right Column: 3D Artwork Composition */}
        <div className="lg:col-span-6 w-full flex items-center justify-center">
          <HeroVisual3D />
        </div>
      </div>

      {/* Bottom 4 Brand Value Pillars — Matching Reference Hero */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-12 border-t border-[var(--border)] mt-12">
        <div className="p-4 rounded-2xl bg-[var(--surface)]/50 border border-[var(--border)] flex flex-col gap-1.5 hover:border-[var(--accent)]/50 transition-colors">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <Route size={16} />
            <span className="font-mono text-xs uppercase font-bold tracking-wider">TRACE</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">Every action is immutably recorded.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)]/50 border border-[var(--border)] flex flex-col gap-1.5 hover:border-[var(--accent)]/50 transition-colors">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <ShieldCheck size={16} />
            <span className="font-mono text-xs uppercase font-bold tracking-wider">VERIFY</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">Every batch is lab & consensus verified.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)]/50 border border-[var(--border)] flex flex-col gap-1.5 hover:border-[var(--accent)]/50 transition-colors">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <Sparkles size={16} />
            <span className="font-mono text-xs uppercase font-bold tracking-wider">PREDICT</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">Acoustic insights for healthier hives.</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface)]/50 border border-[var(--border)] flex flex-col gap-1.5 hover:border-[var(--accent)]/50 transition-colors">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <HeartHandshake size={16} />
            <span className="font-mono text-xs uppercase font-bold tracking-wider">CONNECT</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">From pristine apiaries to table.</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
