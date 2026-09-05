import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar, Download, FileText, Filter, Plus, Activity,
  Droplet, Star, ShieldCheck, Copy, CheckCheck, X, ClipboardList,
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { hives } from '@/data/hives';
import { Modal } from '@/components/ui/Modal';
import { useTranslation } from '@/contexts/LanguageContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type PresetKey = '7d' | '30d' | '90d' | '180d' | 'custom';

interface FieldReport {
  id: string;
  date: string;
  hiveId: string;
  observationType: string;
  colonyCondition: string;
  weather: string;
  foragingActivity: string;
  weightReading: string;
  visibleIssues: string[];
  actionTaken: string;
  notes: string;
  createdAt: string;
}

// ─── Mock data generators ─────────────────────────────────────────────────────

function generateYieldData(days: number) {
  const labels: string[] = [];
  const base = 130;
  const now = new Date(2026, 8, 5); // Sep 5 2026

  // Bucket into readable periods
  const buckets = days <= 14 ? days : days <= 45 ? Math.ceil(days / 5) : Math.ceil(days / 15);
  const step = Math.floor(days / buckets);

  for (let i = buckets - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * step);
    labels.push(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
  }

  return labels.map((name) => ({
    name,
    yield: Math.round(base + Math.random() * 60 + (days > 60 ? 20 : 0)),
  }));
}

function computeMetrics(days: number) {
  // Deterministic shifts based on selected range
  const healthBase = days <= 7 ? 94 : days <= 30 ? 92 : days <= 90 ? 90 : 88;
  const totalYield = Math.round(days * 2.3 + 80);
  const events = Math.round(days * 6.9);
  const qualityScore = days <= 30 ? 'A+' : days <= 90 ? 'A' : 'A−';
  return { health: healthBase, totalYield, events, qualityScore };
}

// ─── Saved reports list ───────────────────────────────────────────────────────

