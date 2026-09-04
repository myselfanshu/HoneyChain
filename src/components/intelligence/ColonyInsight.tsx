import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Link } from 'react-router-dom';

export const ColonyInsight: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[var(--surface)] p-6 sm:p-7 rounded-3xl border border-[var(--border)] h-full flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <ShieldAlert className="w-5 h-5 text-[var(--accent)]" />
              <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">Colony Insight</h2>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[var(--accent)] border border-[var(--accent)]/20 font-semibold">
              ACOUSTIC ANOMALY
            </span>
          </div>
          
          <p className="text-[var(--text-secondary)] mb-6 text-sm sm:text-base leading-relaxed">
            Hive <Link to="/smart-hives/H-104" className="font-bold text-[var(--text-primary)] underline hover:text-[var(--accent)]">H-104</Link> has shown an <span className="text-[var(--accent)] font-semibold">18% drop</span> in acoustic frequency compared to its baseline circadian pattern.
          </p>
          
          <div className="mb-6 p-4 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)]">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[var(--text-secondary)] font-medium">AI Confidence Model</span>
              <span className="text-[var(--accent)] font-bold">82% (High Correlation)</span>
            </div>
            <div className="w-full bg-[var(--surface)] rounded-full h-2 overflow-hidden border border-[var(--border)]">
              <div className="bg-[var(--accent)] h-full rounded-full transition-all duration-1000" style={{ width: '82%' }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mt-2">
              <span>Risk Factor: Queen cell piping</span>
              <span>Potential swarm in 48h</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-[var(--border)] text-[var(--text-primary)] rounded-xl hover:border-[var(--accent)] hover:bg-[var(--surface-secondary)] transition-all font-medium text-sm shadow-xs"
        >
          <span>View Full Diagnostic</span>
          <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Colony Acoustic Diagnostic: Hive H-104"
      >
        <div className="space-y-4 text-xs font-sans text-[var(--text-secondary)]">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[var(--text-primary)]">
            <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400 mb-1">
              <AlertTriangle size={16} />
              <span>Recommended Action: Physical Apiary Inspection within 24 hours</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Acoustic sensors detected a drop from 240Hz (active queen foraging) to 195Hz. This shift typically precedes swarm departure or queen supersedure.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
              <span className="text-[10px] uppercase font-semibold block text-[var(--text-secondary)]">Current Frequency</span>
              <span className="font-mono text-lg font-bold text-[var(--text-primary)]">196.4 Hz</span>
              <span className="text-[10px] text-amber-600 font-medium">↓ 18.2% drop</span>
            </div>
            <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
              <span className="text-[10px] uppercase font-semibold block text-[var(--text-secondary)]">Colony Biomass</span>
              <span className="font-mono text-lg font-bold text-[var(--text-primary)]">42.1 kg</span>
              <span className="text-[10px] text-green-600 font-medium">Stable mass</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center">
            <Link 
              to="/smart-hives/H-104"
              className="text-xs text-[var(--accent)] font-semibold hover:underline"
            >
              Open Hive H-104 Telemetry →
            </Link>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ColonyInsight;
