import React, { useState } from 'react';
import { TraceabilityTimeline } from '@/components/traceability/TraceabilityTimeline';
import { ActorsInvolved } from '@/components/traceability/ActorsInvolved';
import { ExternalLink, GitBranch, ShieldCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export const TraceabilityPage: React.FC = () => {
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)]">
            <GitBranch size={22} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]">Traceability</h1>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-0.5">
              Blockchain-verified chain of custody and sensor verification history.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsContractModalOpen(true)}
          className="flex items-center gap-2 text-[var(--accent)] hover:opacity-90 transition-opacity font-medium bg-[var(--surface-secondary)] border border-[var(--border)] px-4 py-2.5 rounded-xl text-sm self-start sm:self-auto shadow-sm"
        >
          <span>View Smart Contract</span>
          <ExternalLink size={15} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <TraceabilityTimeline />
        </div>
        
        <div className="lg:col-span-1">
          <ActorsInvolved />
        </div>
      </div>

      {/* Smart Contract Info Modal */}
      <Modal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        title="Honey Chain Verification Smart Contract"
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
            <div className="flex items-center gap-2 text-[var(--accent)] font-semibold mb-1">
              <ShieldCheck size={16} />
              <span>Contract Standard: ERC-721 + EIP-5564 Provenance</span>
            </div>
            <p className="text-[var(--text-secondary)]">
              This contract issues a non-fungible provenance token for every certified honey batch upon lab verification.
            </p>
          </div>

          <div className="space-y-2 text-[var(--text-secondary)]">
            <div>
              <span className="font-semibold text-[var(--text-primary)] uppercase tracking-wider text-[10px] block">Contract Address</span>
              <span className="font-mono text-[var(--text-primary)] bg-[var(--surface-secondary)] p-2 rounded-lg block select-all border border-[var(--border)]">
                0x8eA21b7987E8F08Ac17691238BaF190119283
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                <span className="text-[10px] uppercase font-semibold block">Network</span>
                <span className="font-bold text-[var(--text-primary)]">Polygon PoS Mainnet</span>
              </div>
              <div className="p-2.5 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                <span className="text-[10px] uppercase font-semibold block">Consensus Status</span>
                <span className="font-bold text-green-600">Active & Syncing</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border)] flex justify-end">
            <button
              onClick={() => setIsContractModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TraceabilityPage;
