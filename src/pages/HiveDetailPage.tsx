import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Share2,
  Thermometer,
  Droplets,
  Weight,
  Activity,
  ChevronRight,
  Check,
  Plus,
  AlertCircle,
  X,
  Volume2,
  Calendar,
  ArrowLeft,
  Award
} from 'lucide-react';
import { HiveVisualization } from '@/components/hives/HiveVisualization';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { hivesApi, Hive, TelemetryReading } from '@/api/hives';
import { batchesApi } from '@/api/batches';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export const HiveDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { token, isGuest } = useAuth();
  const navigate = useNavigate();
  const { hiveId } = useParams<{ hiveId: string }>();

  const [hive, setHive] = useState<Hive | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Telemetry modal
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState(false);
  const [telemetryForm, setTelemetryForm] = useState({
    temperatureC: '',
    humidityPct: '',
    weightKg: '',
    colonyActivity: '',
    acousticLevel: '',
  });

  // Harvest modal
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
  const [harvestForm, setHarvestForm] = useState({
    name: '',
    weightKg: '',
    floralSource: 'Mustard & Wildflower',
    purityPct: '99.0',
    moisturePct: '16.8',
  });

  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchHiveDetail = useCallback(async () => {
    if (!hiveId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await hivesApi.getHive(hiveId, token);
      setHive(data);
    } catch (err: any) {
      setError(err?.message || 'Hive not found or access denied.');
    } finally {
      setLoading(false);
    }
  }, [hiveId, token]);

  useEffect(() => {
    fetchHiveDetail();
  }, [fetchHiveDetail]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddTelemetry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hive) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await hivesApi.addTelemetry(
        hive.id,
        {
          recordedAt: new Date(),
          temperatureC: telemetryForm.temperatureC ? Number(telemetryForm.temperatureC) : undefined,
          humidityPct: telemetryForm.humidityPct ? Number(telemetryForm.humidityPct) : undefined,
          weightKg: telemetryForm.weightKg ? Number(telemetryForm.weightKg) : undefined,
          colonyActivity: telemetryForm.colonyActivity ? Number(telemetryForm.colonyActivity) : undefined,
          acousticLevel: telemetryForm.acousticLevel ? Number(telemetryForm.acousticLevel) : undefined,
          source: 'manual-beekeeping-log',
        },
        token
      );
      setIsTelemetryModalOpen(false);
      setTelemetryForm({
        temperatureC: '',
        humidityPct: '',
        weightKg: '',
        colonyActivity: '',
        acousticLevel: '',
      });
      await fetchHiveDetail();
    } catch (err: any) {
      setModalError(err?.message || 'Failed to record telemetry.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleHarvestBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hive) return;
    if (!harvestForm.name.trim()) {
      setModalError('Batch name is required.');
      return;
    }
    const weight = Number(harvestForm.weightKg);
    if (!weight || weight <= 0) {
      setModalError('Please enter a valid harvest weight (kg).');
      return;
    }

    setModalLoading(true);
    setModalError(null);
    try {
      const created = await batchesApi.createBatch(
        {
          hiveId: hive.id,
          name: harvestForm.name.trim(),
          location: hive.location,
          weightKg: weight,
          floralSource: harvestForm.floralSource.trim() || 'Mustard & Wildflower',
          purityPct: harvestForm.purityPct ? Number(harvestForm.purityPct) : 99.0,
          moisturePct: harvestForm.moisturePct ? Number(harvestForm.moisturePct) : 16.8,
        },
        token
      );
      setIsHarvestModalOpen(false);
      navigate(`/honey-passport/${encodeURIComponent(created.id)}`);
    } catch (err: any) {
      setModalError(err?.message || 'Failed to generate harvest batch.');
    } finally {
      setModalLoading(false);
    }
  };

  const openHarvestModal = () => {
    if (!hive) return;
    setHarvestForm({
      name: `${hive.name} Harvest ${new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`,
      weightKg: '',
      floralSource: 'Mustard & Wildflower',
      purityPct: '99.0',
      moisturePct: '16.8',
    });
    setModalError(null);
    setIsHarvestModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[var(--text-secondary)]">Loading hive telemetry…</p>
      </div>
    );
  }

  if (error || !hive) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 border border-red-200 dark:border-red-900 flex items-center justify-center mx-auto">
          <AlertCircle size={28} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Hive Not Found</h2>
        <p className="text-sm text-[var(--text-secondary)]">{error || 'This hive does not exist or you do not have permission to view it.'}</p>
        <Link
          to="/smart-hives"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white font-semibold text-xs rounded-xl hover:opacity-95 transition-all"
        >
          Return to Smart Hives
        </Link>
      </div>
    );
  }

  const latestTelemetry: TelemetryReading | null =
    hive.telemetry && hive.telemetry.length > 0 && hive.telemetry[0] ? hive.telemetry[0] : null;

  const temp = latestTelemetry?.temperatureC != null ? `${Number(latestTelemetry.temperatureC).toFixed(1)}°C` : '—';
  const humidity = latestTelemetry?.humidityPct != null ? `${Math.round(Number(latestTelemetry.humidityPct))}%` : '—';
  const weight = latestTelemetry?.weightKg != null ? `${Number(latestTelemetry.weightKg).toFixed(1)} kg` : '—';
  const activity = latestTelemetry?.colonyActivity != null ? `${Math.round(Number(latestTelemetry.colonyActivity))}%` : '—';
  const acoustic = latestTelemetry?.acousticLevel != null ? `${Number(latestTelemetry.acousticLevel).toFixed(0)} Hz` : '—';
  const statusType = (hive.status?.toLowerCase() || 'healthy') as 'healthy' | 'watch' | 'inspect';

  const lastInspectionDate = hive.lastInspection
    ? new Date(hive.lastInspection).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Not logged yet';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-[var(--text-secondary)]">
        <Link to="/smart-hives" className="hover:text-[var(--accent)] transition-colors">
          {t.nav.smartHives}
        </Link>
        <ChevronRight size={16} className="mx-2 text-[var(--border)]" />
        <span className="text-[var(--text-primary)] font-medium font-mono">{hive.id}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">
              {hive.name}
            </h1>
            <span className="text-xs font-mono text-[var(--accent)] bg-[var(--surface-secondary)] border border-[var(--border)] px-2.5 py-1 rounded-full font-semibold">
              {hive.id}
            </span>
            <StatusBadge status={statusType} />
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            {hive.location} {hive.apiary?.name && `• ${hive.apiary.name}`} • {t.smartHives.lastInspected}: {lastInspectionDate}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!isGuest && (
            <>
              <button
                onClick={openHarvestModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all text-xs font-semibold shadow-xs cursor-pointer"
                title="Harvest Honey Batch & Issue Passport"
              >
                <Award size={15} />
                <span>Harvest Batch & Passport</span>
              </button>
              <button
                onClick={() => setIsTelemetryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white hover:opacity-95 transition-opacity text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Plus size={15} />
                <span>Record Telemetry</span>
              </button>
            </>
          )}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors text-xs font-medium cursor-pointer"
            title="Share hive link"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
            <span>{copied ? t.common.linkCopied : t.common.shareTelemetry}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Hive Illustration */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[420px] shadow-xs relative overflow-hidden">
          <div className="absolute top-4 left-4 text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">
            {t.smartHives.fieldUnitArch}
          </div>
          <HiveVisualization />
          <div className="mt-4 text-center">
            <p className="font-serif text-base font-bold text-[var(--text-primary)]">{hive.name}</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {hive.queenAgeMonths ? `Queen Age: ${hive.queenAgeMonths} months` : t.smartHives.systemType}
            </p>
          </div>
        </div>

        {/* Right Side: Live Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-medium">{t.smartHives.temp}</span>
              <Thermometer size={16} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-[var(--text-primary)]">{temp}</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">Nest Brood Core</p>
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-medium">{t.smartHives.humidity}</span>
              <Droplets size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-[var(--text-primary)]">{humidity}</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">Relative Nest Humidity</p>
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-medium">{t.smartHives.weight}</span>
              <Weight size={16} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-[var(--text-primary)]">{weight}</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">Total Colony Mass</p>
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-medium">{t.smartHives.activity}</span>
              <Activity size={16} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-[var(--text-primary)]">{activity}</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">Forager Flight Index</p>
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-medium">Acoustic Freq</span>
              <Volume2 size={16} className="text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-[var(--text-primary)]">{acoustic}</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">Colony Hum Spectrum</p>
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-medium">Last Inspection</span>
              <Calendar size={16} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-base font-serif font-bold text-[var(--text-primary)] truncate">{lastInspectionDate}</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">Physical Brood Check</p>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry History or Empty State */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">Telemetry & Activity History</h3>

        {hive.telemetry && hive.telemetry.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text-secondary)]">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-primary)] font-semibold">
                  <th className="py-3 px-4">Recorded At</th>
                  <th className="py-3 px-4">Temp (°C)</th>
                  <th className="py-3 px-4">Humidity (%)</th>
                  <th className="py-3 px-4">Weight (kg)</th>
                  <th className="py-3 px-4">Acoustic (Hz)</th>
                  <th className="py-3 px-4">Activity</th>
                  <th className="py-3 px-4">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {hive.telemetry.map((r) => (
                  <tr key={r.id} className="hover:bg-[var(--surface-secondary)]/50 transition-colors font-mono">
                    <td className="py-3 px-4 text-[var(--text-primary)] font-medium">
                      {new Date(r.recordedAt).toLocaleString('en-GB')}
                    </td>
                    <td className="py-3 px-4">{r.temperatureC != null ? Number(r.temperatureC).toFixed(1) : '—'}</td>
                    <td className="py-3 px-4">{r.humidityPct != null ? Number(r.humidityPct).toFixed(0) : '—'}</td>
                    <td className="py-3 px-4">{r.weightKg != null ? Number(r.weightKg).toFixed(1) : '—'}</td>
                    <td className="py-3 px-4">{r.acousticLevel != null ? Number(r.acousticLevel).toFixed(0) : '—'}</td>
                    <td className="py-3 px-4">{r.colonyActivity != null ? Number(r.colonyActivity).toFixed(0) : '—'}</td>
                    <td className="py-3 px-4 text-[10px] text-[var(--text-secondary)]">{r.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <Activity size={32} className="text-[var(--text-secondary)] mx-auto opacity-50" />
            <p className="text-sm text-[var(--text-secondary)] font-medium">
              No sensor telemetry recorded yet for this hive.
            </p>
            <p className="text-xs text-[var(--text-secondary)]/70 max-w-md mx-auto">
              Connect IoT colony sensors or use "Record Telemetry" to log temperature, acoustic levels, and hive mass.
            </p>
          </div>
        )}
      </div>

      {/* Record Telemetry Modal */}
      {isTelemetryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setIsTelemetryModalOpen(false)}
        >
          <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">Record Telemetry Log</h3>
              <button
                onClick={() => setIsTelemetryModalOpen(false)}
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTelemetry} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="34.5"
                    value={telemetryForm.temperatureC}
                    onChange={(e) => setTelemetryForm({ ...telemetryForm, temperatureC: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Humidity (%)</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="55"
                    value={telemetryForm.humidityPct}
                    onChange={(e) => setTelemetryForm({ ...telemetryForm, humidityPct: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="42.5"
                    value={telemetryForm.weightKg}
                    onChange={(e) => setTelemetryForm({ ...telemetryForm, weightKg: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Activity (0–100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="75"
                    value={telemetryForm.colonyActivity}
                    onChange={(e) => setTelemetryForm({ ...telemetryForm, colonyActivity: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Acoustic Frequency (Hz)</label>
                <input
                  type="number"
                  placeholder="240"
                  value={telemetryForm.acousticLevel}
                  onChange={(e) => setTelemetryForm({ ...telemetryForm, acousticLevel: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-400">
                  {modalError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTelemetryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 bg-[var(--accent)] text-white text-xs font-semibold rounded-xl hover:opacity-95 disabled:opacity-50 cursor-pointer"
                >
                  {modalLoading ? 'Saving…' : 'Record Reading'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Harvest Honey Batch & Passport Modal */}
      {isHarvestModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-[var(--accent)] border border-amber-500/20">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">
                    Harvest Batch & Issue Passport
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Extract honey from {hive.name} ({hive.id})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHarvestModalOpen(false)}
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleHarvestBatch} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Batch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MUSTARD GOLD HARVEST 2026"
                  value={harvestForm.name}
                  onChange={(e) => setHarvestForm({ ...harvestForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Harvest Mass (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="18.5"
                    value={harvestForm.weightKg}
                    onChange={(e) => setHarvestForm({ ...harvestForm, weightKg: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Floral Source</label>
                  <input
                    type="text"
                    placeholder="Mustard / Acacia / Wildflower"
                    value={harvestForm.floralSource}
                    onChange={(e) => setHarvestForm({ ...harvestForm, floralSource: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Lab Purity (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="50"
                    max="100"
                    placeholder="99.2"
                    value={harvestForm.purityPct}
                    onChange={(e) => setHarvestForm({ ...harvestForm, purityPct: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Moisture (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="10"
                    max="25"
                    placeholder="16.8"
                    value={harvestForm.moisturePct}
                    onChange={(e) => setHarvestForm({ ...harvestForm, moisturePct: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-400">
                  {modalError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsHarvestModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-xl hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Award size={14} />
                  <span>{modalLoading ? 'Generating…' : 'Issue Honey Passport'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiveDetailPage;
