import React from 'react';
import { Home, Droplet, ShieldCheck, Factory, Package, ShoppingBag, Check } from 'lucide-react';

const steps = [
  { id: 1, title: 'Hive Monitored', date: '25 Aug 2026', sub: 'H-104 Telemetry', icon: Home, completed: true },
  { id: 2, title: 'Harvest Recorded', date: '28 Aug 2026', sub: '18.4 kg Extracted', icon: Droplet, completed: true },
  { id: 3, title: 'Quality Verified', date: '28 Aug 2026', sub: 'Purity 99.2%', icon: ShieldCheck, completed: true },
  { id: 4, title: 'Processed', date: '29 Aug 2026', sub: 'Filtered & Tested', icon: Factory, completed: true },
  { id: 5, title: 'Packaged', date: '30 Aug 2026', sub: 'Batch Sealed', icon: Package, completed: true },
  { id: 6, title: 'Market Ready', date: '31 Aug 2026', sub: 'Available for Sale', icon: ShoppingBag, completed: true },
];

export const JourneySnapshot: React.FC = () => {
  return (
    <div className="w-full mt-8 p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border)]">
        <div>
          <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">Journey Snapshot</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">Cryptographically sequenced lifecycle from apiary to shelf.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--accent)] font-medium bg-[var(--surface-secondary)] px-3 py-1 rounded-full border border-[var(--border)]">
          <Check size={14} />
          <span>All 6 Milestones Sealed</span>
        </div>
      </div>

      <div className="relative">
        {/* Connecting track line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-[var(--border)] z-0 hidden md:block" />
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-[var(--accent)] z-0 hidden md:block" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 md:gap-2 relative z-10">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-row md:flex-col items-center md:text-center gap-3 md:gap-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-[var(--surface)] bg-[var(--accent)] text-white shadow-md shrink-0">
                  <Icon size={18} />
                </div>
                <div className="md:mt-3">
                  <div className="font-serif font-bold text-sm text-[var(--text-primary)]">{step.title}</div>
                  <div className="text-xs font-medium text-[var(--accent)] mt-0.5">{step.date}</div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{step.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JourneySnapshot;
