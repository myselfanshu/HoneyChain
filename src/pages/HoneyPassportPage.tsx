import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HoneyPassportCard } from '@/components/passport/HoneyPassport';
import { JourneySnapshot } from '@/components/passport/JourneySnapshot';
import { TrustScore } from '@/components/ui/TrustScore';
import { batches } from '@/data/batches';
import { Modal } from '@/components/ui/Modal';
import { Award, ArrowRight, ShieldCheck, CheckCircle2, ChevronDown } from 'lucide-react';

export const HoneyPassportPage: React.FC = () => {
  const { batchId } = useParams<{ batchId?: string }>();
  const [selectedBatchId, setSelectedBatchId] = useState(batchId || 'HC-2026-0142');
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const currentBatch = batches.find(b => b.id.toLowerCase() === selectedBatchId.toLowerCase()) 
    || batches.find(b => b.id === 'HC-2026-0142') 
    || batches[0]!;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)]">
              <Award size={22} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">Honey Passport</h1>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-0.5">
                Cryptographic provenance, lab testing purity, and harvest certificate.
              </p>
            </div>
          </div>
        </div>

        {/* Batch Selector Dropdown */}
        <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-3.5 py-2 rounded-xl text-sm self-start sm:self-auto">
          <span className="text-[var(--text-secondary)] font-medium">Batch:</span>
          <select 
            value={currentBatch.id}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="bg-transparent font-mono font-semibold text-[var(--accent)] focus:outline-none cursor-pointer"
          >
            {batches.map(b => (
              <option key={b.id} value={b.id} className="bg-[var(--surface)] text-[var(--text-primary)]">
                {b.id} — {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Passport Certificate + Trust Score Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        <div className="lg:col-span-2">
          <HoneyPassportCard batch={currentBatch} />
        </div>
        
        {/* Trust Score Column matching Reference exactly */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 flex flex-col items-center justify-between h-full text-center shadow-sm">
            <div className="w-full text-center pb-2 border-b border-[var(--border)]">
              <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">Trust Score</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Multi-factor cryptographic consensus</p>
            </div>
            
            <div className="my-6">
              <TrustScore score={currentBatch.trustScore} maxScore={100} size="lg" />
            </div>
            
            <div className="space-y-4 w-full">
              <p className="text-[var(--text-secondary)] text-xs leading-relaxed max-w-xs mx-auto">
                This score is based on the complete journey, sensor stability, moisture index, and blockchain verification of this honey batch.
              </p>
              
              <button 
                onClick={() => setIsScoreModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl border border-[var(--border)] text-[var(--text-primary)] font-medium text-sm hover:bg-[var(--surface-secondary)] hover:border-[var(--accent)] transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>View Full Score Breakdown</span>
                <ArrowRight size={14} className="text-[var(--accent)]" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Horizontal Lifecycle Snapshot */}
      <div>
        <JourneySnapshot />
      </div>

      {/* Trust Score Breakdown Modal */}
      <Modal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        title="Trust Score Methodology (96/100)"
      >
        <div className="space-y-4 text-sm text-[var(--text-secondary)]">
          <p>
            The Honey Chain Trust Score aggregates 4 primary telemetry dimensions into a weighted index:
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex justify-between items-center">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Hive Environmental Health (30%)</p>
                <p className="text-xs">Temperature and humidity within optimal range for &gt; 95% of cycle.</p>
              </div>
              <span className="font-bold text-[var(--accent)] font-serif text-lg">29/30</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex justify-between items-center">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Lab Certified Purity (30%)</p>
                <p className="text-xs">Moisture {currentBatch.passport.moisture}%, zero antibiotic residues detected.</p>
              </div>
              <span className="font-bold text-[var(--accent)] font-serif text-lg">30/30</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex justify-between items-center">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Chain of Custody Continuity (25%)</p>
                <p className="text-xs">All 5 handoffs signed by authorized cryptographic keys.</p>
              </div>
              <span className="font-bold text-[var(--accent)] font-serif text-lg">24/25</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex justify-between items-center">
              <div>
                <p className="font-semibold text-[var(--text-primary)]">Storage & Transit Stability (15%)</p>
                <p className="text-xs">Low HMF level confirms gentle handling without overheating.</p>
              </div>
              <span className="font-bold text-[var(--accent)] font-serif text-lg">13/15</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex justify-end">
            <button
              onClick={() => setIsScoreModalOpen(false)}
              className="px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HoneyPassportPage;
