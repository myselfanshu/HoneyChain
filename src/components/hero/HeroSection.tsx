import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown } from 'lucide-react';

const Hexagon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 115" className={className} xmlns="http://www.w3.org/2000/svg">
    <polygon points="50 0 100 28.86 100 86.6 50 115.47 0 86.6 0 28.86" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const Bee = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M12 2C9 2 7 4 7 7C7 8 8 9 9 9C10 9 11 8 12 8C13 8 14 9 15 9C16 9 17 8 17 7C17 4 15 2 12 2ZM8 10C6 10 4 12 4 14C4 16 6 18 8 18L10 16L8 14L10 12L8 10ZM16 10L14 12L16 14L14 16L16 18C18 18 20 16 20 14C20 12 18 10 16 10ZM12 11C11.5 11 11 11.5 11 12L11 16C11 16.5 11.5 17 12 17C12.5 17 13 16.5 13 16L13 12C13 11.5 12.5 11 12 11Z" />
  </svg>
);

const HoneycombArt = () => {
  return (
    <div className="relative w-full h-[400px] lg:h-[600px] flex items-center justify-center overflow-visible">
      {/* Central big hex */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 text-[var(--accent)] opacity-80 dark:opacity-20 animate-[pulse_4s_ease-in-out_infinite]">
        <Hexagon />
      </div>
      
      {/* Cluster 1 */}
      <div className="absolute top-1/4 left-1/3 w-32 text-amber-500 opacity-60 dark:opacity-30 dark:stroke-[var(--accent)] dark:fill-transparent animate-[bounce_6s_infinite]">
        <Hexagon />
      </div>
      <div className="absolute top-1/3 left-1/4 w-24 text-yellow-500 opacity-70 dark:opacity-40 animate-[bounce_5s_infinite_0.5s]">
        <Hexagon />
      </div>

      {/* Cluster 2 */}
      <div className="absolute bottom-1/4 right-1/4 w-40 text-amber-600 opacity-50 dark:opacity-20 dark:stroke-[var(--accent)] dark:fill-transparent animate-[pulse_5s_infinite_1s]">
        <Hexagon />
      </div>
      <div className="absolute bottom-1/3 right-1/3 w-28 text-yellow-600 opacity-60 dark:opacity-30 animate-[bounce_7s_infinite_1s]">
        <Hexagon />
      </div>

      {/* Bees */}
      <div className="absolute top-1/3 right-1/4 w-8 text-[var(--text-primary)] animate-[bounce_3s_infinite]">
        <Bee />
      </div>
      <div className="absolute bottom-1/3 left-1/3 w-6 text-[var(--text-primary)] animate-[bounce_4s_infinite_0.5s]">
        <Bee />
      </div>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--accent)] blur-[100px] opacity-20 rounded-full pointer-events-none"></div>
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full min-h-[90vh] flex flex-col justify-center px-6 pt-20 lg:pt-0 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-grow">
        
        {/* Left: Text Content */}
        <div className="flex flex-col items-start z-10 space-y-8">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-[var(--text-primary)] font-bold tracking-tight">
            EVERY DROP <br />
            <span className="italic font-light text-[var(--text-secondary)]">HAS A</span> STORY.
          </h1>
          <p className="font-sans text-lg md:text-xl text-[var(--text-secondary)] max-w-lg leading-relaxed">
            Honey Chain connects beekeepers, hives and consumers through transparency, intelligence and trust.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link 
              to="/overview" 
              className="w-full sm:w-auto px-8 py-4 bg-[var(--accent)] text-[var(--background)] font-sans font-bold tracking-widest text-sm rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
            >
              EXPLORE PLATFORM
              <ArrowRight size={18} />
            </Link>
            <Link 
              to="/verify/HC-2026-0142" 
              className="w-full sm:w-auto px-8 py-4 border border-[var(--text-primary)] text-[var(--text-primary)] font-sans font-bold tracking-widest text-sm rounded-full flex items-center justify-center hover:bg-[var(--text-primary)] hover:text-[var(--background)] transition-colors"
            >
              VERIFY A BATCH
            </Link>
          </div>
        </div>

        {/* Right: Honeycomb Art */}
        <div className="w-full z-0 h-full flex items-center justify-center mt-12 lg:mt-0">
          <HoneycombArt />
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative lg:absolute lg:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10 text-[var(--text-secondary)] mt-12 lg:mt-0 pb-8 lg:pb-0">
        <span className="font-sans text-xs tracking-widest uppercase font-bold">Scroll to explore</span>
        <ArrowDown size={16} />
      </div>
    </div>
  );
};

export default HeroSection;
