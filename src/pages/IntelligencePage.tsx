import React, { useState, useEffect } from 'react';
import { ColonyInsight } from '@/components/intelligence/ColonyInsight';
import { YieldPrediction } from '@/components/intelligence/YieldPrediction';
import { WeatherOutlook } from '@/components/intelligence/WeatherOutlook';
import { 
  Brain, TrendingUp, Sparkles, 
  Clock, Info, ArrowRight, Loader2, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { hivesApi, Hive } from '@/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw } from 'lucide-react';

export const IntelligencePage: React.FC = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'recommendations'>('insights');
  const [userHives, setUserHives] = useState<Hive[]>([]);
  const [selectedHiveId, setSelectedHiveId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchIntelligenceHives = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await hivesApi.getHives(token);
      setUserHives(data);
      if (data.length > 0 && data[0] && !selectedHiveId) {
        setSelectedHiveId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load hives for intelligence:', err);
    } finally {
      setLoading(false);
    }
  }, [token, selectedHiveId]);

  useEffect(() => {
    fetchIntelligenceHives();
  }, [fetchIntelligenceHives]);

  const selectedHive = userHives.find((h) => h.id === selectedHiveId) || userHives[0];

  // Compute real telemetry hourly data from selected hive if available
  const recentHourlyData = selectedHive && selectedHive.telemetry && selectedHive.telemetry.length > 0
    ? selectedHive.telemetry.slice(0, 12).reverse().map((s, idx) => ({
        time: `${idx * 2}:00`,
        acoustic: Math.round(Number(s.acousticLevel ?? 240)),
        temp: parseFloat(Number(s.temperatureC ?? 35.0).toFixed(1)),
        baseline: 240,
      }))
    : [];

  const tabOptions = [
    { id: 'insights', label: t.intelligence.insightsTab, tag: t.intelligence.observedBadge },
    { id: 'predictions', label: t.intelligence.predictionsTab, tag: t.intelligence.forecastBadge },
    { id: 'recommendations', label: t.intelligence.recommendationsTab, tag: t.intelligence.actionsBadge },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin mb-3" />
        <p className="text-sm text-[var(--text-secondary)]">{t.common.loading}</p>
      </div>
    );
  }

  if (userHives.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)]">
            <Brain size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] font-bold">
              {t.intelligence.title}
            </h1>
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-0.5">
              Real-time telemetry analysis and colony diagnostics
            </p>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] flex items-center justify-center mx-auto border border-[var(--border)]">
            <Brain size={28} />
          </div>
          <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">
            No Active Hive Telemetry Connected
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Intelligence models require live acoustic and thermal sensors connected to your colonies. Register your first Smart Hive to start receiving diagnostic telemetry and colony trajectory updates.
          </p>
          <div className="pt-2">
            <Link
              to="/smart-hives"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white font-medium text-xs hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus size={15} />
              <span>Register Smart Hive</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const optimalCount = userHives.filter(h => h.status === 'HEALTHY').length;
  const watchCount = userHives.filter(h => h.status !== 'HEALTHY').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-16 min-w-0 w-full overflow-x-hidden">
      {/* Header & Intelligence Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)] shrink-0">
            <Brain size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[var(--text-primary)] font-bold tracking-tight">
              {t.intelligence.title}
            </h1>
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm mt-0.5">
              {activeTab === 'insights' && 'Real-time colony observations, acoustic telemetry, and current environmental telemetry.'}
              {activeTab === 'predictions' && 'Forward-looking yield estimates, microclimate forecasts, and colony trajectory models.'}
              {activeTab === 'recommendations' && 'Action-oriented apiary guidance derived from active telemetry and forecasts.'}
            </p>
          </div>
        </div>

        {/* 3 Distinct Tabs - Anchored to Right Corner */}
        <div className="flex items-center justify-start lg:justify-end shrink-0 w-full lg:w-auto overflow-x-auto no-scrollbar py-1">
          <div className="inline-flex items-center p-1 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-2xl shadow-xs shrink-0">
            {tabOptions.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
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
      </div>

      {/* TAB 1: INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="space-y-6 animate-fade-in min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] min-w-0">
            <div className="flex items-start sm:items-center gap-2 text-xs text-[var(--text-secondary)] min-w-0">
              <Clock size={15} className="text-[var(--accent)] shrink-0 mt-0.5 sm:mt-0" />
              <span className="break-words leading-relaxed">
                Active Colony: <strong>{selectedHive?.name || 'Smart Hive'}</strong> ({selectedHive?.id})
              </span>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {userHives.length > 1 && (
                <select
                  value={selectedHive?.id || ''}
                  onChange={(e) => setSelectedHiveId(e.target.value)}
                  className="bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl px-2.5 py-1 text-xs font-semibold text-[var(--accent)] focus:outline-none cursor-pointer"
                >
                  {userHives.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.id})
                    </option>
                  ))}
                </select>
              )}
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold shrink-0">
                LIVE OBSERVED DATA
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-w-0 w-full">
            <div className="lg:col-span-7 min-w-0 w-full">
              <ColonyInsight hive={selectedHive} />
            </div>

            <div className="lg:col-span-5 space-y-6 min-w-0 w-full">
              {/* Telemetry Chart */}
              <div className="bg-[var(--surface)] p-5 sm:p-6 rounded-3xl border border-[var(--border)] shadow-sm min-w-0 w-full">
                <div className="flex items-start sm:items-center justify-between gap-2 mb-3 flex-wrap">
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-serif font-bold text-[var(--text-primary)] break-words">
                      {selectedHive?.id} Acoustic Freq. (24h Trend)
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] break-words">
                      {recentHourlyData.length > 0 ? 'Recorded acoustic frequency vs 240 Hz baseline' : 'No telemetry points logged yet'}
                    </p>
                  </div>
                </div>

                {recentHourlyData.length > 0 ? (
                  <div className="h-44 w-full mt-2 min-w-0 overflow-hidden">
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
                ) : (
                  <div className="h-44 flex items-center justify-center border border-dashed border-[var(--border)] rounded-2xl my-2 text-xs text-[var(--text-secondary)]">
                    Record telemetry in Hive Detail to visualize frequency trends
                  </div>
                )}
                <p className="text-[10px] text-[var(--text-secondary)] italic mt-2 text-center break-words">
                  Sensors recorded on Node {selectedHive?.id}.
                </p>
              </div>

              {/* Apiary Telemetry Summary */}
              <div className="bg-[var(--surface)] p-5 sm:p-6 rounded-3xl border border-[var(--border)] shadow-sm space-y-3 min-w-0 w-full">
                <h3 className="text-sm sm:text-base font-serif font-bold text-[var(--text-primary)]">Apiary Status Overview</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                  <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)] min-w-0">
                    <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-[var(--text-secondary)] block truncate">Optimal Hives</span>
                    <span className="font-serif font-bold text-base sm:text-lg text-green-600 dark:text-green-400 block">
                      {optimalCount} / {userHives.length}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] block truncate">Within normal range</span>
                  </div>
                  <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)] min-w-0">
                    <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-[var(--text-secondary)] block truncate">Under Watch</span>
                    <span className="font-serif font-bold text-base sm:text-lg text-amber-600 block">
                      {watchCount} {watchCount === 1 ? 'Hive' : 'Hives'}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] block truncate">Requires inspection</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-[11px] text-[var(--text-secondary)] flex items-start gap-2">
                  <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed break-words">
                    <strong>Data Basis:</strong> Insights represent current recorded telemetry. Physical inspection is recommended before determining any management intervention.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PREDICTIONS */}
      {activeTab === 'predictions' && (
        <div className="space-y-6 animate-fade-in min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] min-w-0">
            <div className="flex items-start sm:items-center gap-2 text-xs text-[var(--text-secondary)] min-w-0">
              <TrendingUp size={15} className="text-[var(--accent)] shrink-0 mt-0.5 sm:mt-0" />
              <span className="break-words leading-relaxed">
                Apiary Forecast: <strong>{userHives.length} Monitored Colonies</strong>
              </span>
            </div>
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-semibold self-start sm:self-auto shrink-0">
              HARVEST ESTIMATES
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-w-0 w-full">
            <div className="lg:col-span-7 min-w-0 w-full">
              <YieldPrediction hives={userHives} />
            </div>

            <div className="lg:col-span-5 min-w-0 w-full">
              <WeatherOutlook />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6 animate-fade-in min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] min-w-0">
            <div className="flex items-start sm:items-center gap-2 text-xs text-[var(--text-secondary)] min-w-0">
              <Sparkles size={15} className="text-[var(--accent)] shrink-0 mt-0.5 sm:mt-0" />
              <span className="break-words leading-relaxed">
                Generated from active colony health status across {userHives.length} colonies.
              </span>
            </div>
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 font-semibold self-start sm:self-auto shrink-0">
              ACTION-ORIENTED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-w-0 w-full">
            {userHives.map((hive) => {
              const hasAlert = hive.status !== 'HEALTHY';
              const latestTele = hive.telemetry && hive.telemetry.length > 0 ? hive.telemetry[0] : null;
              const acousticDrop = latestTele?.acousticLevel && latestTele.acousticLevel < 220;
              const queenOld = hive.queenAgeMonths && hive.queenAgeMonths >= 18;

              return (
                <div key={hive.id} className="p-5 sm:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-4 hover:border-[var(--accent)] transition-colors shadow-sm flex flex-col justify-between min-w-0 w-full">
                  <div className="space-y-3 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                        hive.status === 'WATCH'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : hive.status === 'INSPECT'
                          ? 'bg-red-500/10 text-red-600 border-red-500/20'
                          : 'bg-green-500/10 text-green-600 border-green-500/20'
                      }`}>
                        {hive.status}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)] font-mono shrink-0">{hive.id}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[var(--text-primary)] break-words">
                      {hive.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed break-words">
                      Located at {hive.location || 'Apiary'}. Queen age: {hive.queenAgeMonths ?? '—'} months.
                    </p>

                    {/* Actionable Diagnostic Guidance */}
                    <div className="p-3 rounded-xl bg-[var(--surface-secondary)]/70 border border-[var(--border)] text-xs text-[var(--text-primary)] space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-[var(--accent)] block">
                        Recommended Action:
                      </span>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        {hasAlert
                          ? 'Perform manual internal inspection for swarm cells, queen vigor, and varroa mite levels.'
                          : acousticDrop
                          ? 'Acoustic level below 220 Hz baseline. Check brood comb and entrance ventilation.'
                          : queenOld
                          ? 'Queen age exceeds 18 months. Plan spring queen rearing or replacement.'
                          : 'Colony status nominal. Maintain standard 14-day inspection and supers check.'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[var(--border)]">
                    <Link
                      to={`/smart-hives/${encodeURIComponent(hive.id)}`}
                      className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline py-1"
                    >
                      <span>Open {hive.id} Telemetry</span>
                      <ArrowRight size={13} className="shrink-0" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligencePage;
