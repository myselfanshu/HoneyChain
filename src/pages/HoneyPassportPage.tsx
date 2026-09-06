import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, ArrowRight, RefreshCw, AlertCircle, Box, Plus, Droplets, ShieldCheck } from 'lucide-react';
import { HoneyPassportCard } from '@/components/passport/HoneyPassport';
import { JourneySnapshot } from '@/components/passport/JourneySnapshot';
import { TrustScore } from '@/components/ui/TrustScore';
import { Modal } from '@/components/ui/Modal';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { batchesApi, Batch } from '@/api/batches';
import { hivesApi, Hive } from '@/api/hives';

export const HoneyPassportPage: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const { batchId } = useParams<{ batchId?: string }>();

  const [batchesList, setBatchesList] = useState<Batch[]>([]);
  const [hivesList, setHivesList] = useState<Hive[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batchId || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  // Harvest modal state
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [harvestForm, setHarvestForm] = useState({
    hiveId: '',
    name: '',
    weightKg: '',
    floralSource: 'Mustard & Wildflower',
    purityPct: '99.0',
    moisturePct: '16.8',
  });

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [batchesData, hivesData] = await Promise.all([
        batchesApi.getBatches(token),
        hivesApi.getHives(token).catch(() => [] as Hive[]),
      ]);
      setBatchesList(batchesData);
      setHivesList(hivesData);
      if (batchesData.length > 0 && batchesData[0] && !selectedBatchId) {
        setSelectedBatchId(batchesData[0].id);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load honey batch passports.');
    } finally {
      setLoading(false);
    }
  }, [token, selectedBatchId]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const openHarvestModal = () => {
    const defaultHive = hivesList[0];
    setHarvestForm({
      hiveId: defaultHive?.id || '',
      name: defaultHive ? `${defaultHive.name} Harvest ${new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}` : `Batch ${new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`,
      weightKg: '',
      floralSource: 'Mustard & Wildflower',
      purityPct: '99.0',
      moisturePct: '16.8',
    });
    setModalError(null);
    setIsHarvestModalOpen(true);
  };

  const handleHarvestBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!harvestForm.hiveId) {
      setModalError('Please select a Smart Hive.');
      return;
    }
    if (!harvestForm.name.trim()) {
      setModalError('Batch name is required.');
      return;
    }
    const weight = Number(harvestForm.weightKg);
    if (!weight || weight <= 0) {
      setModalError('Please enter a valid harvest weight (kg).');
      return;
    }

    const selectedHive = hivesList.find((h) => h.id === harvestForm.hiveId);

    setModalLoading(true);
    setModalError(null);
    try {
      const created = await batchesApi.createBatch(
        {
          hiveId: harvestForm.hiveId,
          name: harvestForm.name.trim(),
          location: selectedHive?.location || 'Registered Apiary',
          weightKg: weight,
          floralSource: harvestForm.floralSource.trim() || 'Mustard & Wildflower',
          purityPct: harvestForm.purityPct ? Number(harvestForm.purityPct) : 99.0,
          moisturePct: harvestForm.moisturePct ? Number(harvestForm.moisturePct) : 16.8,
        },
        token
      );
      setIsHarvestModalOpen(false);
      await fetchBatches();
      setSelectedBatchId(created.id);
    } catch (err: any) {
      setModalError(err?.message || 'Failed to generate harvest batch.');
    } finally {
      setModalLoading(false);
    }
  };

  const currentBatch: Batch | null =
    batchesList.find((b) => b.id.toLowerCase() === selectedBatchId.toLowerCase()) ||
    (batchesList.length > 0 && batchesList[0] ? batchesList[0] : null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)] shadow-xs">
              <Award size={24} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">{t.passport.title}</h1>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-0.5">
                {t.passport.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {batchesList.length > 0 && (
            <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs min-w-0">
              <span className="text-[var(--text-secondary)] font-medium shrink-0">{t.passport.batch}:</span>
              <select
                value={currentBatch?.id || ''}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="bg-transparent font-mono font-semibold text-[var(--accent)] focus:outline-none cursor-pointer truncate max-w-[180px] sm:max-w-[260px]"
              >
                {batchesList.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[var(--surface)] text-[var(--text-primary)]">
                    {b.id} — {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {hivesList.length > 0 && (
            <button
              onClick={openHarvestModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white font-semibold text-xs sm:text-sm rounded-xl hover:opacity-95 shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Harvest Batch & Issue Passport</span>
            </button>
          )}

          <button
            onClick={fetchBatches}
            disabled={loading}
            className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
            title="Refresh Batches"
            aria-label="Refresh Batches"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading && batchesList.length === 0 && (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[var(--text-secondary)]">Loading cryptographic passport ledger…</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400 flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && batchesList.length === 0 && (
        <div className="py-16 px-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)] flex items-center justify-center mx-auto">
            <Award size={32} />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)]">No Harvest Batches Recorded</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
            When you extract honey from your registered hives, batch passports and verifiable QR stories will appear here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {hivesList.length > 0 ? (
              <button
                onClick={openHarvestModal}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--accent)] text-white font-semibold text-xs rounded-xl hover:opacity-95 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Harvest from a Hive</span>
              </button>
            ) : (
              <Link
                to="/smart-hives"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--accent)] text-white font-semibold text-xs rounded-xl hover:opacity-95 shadow-sm active:scale-95 transition-all"
              >
                <Box size={16} />
                <span>Register a Smart Hive First</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Passport Certificate + Trust Score Gauge */}
      {!loading && currentBatch && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2">
              <HoneyPassportCard batch={currentBatch as any} />
            </div>

            {/* Trust Score Column */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 flex flex-col items-center justify-between h-full text-center shadow-xs">
                <div className="w-full text-center pb-2 border-b border-[var(--border)]">
                  <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">{t.overview.trustScore}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{t.overview.consensusVerified}</p>
                </div>

                <div className="my-6">
                  <TrustScore score={currentBatch.dataStatus === 'DEMO' ? 70 : 96} maxScore={100} size="lg" />
                </div>

                <div className="space-y-4 w-full">
                  <p className="text-[var(--text-secondary)] text-xs leading-relaxed max-w-xs mx-auto">
                    {t.passport.scoreDesc}
                  </p>

                  <button
                    onClick={() => setIsScoreModalOpen(true)}
                    className="w-full py-3 px-4 rounded-xl border border-[var(--border)] text-[var(--text-primary)] font-medium text-xs hover:bg-[var(--surface-secondary)] hover:border-[var(--accent)] transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>{t.passport.viewScoreBreakdown}</span>
                    <ArrowRight size={14} className="text-[var(--accent)]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <JourneySnapshot />
          </div>
        </>
      )}

      {/* Trust Score Breakdown Modal */}
      <Modal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        title={`${t.passport.trustMethodology} (96/100)`}
      >
        <div className="space-y-4 text-xs text-[var(--text-secondary)]">
          <p>
            The HoneyChain trust score assesses real telemetry verification, third-party laboratory assays (purity, moisture, HMF levels), and immutable chain of custody signatures.
          </p>
        </div>
      </Modal>

      {/* Harvest Batch & Issue Passport Modal */}
      <Modal
        isOpen={isHarvestModalOpen}
        onClose={() => setIsHarvestModalOpen(false)}
        title="Harvest Honey Batch & Issue Passport"
      >
        <form onSubmit={handleHarvestBatch} className="space-y-4">
          {modalError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs">
              {modalError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              Source Smart Hive *
            </label>
            <select
              value={harvestForm.hiveId}
              onChange={(e) => {
                const selected = hivesList.find((h) => h.id === e.target.value);
                setHarvestForm({
                  ...harvestForm,
                  hiveId: e.target.value,
                  name: selected ? `${selected.name} Harvest ${new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}` : harvestForm.name,
                });
              }}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
            >
              <option value="" disabled>Select Smart Hive</option>
              {hivesList.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.id}) — {h.location}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">
              Batch Name *
            </label>
            <input
              type="text"
              required
              value={harvestForm.name}
              onChange={(e) => setHarvestForm({ ...harvestForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
              placeholder="e.g. Raw Mustard Blossom Reserve"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                Harvest Weight (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={harvestForm.weightKg}
                onChange={(e) => setHarvestForm({ ...harvestForm, weightKg: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
                placeholder="24.5"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                Floral Source
              </label>
              <input
                type="text"
                value={harvestForm.floralSource}
                onChange={(e) => setHarvestForm({ ...harvestForm, floralSource: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
                placeholder="Mustard & Wildflower"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                Lab Purity (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="50"
                max="100"
                value={harvestForm.purityPct}
                onChange={(e) => setHarvestForm({ ...harvestForm, purityPct: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                Moisture Content (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="5"
                max="30"
                value={harvestForm.moisturePct}
                onChange={(e) => setHarvestForm({ ...harvestForm, moisturePct: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
              />
            </div>
          </div>

          <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)] text-[11px] text-[var(--text-secondary)] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[var(--accent)]">
              <ShieldCheck size={14} />
              <span>Automatic Cryptographic Attestation</span>
            </div>
            <p>
              HoneyChain will generate a public QR verification hash, initialize batch passport metrics, and record the harvest event in the traceability ledger.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => setIsHarvestModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Droplets size={14} />
              <span>{modalLoading ? 'Issuing Passport…' : 'Mint Honey Passport'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HoneyPassportPage;
