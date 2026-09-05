import React from 'react';
import { Home, Droplet, ShieldCheck, Factory, Package, ShoppingCart } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

interface StoryProps {
  batchId?: string;
}

export const StoryOfYourHoney: React.FC<StoryProps> = ({ batchId = 'HC-2026-0142' }) => {
  const { t } = useTranslation();

  const journeySteps = [
    { icon: Home, label: t.consumer.stageHive, sub: 'H-104', active: true },
    { icon: Droplet, label: t.consumer.stageHarvested, sub: '28 Aug', active: true },
    { icon: ShieldCheck, label: t.consumer.stageVerified, sub: 'Grade A', active: true },
    { icon: Factory, label: t.consumer.stageProcessed, sub: '29 Aug', active: true },
    { icon: Package, label: t.consumer.stagePackaged, sub: '30 Aug', active: true },
    { icon: ShoppingCart, label: t.consumer.stageMarket, sub: '31 Aug', active: true }
  ];

  return (
    <div className="bg-[var(--surface)] p-6 sm:p-8 rounded-3xl border border-[var(--border)] flex flex-col justify-between h-full shadow-sm">
      <div>
        <div className="text-center mb-8 pb-4 border-b border-[var(--border)]">
          <span className="text-xs font-serif uppercase tracking-[0.2em] text-[var(--accent)] font-semibold block">
            {t.consumer.batchId} #{batchId}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mt-1">
            {t.consumer.storyTitle}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">{t.consumer.storySubtitle}</p>
        </div>
        
        {/* Horizontal 6-Stage Timeline */}
        <div className="relative mb-8 px-2">
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-[var(--accent)] z-0 hidden sm:block opacity-40"></div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-2 relative z-10">
            {journeySteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[var(--accent)] bg-[var(--surface)] text-[var(--accent)] shadow-xs mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-serif font-bold text-[var(--text-primary)] truncate max-w-[80px]">{step.label}</p>
                    <p className="text-[10px] text-[var(--accent)] font-medium mt-0.5">{step.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botanical / Field Visual Banner with Warm Ambient Aesthetic */}
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-amber-900/10 border border-[var(--accent)]/30 text-center my-6 flex flex-col items-center justify-center">
          {/* Subtle Decorative Floral Background Shapes */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[var(--accent)]/10 blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

          {/* Honey Jar & Bee Silhouette SVG */}
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-[var(--accent)]">
              <path d="M24 6L38 14V34L24 42L10 34V14L24 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M24 16L31 20V28L24 32L17 28V20L24 16Z" fill="currentColor" opacity="0.25" />
              <circle cx="24" cy="24" r="3" fill="currentColor" />
            </svg>
          </div>

          {/* Pan-India Story Statement in Active Language */}
          <p className="text-base sm:text-lg text-[var(--text-primary)] max-w-md mx-auto leading-relaxed italic font-serif">
            “{t.consumer.storyStatement}”
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider bg-[var(--surface)]/80 backdrop-blur-xs px-3 py-1 rounded-full border border-[var(--border)]">
            <span>{t.consumer.apiaryCoordinates}: 27.1767° N, 78.0081° E</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-4 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] font-medium tracking-wide">
        {t.consumer.thankYou}
      </div>
    </div>
  );
};

export default StoryOfYourHoney;
