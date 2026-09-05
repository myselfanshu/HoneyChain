import React, { useState } from 'react';
import { ColonyInsight } from '@/components/intelligence/ColonyInsight';
import { YieldPrediction } from '@/components/intelligence/YieldPrediction';
import { WeatherOutlook } from '@/components/intelligence/WeatherOutlook';
import { 
  Brain, Activity, TrendingUp, Sparkles, CheckCircle, 
  ShieldAlert, AlertTriangle, Thermometer, Droplets, Weight, Clock, Info, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { hives } from '@/data/hives';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

export const IntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'recommendations'>('insights');

  // H-104 recent 24-hour hourly telemetry from mock dataset
  const hive104 = hives.find((h) => h.id === 'H-104') || hives[0]!;
  const recentHourlyData = hive104.sensors.slice(-12).map((s, idx) => ({
    time: `${idx * 2}:00`,
    acoustic: Math.round(s.acousticLevel * 4.5), // Scale to realistic Hz (~190-240)
    temp: parseFloat(s.temperature.toFixed(1)),
    baseline: 240,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-16">
      {/* Header & Intelligence Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)] shrink-0">
            <Brain size={22} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">AI Intelligence</h1>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-0.5">
              {activeTab === 'insights' && 'Real-time colony observations, acoustic telemetry, and current environmental telemetry.'}
              {activeTab === 'predictions' && 'Forward-looking yield estimates, microclimate forecasts, and colony trajectory models.'}
              {activeTab === 'recommendations' && 'Action-oriented apiary guidance derived from active telemetry and forecasts.'}
            </p>
          </div>
        </div>

        {/* 3 Distinct Tabs */}
        <div className="flex items-center p-1 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-2xl self-start sm:self-auto shadow-xs">
          {[
            { id: 'insights', label: 'Insights', tag: 'Current' },
            { id: 'predictions', label: 'Predictions', tag: 'Forecast' },
            { id: 'recommendations', label: 'Recommendations', tag: 'Actions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                activeTab === tab.id 
                  ? 'bg-[var(--accent)]/15 text-[var(--accent)]' 
                  : 'bg-[var(--surface)]/50 text-[var(--text-secondary)] opacity-70'
              }`}>
                {tab.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          TAB 1: INSIGHTS (Observed / Current Telemetry · NOT Forecasts)
          ========================================================================= */}
      {activeTab === 'insights' && (
        <div className="space-y-6 animate-fade-in">
          {/* Sub-header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <Clock size={15} className="text-[var(--accent)] shrink-0" />
              <span>Observation Window: <strong>Past 24 Hours</strong> · Last Telemetry Sync: <strong>20:00 IST Today</strong></span>
            </div>
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold">
              LIVE OBSERVED DATA
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Col: Primary Colony Diagnostic Card */}
            <div className="lg:col-span-7">
              <ColonyInsight />
            </div>

            {/* Right Col: 24-Hour Observed Acoustic Timeline & Apiary Context */}
            <div className="lg:col-span-5 space-y-6">
              {/* 24-Hour Acoustic Timeline Chart */}
              <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-serif font-bold text-[var(--text-primary)]">
                      H-104 Acoustic Freq. (24h Trend)
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)]">Observed decline from 240 Hz baseline to 196.4 Hz</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    -18.2%
                  </span>
                </div>

                <div className="h-44 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={recentHourlyData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-secondary)" fontSize={10} domain={[160, 260]} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '11px' }}
                        itemStyle={{ color: 'var(--accent)' }}
                        formatter={(value: any, name: string) => [
                          `${value} Hz`,
                          name === 'acoustic' ? 'Observed Freq.' : 'Baseline',
                        ]}
                      />
                      <ReferenceLine y={240} stroke="#10b981" strokeDasharray="3 3" label={{ value: '240 Hz Baseline', fill: '#10b981', fontSize: 9 }} />
                      <Line type="monotone" dataKey="acoustic" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--accent)' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] italic mt-2 text-center">
                  Hourly acoustic sensors recorded on LoRaWAN Node H-104.
                </p>
              </div>

              {/* Apiary Telemetry Summary */}
              <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--border)] shadow-sm space-y-3">
                <h3 className="text-base font-serif font-bold text-[var(--text-primary)]">Apiary Status Overview</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                    <span className="text-[10px] uppercase font-semibold text-[var(--text-secondary)] block">Optimal Hives</span>
                    <span className="font-serif font-bold text-lg text-green-600 dark:text-green-400">21 / 24</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">Within normal range</span>
                  </div>
                  <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                    <span className="text-[10px] uppercase font-semibold text-[var(--text-secondary)] block">Under Watch</span>
                    <span className="font-serif font-bold text-lg text-amber-600">3 Hives</span>
                    <span className="text-[10px] text-[var(--text-secondary)]">H-103, H-104, H-107</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-[11px] text-[var(--text-secondary)] flex items-start gap-2">
                  <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Data Basis:</strong> Insights represent current recorded telemetry. Physical inspection is required before determining any management intervention.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PREDICTIONS (Future Forecasts & Trajectories · SIMULATED)
          ========================================================================= */}
      {activeTab === 'predictions' && (
        <div className="space-y-6 animate-fade-in">
          {/* Sub-header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <TrendingUp size={15} className="text-[var(--accent)] shrink-0" />
              <span>Forecast Horizon: <strong>Next 24h to 7 Days</strong> · Projected Harvest Window: <strong>08–11 Sep 2026</strong></span>
            </div>
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-semibold">
              SIMULATED DEMO MODEL
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Col: Yield Forecast Matrix */}
            <div className="lg:col-span-7">
              <YieldPrediction />
            </div>

            {/* Right Col: Weather & Foraging Outlook */}
            <div className="lg:col-span-5">
              <WeatherOutlook />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: RECOMMENDATIONS (Action-Oriented Field Guidance)
          ========================================================================= */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6 animate-fade-in">
          {/* Sub-header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <Sparkles size={15} className="text-[var(--accent)] shrink-0" />
              <span>Generated from current telemetry anomalies, colony weight trajectories, and upcoming weather windows.</span>
            </div>
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 font-semibold">
              ACTION-ORIENTED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Priority 1: H-104 Inspection */}
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-4 hover:border-[var(--accent)] transition-colors shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                    URGENT PRIORITY
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">Within 24h</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">
                  Inspect Brood Nest: Hive H-104
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Acoustic frequency dropped by 18.2% (196.4 Hz) with 14-month queen age and −0.5 kg weight delta. Physical inspection needed to check for queen cells or swarm preparation.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--border)]">
                <Link
                  to="/smart-hives/H-104"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  <span>Open Hive H-104 Log</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Priority 2: Super Addition */}
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-4 hover:border-[var(--accent)] transition-colors shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                    PRODUCTION ACTION
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">Within 3 Days</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">
                  Add Shallow Super: Hive H-102
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Colony weight reached 45.3 kg with +3.1 kg 7-day surge. High mustard nectar flow requires an extra honey super to prevent honey-bound brood frames.
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--border)]">
                <Link
                  to="/smart-hives/H-102"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  <span>View Hive H-102 Data</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Priority 3: Optimal Harvest Window */}
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-4 hover:border-[var(--accent)] transition-colors shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[var(--accent)] border border-[var(--accent)]/20">
                    HARVEST WINDOW
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">Next 72 Hours</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">
                  Sector A Extraction Window
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Weather outlook indicates 72 hours of clear warm skies (28°C, 0% rain). Ideal conditions for uncapping and extracting mature comb with low ambient humidity (&lt; 18% moisture).
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--border)]">
                <Link
                  to="/reports"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  <span>Review Yield Reports</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligencePage;
