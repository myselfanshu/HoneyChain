import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, Plus, RefreshCw, AlertCircle, X,
} from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { reportsApi, ReportsSummary, FieldReport, CreateFieldReportDto } from '@/api/reports';
import { hivesApi, Hive } from '@/api/hives';

export const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const { token, isGuest } = useAuth();

  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [hives, setHives] = useState<Hive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    hiveId: '',
    period: '',
    notes: '',
  });

  const fetchReportsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, repsRes, hivesRes] = await Promise.all([
        reportsApi.getSummary(token).catch(() => ({ totalHives: 0, healthyHives: 0, unreadAlerts: 0, totalHarvestKg: 0 })),
        reportsApi.getFieldReports(token).catch(() => []),
        hivesApi.getHives(token).catch(() => []),
      ]);
      setSummary(sumRes);
      setReports(repsRes);
      setHives(hivesRes);
    } catch (err: any) {
      setError(err?.message || 'Failed to load apiary reports.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setModalError('Report title is required.');
      return;
    }
    setModalLoading(true);
    setModalError(null);
    try {
      const payload: CreateFieldReportDto = {
        title: formData.title.trim(),
        hiveId: formData.hiveId || undefined,
        period: formData.period.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        status: 'Ready',
      };
      await reportsApi.createFieldReport(payload, token);
      setIsModalOpen(false);
      setFormData({ title: '', hiveId: '', period: '', notes: '' });
      await fetchReportsData();
    } catch (err: any) {
      setModalError(err?.message || 'Failed to save report.');
    } finally {
      setModalLoading(false);
    }
  };

  const totalHives = Number(summary?.totalHives ?? hives.length);
  const healthyHives = Number(summary?.healthyHives ?? hives.filter((h) => h.status === 'HEALTHY').length);
  const totalHarvest = Number(summary?.totalHarvestKg ?? 0);

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">{t.reports.title}</h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-1">{t.reports.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          {!isGuest && (
            <button
              onClick={() => { setModalError(null); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-5 py-3 bg-[var(--accent)] text-white text-xs font-semibold rounded-xl hover:opacity-95 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Log Field Report</span>
            </button>
          )}
          <button
            onClick={fetchReportsData}
            disabled={loading}
            className="p-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Reports"
            aria-label="Refresh Reports"
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

      {/* KPI Cards — Derived directly from current user's data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--border)] shadow-xs">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Total Hives Monitored</p>
          <p className="text-3xl font-serif font-bold text-[var(--text-primary)]">{totalHives}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Active Colony Nodes</p>
        </div>

        <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--border)] shadow-xs">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Healthy Colonies</p>
          <p className="text-3xl font-serif font-bold text-emerald-600 dark:text-emerald-400">{healthyHives}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Optimal Thermal Status</p>
        </div>

        <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--border)] shadow-xs">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Total Harvested Mass</p>
          <p className="text-3xl font-serif font-bold text-[var(--accent)]">{totalHarvest.toFixed(1)} kg</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Recorded Extract Yield</p>
        </div>

        <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--border)] shadow-xs">
          <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Field Reports</p>
          <p className="text-3xl font-serif font-bold text-[var(--text-primary)]">{reports.length}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Inspection Logs on Record</p>
        </div>
      </div>

      {/* Saved Field Reports Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-[var(--accent)]" />
            <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">Apiary Field & Audit Reports</h2>
          </div>
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
          </span>
        </div>

        {loading && reports.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[var(--text-secondary)]">Loading field inspection records…</p>
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <FileText size={36} className="text-[var(--text-secondary)] opacity-50 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]">No Field Reports Logged</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
              Use "Log Field Report" to record physical colony inspections, queen health checks, and seasonal honey harvest audits.
            </p>
            {!isGuest && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)] text-white text-xs font-semibold rounded-xl hover:opacity-95 transition-opacity cursor-pointer mt-2"
              >
                <Plus size={14} />
                <span>Log First Report</span>
              </button>
            )}
          </div>
        )}

        {!loading && reports.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text-secondary)]">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-primary)] font-semibold">
                  <th className="py-3 px-4">Report Title</th>
                  <th className="py-3 px-4">Hive Node</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Logged On</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[var(--surface-secondary)]/50 transition-colors">
                    <td className="py-3.5 px-4 text-[var(--text-primary)] font-semibold font-serif text-sm">
                      {rep.title}
                      {rep.notes && <p className="text-[11px] font-sans font-normal text-[var(--text-secondary)] mt-0.5">{rep.notes}</p>}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[var(--accent)] font-semibold">{rep.hiveId || 'Apiary Wide'}</td>
                    <td className="py-3.5 px-4">{rep.period || '—'}</td>
                    <td className="py-3.5 px-4 font-mono">{new Date(rep.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {rep.status || 'Ready'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Field Report Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)]">Log Field Inspection Report</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Report Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Brood Inspection & Swarm Check"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Hive Node
                  </label>
                  <select
                    value={formData.hiveId}
                    onChange={(e) => setFormData({ ...formData, hiveId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="">Apiary Wide</option>
                    {hives.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.id} — {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Period / Season
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aug – Sep 2026"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Inspection Notes & Findings
                </label>
                <textarea
                  rows={3}
                  placeholder="Document queen laying pattern, brood comb health, honey stores, and mite count."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] resize-none"
                />
              </div>

              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-400">
                  {modalError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-xl hover:opacity-95 disabled:opacity-50 cursor-pointer"
                >
                  {modalLoading ? 'Saving…' : 'Save Field Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
