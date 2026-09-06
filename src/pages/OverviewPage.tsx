import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Award, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { LiveDateDisplay } from '@/components/ui/LiveDateDisplay';
import ApiaryMap from '@/components/overview/ApiaryMap';
import LiveConditions from '@/components/overview/LiveConditions';
import AIObservation from '@/components/overview/AIObservation';
import RecentActivity from '@/components/overview/RecentActivity';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { reportsApi, ReportsSummary, FieldReport } from '@/api/reports';
import { hivesApi, Hive } from '@/api/hives';
import { batchesApi, Batch } from '@/api/batches';
import { alertsApi, Alert } from '@/api/alerts';

export const OverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const { token, user, isGuest } = useAuth();

  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [hives, setHives] = useState<Hive[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverviewData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, hivesRes, batchesRes, alertsRes, reportsRes] = await Promise.all([
        reportsApi.getSummary(token).catch(() => ({ totalHives: 0, healthyHives: 0, unreadAlerts: 0, totalHarvestKg: 0 })),
        hivesApi.getHives(token).catch(() => []),
        batchesApi.getBatches(token).catch(() => []),
        alertsApi.getAlerts(token).catch(() => []),
        reportsApi.getFieldReports(token).catch(() => []),
      ]);
      setSummary(sumRes);
      setHives(hivesRes);
      setBatches(batchesRes);
      setAlerts(alertsRes);
      setReports(reportsRes);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard overview.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  const activeBatch: Batch | null = batches.length > 0 && batches[0] ? batches[0] : null;

  const totalHives = Number(summary?.totalHives ?? hives.length);
  const healthyHives = Number(summary?.healthyHives ?? hives.filter((h) => h.status === 'HEALTHY').length);
  const totalHarvest = Number(summary?.totalHarvestKg ?? 0);
  const unreadAlerts = Number(summary?.unreadAlerts ?? alerts.filter((a) => !a.readAt).length);

  const displayName = user?.name ? user.name.split(' ')[0] : 'Explorer';
  const greetingText = isGuest ? t.overview.greeting : `Welcome back, ${displayName}`;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] mb-1 break-words">
            {greetingText}
          </h1>
          <p className="font-sans text-[var(--text-secondary)] text-sm sm:text-base">
            {totalHives > 0
              ? `${healthyHives} of ${totalHives} smart hives are in optimal health condition.`
              : 'Your apiary dashboard is live. Add your first smart hive to start monitoring.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <LiveDateDisplay
            showIcon
            className="flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)] bg-[var(--surface)] px-3.5 py-2 rounded-xl border border-[var(--border)] shadow-xs shrink-0"
          />
          <button
            onClick={fetchOverviewData}
            disabled={loading}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Overview"
            aria-label="Refresh Overview"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400 flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Row 1: 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t.overview.hivesMonitored}
          value={String(totalHives)}
          trend={totalHives > 0 ? t.overview.trendHives : 'Active apiary count'}
          trendUp={totalHives > 0}
        />
        <MetricCard
          title={t.overview.healthyColonies}
          value={String(healthyHives)}
          trend={totalHives > 0 ? `${Math.round((healthyHives / (totalHives || 1)) * 100)}% nominal` : 'Colony health score'}
          trendUp={healthyHives === totalHives && totalHives > 0}
        />
        <MetricCard
          title={t.overview.expectedYield}
          value={`${totalHarvest.toFixed(1)} kg`}
          trend={totalHarvest > 0 ? t.overview.trendYield : 'Recorded batch mass'}
          trendUp={totalHarvest > 0}
        />

        {/* Dynamic Trust / Audit Card */}
        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] flex flex-col justify-between shadow-xs hover:border-[var(--accent)] transition-colors">
          <div className="flex justify-between items-start">
            <h4 className="font-sans text-sm font-medium text-[var(--text-secondary)]">{t.overview.trustScore}</h4>
            <ShieldCheck className="w-5 h-5 text-[var(--accent)] shrink-0" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-serif font-bold text-[var(--text-primary)]">
              {batches.length > 0 ? '100%' : '—'}
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {batches.length > 0 ? 'Ledger Verified' : 'No Batches Yet'}
              </span>
              <span className="text-[var(--text-secondary)] font-mono">
                {unreadAlerts} {unreadAlerts === 1 ? 'Alert' : 'Alerts'}
              </span>
            </div>
            <div className="w-full bg-[var(--surface-secondary)] h-1.5 rounded-full overflow-hidden border border-[var(--border)]">
              <div
                className="bg-[var(--accent)] h-full rounded-full transition-all duration-500"
                style={{ width: batches.length > 0 ? '100%' : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Apiary Map | Live Conditions | Observation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        <div className="lg:col-span-6">
          <ApiaryMap hives={hives} />
        </div>

        <div className="lg:col-span-3">
          <LiveConditions hives={hives} />
        </div>

        <div className="lg:col-span-3">
          <AIObservation hives={hives} />
        </div>
      </div>

      {/* Row 3: Recent Activity + Active Batch Provenance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        <div className="lg:col-span-6">
          <RecentActivity alerts={alerts} reports={reports} />
        </div>

        {/* Active Harvest Batch Provenance Card */}
        <div className="lg:col-span-6 bg-[var(--surface)] p-6 sm:p-7 rounded-3xl border border-[var(--border)] flex flex-col justify-between shadow-xs">
          {activeBatch ? (
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)] gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-[var(--accent)] min-w-0">
                  <Award size={18} className="shrink-0" />
                  <h3 className="text-lg font-serif font-bold text-[var(--text-primary)] truncate">
                    {t.overview.activeHarvest}
                  </h3>
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold shrink-0">
                  {activeBatch.id}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)] min-w-0">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase block">{t.overview.honeyVariety}</span>
                  <span className="text-sm font-serif font-bold text-[var(--text-primary)] truncate block">{activeBatch.name}</span>
                </div>
                <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)] min-w-0">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase block">{t.overview.originHive}</span>
                  <span className="text-sm font-serif font-bold text-[var(--accent)] block">{activeBatch.hiveId || 'Apiary'}</span>
                </div>
                <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)] min-w-0">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase block">{t.overview.batchMass}</span>
                  <span className="text-sm font-serif font-bold text-[var(--text-primary)] block">{Number(activeBatch.weightKg).toFixed(1)} kg</span>
                </div>
                <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)] min-w-0">
                  <span className="text-[10px] text-[var(--text-secondary)] uppercase block">{t.overview.labMoisture}</span>
                  <span className="text-sm font-serif font-bold text-emerald-600 block">
                    {activeBatch.passport?.moisturePct != null ? `${Number(activeBatch.passport.moisturePct).toFixed(1)}%` : '—'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Harvested from {activeBatch.location} on {new Date(activeBatch.harvestDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--border)] mt-4">
                <Link
                  to={`/honey-passport/${activeBatch.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[var(--surface-secondary)] text-[var(--accent)] font-medium text-xs border border-[var(--border)] hover:border-[var(--accent)] transition-all"
                >
                  <span>{t.overview.viewPassport}</span>
                  <ArrowRight size={13} className="shrink-0" />
                </Link>
                <Link
                  to={`/verify/${activeBatch.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[var(--accent)] text-white font-medium text-xs hover:opacity-90 transition-opacity"
                >
                  <span>{t.overview.qrStory}</span>
                  <ArrowRight size={13} className="shrink-0" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center space-y-3">
              <Award size={32} className="text-[var(--accent)] opacity-60 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">No Active Honey Batches</h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                When you record honey extraction from your smart hives, batch passports and QR verification will appear here.
              </p>
              <Link
                to="/smart-hives"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--surface-secondary)] text-[var(--accent)] text-xs font-semibold rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
              >
                <span>Manage Smart Hives</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
