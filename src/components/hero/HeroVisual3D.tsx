import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sparkles, ShieldCheck } from 'lucide-react';
import heroLight from '@/assets/hero/hero_light.jpg';
import heroDark from '@/assets/hero/hero_dark.jpg';

export const HeroVisual3D: React.FC = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeBadge, setActiveBadge] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || window.innerWidth < 1024) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      // Smooth subtle tilt range (-4deg to +4deg)
      setTilt({
        x: Math.max(-1, Math.min(1, x)) * 5,
        y: Math.max(-1, Math.min(1, y)) * -5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const imageSrc = theme === 'dark' ? heroDark : heroLight;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      className="relative w-full max-w-[560px] mx-auto perspective-1000 select-none group"
      style={{ perspective: '1200px' }}
    >
      {/* Ambient background light diffuser */}
      <div 
        className="absolute -inset-4 bg-gradient-to-tr from-amber-500/15 via-yellow-500/10 to-amber-700/15 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      />

      {/* Main 3D Card Vessel with Parallax Tilt */}
      <div
        className="relative rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl transition-transform duration-300 ease-out bg-[var(--surface)]"
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale3d(${isHovered ? 1.01 : 1}, ${isHovered ? 1.01 : 1}, 1)`,
          boxShadow: theme === 'dark' 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.15)'
            : '0 25px 50px -12px rgba(217, 119, 6, 0.18), 0 0 20px rgba(245, 158, 11, 0.1)',
        }}
      >
        {/* The 3D Render Image with smooth scale and soft lighting */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={imageSrc}
            alt="HoneyChain 3D Honeycomb with Wildflower Flora and Honeybees"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="eager"
          />

          {/* Luxury subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 pointer-events-none" />

          {/* Interactive Provenance Hotspots / Annotation Chips */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setActiveBadge(activeBadge === 'cert' ? null : 'cert')}
              onMouseEnter={() => setActiveBadge('cert')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-sans font-medium hover:bg-black/60 transition-all shadow-lg"
            >
              <ShieldCheck size={13} className="text-amber-400" />
              <span>Consensus Sealed</span>
            </button>
          </div>

          <div className="absolute bottom-4 left-4 z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] text-[var(--text-primary)] text-xs font-serif font-semibold shadow-md">
              <Sparkles size={13} className="text-[var(--accent)] animate-pulse" />
              <span>100% Raw Mustard & Wildflower Comb</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating subtle aesthetic badge */}
      <div 
        className="absolute -bottom-3 -right-3 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl z-20 text-xs text-[var(--text-secondary)] font-mono"
        style={{
          transform: `translate3d(${tilt.x * -1.2}px, ${tilt.y * -1.2}px, 20px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
        <span className="text-[var(--text-primary)] font-bold">24 Hives Monitored</span>
      </div>
    </div>
  );
};

export default HeroVisual3D;
