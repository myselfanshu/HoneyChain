import React, { useState } from 'react';
import { ArrowRight, Lock, Droplet, ShieldCheck, Factory, Package, ShoppingBag, CheckCircle, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useTranslation } from '@/contexts/LanguageContext';

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

export const TraceabilityTimeline: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTxn, setSelectedTxn] = useState<TimelineEvent | null>(null);

  const events: TimelineEvent[] = [
    { 
      id: 1, 
      title: t.traceability.evHarvestTitle, 
      details: t.traceability.evHarvestDetails, 
      txn: 'HCBA...7F3D', 
      fullHash: '0x7f3d9941a82c81e9f1a20b92138cd918237e1a0b',
      date: '25 Aug 2026, 06:41 AM',
      blockNumber: 4910281,
      signer: 'Ravi Kumar (Verified Beekeeper #USR-2026-001)',
      icon: Droplet
    },
    { 
      id: 2, 
      title: t.traceability.evQualityTitle, 
      details: t.traceability.evQualityDetails, 
      txn: 'HCBA...8B2F', 
      fullHash: '0x8b2fe91a0c8812c4b8109927bca19401289128aa',
      date: '25 Aug 2026, 11:16 AM',
      blockNumber: 4910450,
      signer: 'HoneyPure Quality Testing Laboratory',
      icon: ShieldCheck
    },
    { 
      id: 3, 
      title: t.traceability.evProcessedTitle, 
      details: t.traceability.evProcessedDetails, 
      txn: 'HCBA...9C11', 
      fullHash: '0x9c118401aa99c821ea9088192837bc901a8827c1',
      date: '25 Aug 2026, 01:32 PM',
      blockNumber: 4910620,
      signer: 'HoneyPure Pvt. Ltd. (Facility #HP-DEL-04)',
      icon: Factory
    },
    { 
      id: 4, 
      title: t.traceability.evPackagedTitle, 
      details: t.traceability.evPackagedDetails, 
      txn: 'HCBA...AD91', 
      fullHash: '0xad910029bca88172ea910828a1c890123847acba',
      date: '30 Aug 2026, 02:22 PM',
      blockNumber: 4912904,
      signer: 'PurePack Industries Bottling Line #3',
      icon: Package
    },
    { 
      id: 5, 
      title: t.traceability.evMarketTitle, 
      details: t.traceability.evMarketDetails, 
      txn: 'HCBA...BC74', 
      fullHash: '0xbc74889123812739acb00129847120387410298a',
      date: '31 Aug 2026, 10:10 AM',
      blockNumber: 4913812,
      signer: 'GreenHive Logistics & Retail Distribution',
      icon: ShoppingBag
    },
  ];

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
                    className="flex items-center gap-2 bg-[var(--surface)] px-3.5 py-2 rounded-xl hover:border-[var(--accent)] transition-colors border border-[var(--border)] self-start sm:self-auto shadow-sm cursor-pointer"
                  >
                    <Lock size={12} className="text-[var(--accent)]" />
                    <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">{event.txn}</span>
                    <ArrowRight size={12} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        title={t.traceability.blockchainLedger}
      >
        {selectedTxn && (
          <div className="space-y-4 font-sans text-xs">
            <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)] flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">{t.common.status}</span>
              <span className="text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                <CheckCircle size={14} /> {t.traceability.merkleVerified}
              </span>
            </div>

            <div className="space-y-3 p-4 bg-[var(--surface-secondary)]/50 rounded-xl border border-[var(--border)]">
              <div>
                <span className="text-[var(--text-secondary)] block mb-1 font-mono text-[10px] uppercase tracking-wider">
                  {t.traceability.txnHash}
                </span>
                <span className="font-mono text-[11px] text-[var(--accent)] break-all font-bold block bg-[var(--surface)] p-2 rounded-lg border border-[var(--border)]">
                  {selectedTxn.fullHash}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <span className="text-[var(--text-secondary)] block text-[10px] uppercase font-mono">{t.traceability.blockHeight}</span>
                  <span className="font-mono font-bold text-sm text-[var(--text-primary)]">#{selectedTxn.blockNumber}</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)] block text-[10px] uppercase font-mono">{t.common.date}</span>
                  <span className="font-medium text-[var(--text-primary)]">{selectedTxn.date}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)]">
                <span className="text-[var(--text-secondary)] block text-[10px] uppercase font-mono mb-1">{t.traceability.signedBy}</span>
                <span className="text-[var(--text-primary)] font-semibold">{selectedTxn.signer}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <a 
                href={`https://polygonscan.com/tx/${selectedTxn.fullHash}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[var(--accent)] font-semibold hover:underline text-xs"
              >
                <span>{t.traceability.viewOnExplorer}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TraceabilityTimeline;