const SEED_REPORTS = [
  { id: '1', name: 'Q2 Apiary Health Overview', period: 'Apr – Jun 2026', generated: '01 Jul 2026', status: 'Ready' },
  { id: '2', name: 'Monthly Yield Analysis', period: 'Aug 2026', generated: '01 Sep 2026', status: 'Ready' },
  { id: '3', name: 'Traceability Audit — Batch HC-2026-0142', period: 'Jan – Aug 2026', generated: '03 Sep 2026', status: 'Ready' },
  { id: '4', name: 'Nectar Flow Projections', period: 'Sep – Nov 2026', generated: '05 Sep 2026', status: 'Processing' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const PRESETS: { key: PresetKey; label: string; days: number }[] = [
  { key: '7d', label: '7 days', days: 7 },
  { key: '30d', label: '30 days', days: 30 },
  { key: '90d', label: '90 days', days: 90 },
  { key: '180d', label: '6 months', days: 180 },
];

const OBSERVATION_TYPES = ['Routine', 'Swarm check', 'Queen check', 'Harvest', 'Treatment', 'Emergency', 'Other'];
const VISIBLE_ISSUES_OPTIONS = ['Varroa mites', 'Chalk brood', 'Queen cells', 'Unusual aggression', 'Low food stores', 'Dead bees at entrance', 'None observed'];

const ReportsPage: React.FC = () => {
  // ── Date range state ──────────────────────────────────────────────────────
  const [preset, setPreset] = useState<PresetKey>('30d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [customError, setCustomError] = useState('');

  const activeDays = useMemo(() => {
    if (preset !== 'custom') return PRESETS.find((p) => p.key === preset)!.days;
    if (!customFrom || !customTo) return 30;
    const diff = Math.round((new Date(customTo).getTime() - new Date(customFrom).getTime()) / 86400000);
    return diff > 0 ? diff : 30;
  }, [preset, customFrom, customTo]);

  const yieldData = useMemo(() => generateYieldData(activeDays), [activeDays]);
  const metrics = useMemo(() => computeMetrics(activeDays), [activeDays]);

  // ── Custom range validation ───────────────────────────────────────────────
  const handleCustomApply = () => {
    if (!customFrom || !customTo) return setCustomError('Please select both dates.');
    const diff = Math.round((new Date(customTo).getTime() - new Date(customFrom).getTime()) / 86400000);
    if (diff < 7) return setCustomError('Minimum range is 7 days.');
    if (diff > 180) return setCustomError('Maximum range is 6 months (180 days).');
    setCustomError('');
  };

  // ── Generate Report modal ─────────────────────────────────────────────────
  const [genModal, setGenModal] = useState(false);
  const [genStep, setGenStep] = useState<'idle' | 'generating' | 'done'>('idle');
  const [copied, setCopied] = useState(false);

  const reportText = useMemo(() => {
    const label = preset !== 'custom'
      ? PRESETS.find((p) => p.key === preset)!.label
      : `${customFrom} → ${customTo}`;
    return `HONEYCHAIN APIARY REPORT
========================
Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
Period: Last ${label} (${activeDays} days)
Beekeeper: Ravi Kumar — Master Beekeeper
Location: Uttar Pradesh, India

SUMMARY
-------
Hives Monitored:     24
Healthy Colonies:    21 (${metrics.health}%)
Total Yield (est.):  ${metrics.totalYield} kg
Quality Score:       ${metrics.qualityScore}
Verified Events:     ${metrics.events}

HIVE STATUS
-----------
${hives.map((h) => `  ${h.id.padEnd(8)} ${h.status.padEnd(10)} ${h.location}`).join('\n')}

NOTES
-----
- H-104 under watch: acoustic anomaly detected. Physical inspection recommended.
- H-107: marked for inspection. Weight delta −2.1 kg (7-day). High AI risk flag.
- All other hives within normal operating parameters.

DISCLAIMER
----------
This report is generated from sensor telemetry and mock data in a demonstration
environment. Metrics are illustrative only. Do not use for regulatory compliance.
`;
  }, [preset, customFrom, customTo, activeDays, metrics]);

  const handleGenerate = () => {
    setGenStep('generating');
    setTimeout(() => setGenStep('done'), 1400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Field Reports ─────────────────────────────────────────────────────────
  const [fieldModal, setFieldModal] = useState(false);
  const [fieldReports, setFieldReports] = useState<FieldReport[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('honeychain_field_reports') ?? '[]');
    } catch {
      return [];
    }
  });

  const defaultHiveId = hives[0]?.id ?? '';
  const todayStr = (): string => new Date().toISOString().split('T')[0] ?? '';

  const [fieldForm, setFieldForm] = useState({
    date: todayStr(),
    hiveId: defaultHiveId,
    observationType: 'Routine',
    colonyCondition: 'Normal',
    weather: '',
    foragingActivity: 'Normal',
    weightReading: '',
    visibleIssues: [] as string[],
    actionTaken: '',
    notes: '',
  });

  const [activeView, setActiveView] = useState<'reports' | 'field'>('reports');

  const handleFieldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: FieldReport = {
      ...fieldForm,
      date: fieldForm.date || todayStr(),
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newReport, ...fieldReports];
    setFieldReports(updated);
    localStorage.setItem('honeychain_field_reports', JSON.stringify(updated));
    setFieldModal(false);
    setActiveView('field');
    // Reset form
    setFieldForm({
      date: todayStr(),
      hiveId: defaultHiveId,
      observationType: 'Routine',
      colonyCondition: 'Normal',
      weather: '',
      foragingActivity: 'Normal',
      weightReading: '',
      visibleIssues: [],
      actionTaken: '',
      notes: '',
    });

  };

  const toggleIssue = (issue: string) => {
    setFieldForm((f) => ({
      ...f,
      visibleIssues: f.visibleIssues.includes(issue)
        ? f.visibleIssues.filter((i) => i !== issue)
        : [...f.visibleIssues, issue],
    }));
  };

  // ─────────────────────────────────────────────────────────────────────────
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fade-in pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[var(--text-primary)] font-bold">{t.reports.title}</h1>
          <p className="text-[var(--text-secondary)] mt-1">{t.reports.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Field Report button */}
          <button
            onClick={() => setFieldModal(true)}
            className="flex items-center px-4 py-2.5 bg-[var(--surface)] hover:bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors"
          >
            <ClipboardList className="w-4 h-4 mr-2 text-[var(--accent)]" />
            {t.reports.logFieldReport}
          </button>

          {/* Generate Report button */}
          <button
            onClick={() => { setGenStep('idle'); setCopied(false); setGenModal(true); }}
            className="flex items-center px-4 py-2.5 bg-[var(--accent)] hover:opacity-90 text-white rounded-xl text-sm font-medium transition-opacity shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.reports.generateReport}
          </button>
        </div>
      </div>

      {/* Date range selector */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">{t.reports.dateRange}</span>
          </div>

          {/* Preset pills */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const label = p.key === '7d' ? t.reports.preset7d : p.key === '30d' ? t.reports.preset30d : p.key === '90d' ? t.reports.preset90d : t.reports.preset180d;
              return (
                <button
                  key={p.key}
                  onClick={() => setPreset(p.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    preset === p.key
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <button
              onClick={() => setPreset('custom')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                preset === 'custom'
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              {t.reports.custom}
            </button>
          </div>

          {/* Custom date inputs */}
          {preset === 'custom' && (
            <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-0">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="text-xs bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <span className="text-[var(--text-secondary)] text-xs">{t.reports.to}</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="text-xs bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <button
                onClick={handleCustomApply}
                className="px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                {t.reports.apply}
              </button>
              {customError && <span className="text-xs text-red-500">{customError}</span>}
            </div>
          )}
        </div>

        <p className="mt-3 text-[11px] text-[var(--text-secondary)]">
          {t.reports.subOverDays}: <strong>{activeDays}</strong> (Min 7 · Max 180).
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Activity, label: t.reports.hiveHealth, value: `${metrics.health}%`, sub: t.reports.subFromLast, subColor: 'text-green-500' },
          { icon: Droplet, label: t.reports.totalYield, value: `${metrics.totalYield} ${t.common.kg}`, sub: `${activeDays} ${t.reports.subOverDays}`, subColor: 'text-[var(--text-secondary)]' },
          { icon: Star, label: t.reports.qualityScore, value: metrics.qualityScore, sub: t.reports.subAcrossBatches, subColor: 'text-[var(--text-secondary)]' },
          { icon: ShieldCheck, label: t.reports.verifiedEvents, value: metrics.events.toLocaleString(), sub: t.reports.subCompliance, subColor: 'text-green-500' },
        ].map(({ icon: Icon, label, value, sub, subColor }) => (
          <div key={label} className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
            <div className="mb-4">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg w-fit">
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-[var(--text-secondary)] text-sm font-medium">{label}</h3>
            <p className="text-2xl font-serif text-[var(--text-primary)] mt-1">{value}</p>
            <div className={`mt-2 text-sm font-medium ${subColor}`}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Yield Chart */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-serif text-[var(--text-primary)] mb-5">
          {t.reports.yieldTrend} — {activeDays} {t.reports.subOverDays}
        </h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yieldData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: 'var(--accent)' }}
                formatter={(v: any) => [`${v} ${t.common.kg}`, t.reports.yieldTooltip]}
              />
              <Bar dataKey="yield" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] mt-3 italic">
          {t.reports.mockDataNotice}
        </p>
      </div>

      {/* Tab switcher: Recent Reports | Field Reports */}
      <div className="flex items-center gap-1 p-1 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-2xl self-start">
        {(['reports', 'field'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setActiveView(v)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === v
                ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {v === 'reports' ? t.reports.recentReports : `${t.reports.fieldReports}${fieldReports.length > 0 ? ` (${fieldReports.length})` : ''}`}
          </button>
        ))}
      </div>

      {/* Recent Reports Table */}
      {activeView === 'reports' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
            <h2 className="text-xl font-serif text-[var(--text-primary)]">{t.reports.recentReports}</h2>
            <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--background)] border-b border-[var(--border)] text-[var(--text-secondary)] text-sm">
                  <th className="py-4 px-6 font-medium">{t.reports.reportName}</th>
                  <th className="py-4 px-6 font-medium">{t.reports.period}</th>
                  <th className="py-4 px-6 font-medium">{t.reports.generated}</th>
                  <th className="py-4 px-6 font-medium">{t.common.status}</th>
                  <th className="py-4 px-6 font-medium text-right">{t.common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {SEED_REPORTS.map((report, idx) => {
                  const reportTitle = idx === 0 ? t.reports.report1Title : idx === 1 ? t.reports.report2Title : idx === 2 ? t.reports.report3Title : t.reports.report4Title;
                  return (
                    <tr key={report.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background)] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-[var(--accent)] mr-3 shrink-0" />
                          <span className="font-medium text-[var(--text-primary)]">{reportTitle}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-[var(--text-secondary)]">{report.period}</td>
                      <td className="py-4 px-6 text-sm text-[var(--text-secondary)]">{report.generated}</td>
                      <td className="py-4 px-6">
                        {report.status === 'Ready' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">{t.reports.ready}</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">{t.reports.processing}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          disabled={report.status !== 'Ready'}
                          className={`p-2 rounded-lg transition-colors ${
                            report.status === 'Ready'
                              ? 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-amber-500/10 cursor-pointer'
                              : 'text-[var(--text-secondary)] opacity-30 cursor-not-allowed'
                          }`}
                          title={t.common.download}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Field Reports List */}
      {activeView === 'field' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
            <h2 className="text-xl font-serif text-[var(--text-primary)]">{t.reports.fieldReports}</h2>
            <button
              onClick={() => setFieldModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
            >
              <Plus size={14} /> {t.reports.logNew}
            </button>
          </div>

          {fieldReports.length === 0 ? (
            <div className="p-12 text-center text-[var(--text-secondary)]">
              <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">{t.reports.noFieldReports}</p>
              <p className="text-xs mt-1">{t.reports.noFieldReportsSub}</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {fieldReports.map((r) => (
                <div key={r.id} className="p-5 hover:bg-[var(--background)] transition-colors">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <div>
                      <span className="font-serif font-bold text-[var(--text-primary)]">{r.hiveId}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-secondary)]">{r.observationType}</span>
                    </div>
                    <span className="text-xs text-[var(--text-secondary)] font-mono">{r.date}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-2">
                    <div><span className="text-[var(--text-secondary)]">Colony: </span><span className="text-[var(--text-primary)] font-medium">{r.colonyCondition}</span></div>
                    <div><span className="text-[var(--text-secondary)]">Foraging: </span><span className="text-[var(--text-primary)] font-medium">{r.foragingActivity}</span></div>
                    {r.weightReading && <div><span className="text-[var(--text-secondary)]">Weight: </span><span className="text-[var(--text-primary)] font-medium">{r.weightReading} kg</span></div>}
                    {r.weather && <div><span className="text-[var(--text-secondary)]">Weather: </span><span className="text-[var(--text-primary)] font-medium">{r.weather}</span></div>}
                  </div>
                  {r.visibleIssues.length > 0 && r.visibleIssues[0] !== 'None observed' && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {r.visibleIssues.map((issue) => (
                        <span key={issue} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">{issue}</span>
                      ))}
                    </div>
                  )}
                  {r.notes && <p className="text-xs text-[var(--text-secondary)] italic">"{r.notes}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Generate Report Modal ────────────────────────────────────────────── */}
      <Modal isOpen={genModal} onClose={() => setGenModal(false)} title="Generate Apiary Report">
        <div className="space-y-4">
          {genStep === 'idle' && (
            <>
              <div className="p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)] text-sm space-y-1">
                <p className="text-[var(--text-secondary)]"><span className="font-semibold text-[var(--text-primary)]">Period:</span> Last {activeDays} days</p>
                <p className="text-[var(--text-secondary)]"><span className="font-semibold text-[var(--text-primary)]">Hive Health:</span> {metrics.health}%</p>
                <p className="text-[var(--text-secondary)]"><span className="font-semibold text-[var(--text-primary)]">Estimated Yield:</span> {metrics.totalYield} kg</p>
                <p className="text-[var(--text-secondary)]"><span className="font-semibold text-[var(--text-primary)]">Verified Events:</span> {metrics.events}</p>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] italic">
                Report will be generated as a structured text preview. No PDF backend is available in this demo.
              </p>
              <button
                onClick={handleGenerate}
                className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Generate Report
              </button>
            </>
          )}

          {genStep === 'generating' && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[var(--text-secondary)]">Compiling report…</p>
            </div>
          )}

          {genStep === 'done' && (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">✓ Report ready</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  {copied ? <><CheckCheck size={13} /> Copied!</> : <><Copy size={13} /> Copy as Text</>}
                </button>
              </div>
              <pre className="text-[11px] font-mono text-[var(--text-secondary)] bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl p-4 overflow-auto max-h-72 whitespace-pre-wrap leading-relaxed">
                {reportText}
              </pre>
            </>
          )}
        </div>
      </Modal>

      {/* ── Field Report Modal ───────────────────────────────────────────────── */}
      <Modal isOpen={fieldModal} onClose={() => setFieldModal(false)} title="Log Field Report">
        <form onSubmit={handleFieldSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Inspection Date</label>
              <input
                type="date"
                required
                value={fieldForm.date}
                onChange={(e) => setFieldForm({ ...fieldForm, date: e.target.value })}
                className="w-full px-3 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            {/* Hive ID */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Hive</label>
              <select
                value={fieldForm.hiveId}
                onChange={(e) => setFieldForm({ ...fieldForm, hiveId: e.target.value })}
                className="w-full px-3 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                {hives.map((h) => <option key={h.id} value={h.id}>{h.id} — {h.location}</option>)}
              </select>
            </div>

            {/* Observation type */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Observation Type</label>
              <select
                value={fieldForm.observationType}
                onChange={(e) => setFieldForm({ ...fieldForm, observationType: e.target.value })}
                className="w-full px-3 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                {OBSERVATION_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Colony condition */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Colony Condition</label>
              <div className="flex gap-2 flex-wrap pt-1">
                {['Normal', 'Stressed', 'Queenless', 'Swarming', 'Strong'].map((c) => (
                  <label key={c} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-xs font-medium transition-all ${
                    fieldForm.colonyCondition === c
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]'
                  }`}>
                    <input type="radio" name="condition" className="sr-only" checked={fieldForm.colonyCondition === c} onChange={() => setFieldForm({ ...fieldForm, colonyCondition: c })} />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Weather */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Weather</label>
              <input
                type="text"
                placeholder="e.g. Sunny, 31°C, light breeze"
                value={fieldForm.weather}
                onChange={(e) => setFieldForm({ ...fieldForm, weather: e.target.value })}
                className="w-full px-3 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            {/* Foraging activity */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Foraging Activity</label>
              <select
                value={fieldForm.foragingActivity}
                onChange={(e) => setFieldForm({ ...fieldForm, foragingActivity: e.target.value })}
                className="w-full px-3 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                {['Low', 'Normal', 'High', 'Very High', 'None'].map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>

            {/* Weight reading */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Manual Weight Reading (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 42.5"
                value={fieldForm.weightReading}
                onChange={(e) => setFieldForm({ ...fieldForm, weightReading: e.target.value })}
                className="w-full px-3 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          {/* Visible issues */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Visible Issues</label>
            <div className="flex flex-wrap gap-2">
              {VISIBLE_ISSUES_OPTIONS.map((issue) => (
                <button
                  key={issue}
                  type="button"
                  onClick={() => toggleIssue(issue)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
                    fieldForm.visibleIssues.includes(issue)
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]'
                  }`}
                >
                  {issue}
                </button>
              ))}
            </div>
          </div>

          {/* Action taken */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Action Taken</label>
            <input
              type="text"
              placeholder="e.g. Added super frame, fed sugar syrup"
              value={fieldForm.actionTaken}
              onChange={(e) => setFieldForm({ ...fieldForm, actionTaken: e.target.value })}
              className="w-full px-3 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Notes</label>
            <textarea
              rows={3}
              placeholder="Any additional observations…"
              value={fieldForm.notes}
              onChange={(e) => setFieldForm({ ...fieldForm, notes: e.target.value })}
              className="w-full px-3 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => setFieldModal(false)}
              className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Save Report
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReportsPage;
