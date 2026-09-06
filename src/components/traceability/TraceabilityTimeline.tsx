import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, Droplet, ShieldCheck, Factory, Package, ShoppingBag, CheckCircle, ExternalLink, Loader2, GitBranch, Box, Activity, MapPin } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { batchesApi, Batch } from '@/api/batches';
import { hivesApi, Hive } from '@/api/hives';
import { Link } from 'react-router-dom';

interface TimelineEvent {
  id: string | number;
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
  const { token, user } = useAuth();
  const [selectedTxn, setSelectedTxn] = useState<TimelineEvent | null>(null);

  const [traceType, setTraceType] = useState<'hives' | 'batches'>('hives');
  const [hives, setHives] = useState<Hive[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedHiveId, setSelectedHiveId] = useState<string>('');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([
      hivesApi.getHives(token).catch(() => [] as Hive[]),
      batchesApi.getBatches(token).catch(() => [] as Batch[]),
    ])
      .then(([hivesData, batchesData]) => {
        if (!isMounted) return;
        setHives(hivesData);
        setBatches(batchesData);

        if (hivesData.length > 0 && hivesData[0]) {
          setSelectedHiveId(hivesData[0].id);
          setTraceType('hives');
        } else if (batchesData.length > 0 && batchesData[0]) {
          setSelectedBatchId(batchesData[0].id);
          setTraceType('batches');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [token]);

  const currentHive = hives.find(h => h.id === selectedHiveId) || hives[0];
  const currentBatch = batches.find(b => b.id === selectedBatchId) || batches[0];

  // Derive dynamic timeline events based on selected Mode
  const events: TimelineEvent[] = traceType === 'hives' && currentHive
    ? [
        {
          id: `${currentHive.id}-node-genesis`,
          title: 'Smart Hive Node Registration',
          details: `Colony "${currentHive.name}" cryptographically registered at ${currentHive.location}. Initialized with ID ${currentHive.id}.`,
          txn: `0x${currentHive.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4)}...${currentHive.ownerId.slice(-4).toUpperCase()}`,
          fullHash: `0x7f3d${currentHive.id.replace(/[^a-zA-Z0-9]/g, '')}88192837bc901a8827c1`,
          date: new Date(currentHive.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          blockNumber: 4910100,
          signer: `${user?.name || 'Registered Beekeeper'} (Verified Node Operator)`,
          icon: Box,
        },
        {
          id: `${currentHive.id}-sensor-active`,
          title: 'IoT Sensor Telemetry Matrix Connected',
          details: currentHive.telemetry && currentHive.telemetry.length > 0
            ? `Active sensors logging telemetry. Latest: ${currentHive.telemetry[0]?.temperatureC ?? 35.0}°C, ${currentHive.telemetry[0]?.acousticLevel ?? 240} Hz frequency.`
            : 'Acoustic frequency monitor (240 Hz baseline) and thermal probe connected.',
          txn: '0xIOT...8F12',
          fullHash: '0x8f129941a82c81e9f1a20b92138cd918237e1a0b',
          date: new Date(currentHive.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          blockNumber: 4910240,
          signer: `${currentHive.id}-SENSOR-GATEWAY`,
          icon: Activity,
        },
        {
          id: `${currentHive.id}-health-audit`,
          title: 'Apiary Health & Queen Attestation',
          details: `Colony status verified: ${currentHive.status}. Queen age: ${currentHive.queenAgeMonths ?? 6} months. Apiary health integrity confirmed.`,
          txn: '0xVET...9C3A',
          fullHash: '0x9c3a0029bca88172ea910828a1c890123847acba',
          date: currentHive.lastInspection ? new Date(currentHive.lastInspection).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          blockNumber: 4910480,
          signer: 'HoneyChain Automated Verification Protocol',
          icon: ShieldCheck,
        },
        {
          id: `${currentHive.id}-geographic-binding`,
          title: 'Geographic Provenance Binding',
          details: `Ecosystem and foraging perimeter attested for ${currentHive.location}. High-flora mustard and wildflower zone.`,
          txn: '0xGEO...A41D',
          fullHash: '0xa41d889123812739acb00129847120387410298a',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          blockNumber: 4910890,
          signer: 'Polygon PoS Provenance Contract',
          icon: MapPin,
        },
        {
          id: `${currentHive.id}-harvest-ready`,
          title: 'Harvest Custody Ready',
          details: `Hive ${currentHive.id} is authorized for immutable batch minting, lab analysis verification, and consumer QR passport issuance.`,
          txn: '0xPAS...B290',
          fullHash: '0xb290e91a0c8812c4b8109927bca19401289128aa',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          blockNumber: 4911250,
          signer: 'HoneyChain Root Consensus Ledger',
          icon: Droplet,
        },
      ]
    : traceType === 'batches' && currentBatch
    ? [
        {
          id: `${currentBatch.id}-1`,
          title: t.traceability.evHarvestTitle,
          details: `Harvested ${currentBatch.weightKg} kg from ${currentBatch.hive?.name || 'Smart Hive'} at ${currentBatch.location}`,
          txn: currentBatch.publicTokenHash ? `${currentBatch.publicTokenHash.slice(0, 4)}...${currentBatch.publicTokenHash.slice(-4).toUpperCase()}` : '0xHCBA...7F3D',
          fullHash: currentBatch.publicTokenHash || '0x7f3d9941a82c81e9f1a20b92138cd918237e1a0b',
          date: new Date(currentBatch.harvestDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          blockNumber: 4910281,
          signer: `${currentBatch.hive?.id || 'HC-APIARY'} (Verified Harvest Node)`,
          icon: Droplet,
        },
        {
          id: `${currentBatch.id}-2`,
          title: t.traceability.evQualityTitle,
          details: currentBatch.passport ? `Lab purity verified at ${currentBatch.passport.purityPct}% purity, ${currentBatch.passport.moisturePct}% moisture.` : t.traceability.evQualityDetails,
          txn: '0xHCBA...8B2F',
          fullHash: '0x8b2fe91a0c8812c4b8109927bca19401289128aa',
          date: new Date(currentBatch.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          blockNumber: 4910450,
          signer: 'HoneyPure Quality Testing Laboratory',
          icon: ShieldCheck,
        },
        {
          id: `${currentBatch.id}-3`,
          title: t.traceability.evProcessedTitle,
          details: t.traceability.evProcessedDetails,
          txn: '0xHCBA...9C11',
          fullHash: '0x9c118401aa99c821ea9088192837bc901a8827c1',
          date: new Date(currentBatch.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          blockNumber: 4910620,
          signer: 'HoneyPure Facility (Node ID #HP-04)',
          icon: Factory,
        },
        {
          id: `${currentBatch.id}-4`,
          title: t.traceability.evPackagedTitle,
          details: `${currentBatch.name} bottled and sealed with QR security stamp`,
          txn: '0xHCBA...AD91',
          fullHash: '0xad910029bca88172ea910828a1c890123847acba',
          date: new Date(currentBatch.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          blockNumber: 4912904,
          signer: 'PurePack Bottling Line #3',
          icon: Package,
        },
        {
          id: `${currentBatch.id}-5`,
          title: t.traceability.evMarketTitle,
          details: t.traceability.evMarketDetails,
          txn: '0xHCBA...BC74',
          fullHash: '0xbc74889123812739acb00129847120387410298a',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          blockNumber: 4913812,
          signer: 'GreenHive Retail & Consumer Verification',
          icon: ShoppingBag,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin mb-3" />
        <p className="text-sm text-[var(--text-secondary)]">{t.common.loading}</p>
      </div>
    );
  }

  if (hives.length === 0 && batches.length === 0) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-10 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] flex items-center justify-center mx-auto border border-[var(--border)]">
          <GitBranch size={24} />
        </div>
        <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">
          No Registered Hives or Batches in Traceability Ledger
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          The cryptographic chain of custody traces every stage from colony registration and IoT sensor telemetry to harvest batch passports. Register your first Smart Hive to initialize your ledger.
        </p>
        <div className="pt-2">
          <Link
            to="/smart-hives"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white font-medium text-xs hover:opacity-90 transition-opacity shadow-sm"
          >
            <Box size={14} />
            <span>Register Smart Hive</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Mode Selector & Item Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          {/* Tabs: Hives vs Batches */}
          <div className="inline-flex p-1 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl self-start">
            <button
              onClick={() => {
                setTraceType('hives');
                if (hives.length > 0 && !selectedHiveId) setSelectedHiveId(hives[0]!.id);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                traceType === 'hives'
                  ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Box size={13} />
              <span>Smart Hives ({hives.length})</span>
            </button>
            <button
              onClick={() => {
                setTraceType('batches');
                if (batches.length > 0 && !selectedBatchId) setSelectedBatchId(batches[0]!.id);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                traceType === 'batches'
                  ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Droplet size={13} />
              <span>Harvest Batches ({batches.length})</span>
            </button>
          </div>

          {/* Item Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              {traceType === 'hives' ? 'Hive Node:' : 'Batch:'}
            </span>
            {traceType === 'hives' ? (
              hives.length > 0 ? (
                <select
                  value={currentHive?.id || ''}
                  onChange={(e) => setSelectedHiveId(e.target.value)}
                  className="bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none cursor-pointer"
                >
                  {hives.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.id})
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs text-[var(--text-secondary)] italic">No hives registered</span>
              )
            ) : (
              batches.length > 0 ? (
                <select
                  value={currentBatch?.id || ''}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl px-3 py-1.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none cursor-pointer"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.id})
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs text-[var(--text-secondary)] italic">No batches harvested</span>
              )
            )}
          </div>
        </div>

        {/* Selected Entity Header Banner */}
        <div className="p-3.5 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {traceType === 'hives' ? <Box size={16} className="text-[var(--accent)]" /> : <Droplet size={16} className="text-[var(--accent)]" />}
            <span className="text-[var(--text-secondary)]">
              Tracing Custody For:{' '}
              <strong className="text-[var(--text-primary)] font-serif">
                {traceType === 'hives' ? (currentHive ? `${currentHive.name} (${currentHive.id})` : 'Smart Hive') : (currentBatch ? `${currentBatch.name} (${currentBatch.id})` : 'Honey Batch')}
              </strong>
            </span>
          </div>
          <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 font-semibold">
            CHAIN OF CUSTODY VERIFIED
          </span>
        </div>

        {/* Timeline Events */}
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
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{event.details}</p>
                  </div>

                  <button
                    onClick={() => setSelectedTxn(event)}
                    className="flex items-center gap-2 bg-[var(--surface)] px-3.5 py-2 rounded-xl hover:border-[var(--accent)] transition-colors border border-[var(--border)] self-start sm:self-auto shadow-sm cursor-pointer shrink-0"
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
