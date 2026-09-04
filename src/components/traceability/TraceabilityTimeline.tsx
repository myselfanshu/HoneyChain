import React, { useState } from 'react';
import { ArrowRight, Lock, Droplet, ShieldCheck, Factory, Package, ShoppingBag, CheckCircle, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface TimelineEvent {
  id: number;
  title: string;
  details: string;
  txn: string;
  fullHash: string;
  date: string;
  blockNumber: number;
  signer: string;
  icon: any;
}

const events: TimelineEvent[] = [
  { 
    id: 1, 
    title: 'Harvest Recorded', 
    details: 'Hive H-104 • 18.4 kg', 
    txn: 'HCBA...7F3D', 
    fullHash: '0x7f3d9941a82c81e9f1a20b92138cd918237e1a0b',
    date: '25 Aug 2026, 06:41 AM',
    blockNumber: 4910281,
    signer: 'Ravi Kumar (Verified Beekeeper #USR-2026-001)',
    icon: Droplet
  },
  { 
    id: 2, 
    title: 'Quality Check', 
    details: 'Moisture: 17.2% • Purity: 98%', 
    txn: 'HCBA...8B2F', 
    fullHash: '0x8b2fe91a0c8812c4b8109927bca19401289128aa',
    date: '25 Aug 2026, 11:16 AM',
    blockNumber: 4910450,
    signer: 'HoneyPure Quality Testing Laboratory',
    icon: ShieldCheck
  },
  { 
    id: 3, 
    title: 'Processed', 
    details: 'Filtered & Purified', 
    txn: 'HCBA...9C11', 
    fullHash: '0x9c118401aa99c821ea9088192837bc901a8827c1',
    date: '25 Aug 2026, 01:32 PM',
    blockNumber: 4910620,
    signer: 'HoneyPure Pvt. Ltd. (Facility #HP-DEL-04)',
    icon: Factory
  },
  { 
    id: 4, 
    title: 'Packaged', 
    details: 'Batch sealed', 
    txn: 'HCBA...AD91', 
    fullHash: '0xad910029bca88172ea910828a1c890123847acba',
    date: '30 Aug 2026, 02:22 PM',
    blockNumber: 4912904,
    signer: 'PurePack Industries Bottling Line #3',
    icon: Package
  },
  { 
    id: 5, 
    title: 'Market Ready', 
    details: 'Available for sale', 
    txn: 'HCBA...BC74', 
    fullHash: '0xbc74889123812739acb00129847120387410298a',
    date: '31 Aug 2026, 10:10 AM',
    blockNumber: 4913812,
    signer: 'GreenHive Logistics & Retail Distribution',
    icon: ShoppingBag
  },
];

export const TraceabilityTimeline: React.FC = () => {
  const [selectedTxn, setSelectedTxn] = useState<TimelineEvent | null>(null);

  return (
    <>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="relative border-l-2 border-[var(--accent)] ml-4 sm:ml-6 space-y-8 py-2">
          {events.map((event) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="relative pl-7 sm:pl-9 group">
                {/* Timeline Node */}
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[var(--surface)] border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] shadow-sm group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                  <Icon size={14} />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                  <div>
                    <div className="text-xs font-medium text-[var(--text-secondary)] mb-0.5">{event.date}</div>
                    <h4 className="text-base sm:text-lg font-serif font-bold text-[var(--text-primary)]">{event.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{event.details}</p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedTxn(event)}
                    className="flex items-center gap-2 bg-[var(--surface)] px-3.5 py-2 rounded-xl hover:border-[var(--accent)] transition-colors border border-[var(--border)] self-start sm:self-auto shadow-sm"
                    title="Inspect blockchain block and payload"
                  >
                    <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)]">TXN:</span>
                    <span className="text-xs font-mono font-bold text-[var(--accent)]">{event.txn}</span>
                    <ArrowRight size={13} className="text-[var(--accent)]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-center gap-2 text-[var(--text-secondary)] text-xs text-center">
          <Lock size={15} className="text-[var(--accent)] shrink-0" />
          <span>All 5 records are sealed on the Honey Chain cryptographic ledger and are immutable.</span>
        </div>
      </div>

      {/* Transaction Explorer Modal */}
      {selectedTxn && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTxn(null)}
          title={`Blockchain Transaction Details`}
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)] space-y-1">
              <span className="text-[var(--text-secondary)] uppercase font-semibold text-[10px] block">Event Stage</span>
              <span className="text-base font-serif font-bold text-[var(--text-primary)]">{selectedTxn.title}</span>
              <p className="text-xs text-[var(--accent)]">{selectedTxn.details}</p>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[var(--text-secondary)] text-[10px] uppercase font-semibold block">Full Transaction Hash</span>
                <span className="font-mono text-[var(--text-primary)] bg-[var(--surface-secondary)] p-2 rounded-lg block break-all select-all border border-[var(--border)]">
                  {selectedTxn.fullHash}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] text-[10px] uppercase font-semibold block">Block Number</span>
                  <span className="font-mono font-bold text-[var(--text-primary)] text-sm">#{selectedTxn.blockNumber}</span>
                </div>
                <div className="p-2.5 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                  <span className="text-[var(--text-secondary)] text-[10px] uppercase font-semibold block">Timestamp</span>
                  <span className="font-medium text-[var(--text-primary)] text-xs">{selectedTxn.date}</span>
                </div>
              </div>

              <div>
                <span className="text-[var(--text-secondary)] text-[10px] uppercase font-semibold block">Authorized Cryptographic Signer</span>
                <span className="font-medium text-[var(--text-primary)] block bg-[var(--surface-secondary)] p-2 rounded-lg border border-[var(--border)]">
                  {selectedTxn.signer}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 pt-1">
                <CheckCircle size={14} />
                <span className="font-semibold text-xs">Merkle Consensus Finalized (128 Confirmations)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex justify-end">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90"
              >
                Close Explorer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default TraceabilityTimeline;
