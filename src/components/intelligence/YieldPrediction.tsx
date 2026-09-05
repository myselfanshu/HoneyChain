import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

type Horizon = '24h' | '3d' | '7d';

// Historical data (observed)
const historical = [
  { date: 'Aug 20', yield: 165, projected: null },
  { date: 'Aug 23', yield: 169, projected: null },
  { date: 'Aug 26', yield: 174, projected: null },
  { date: 'Aug 29', yield: 179, projected: null },
  { date: 'Sep 01', yield: 183, projected: null },
  { date: 'Sep 05', yield: 186.4, projected: 186.4 }, // pivot — today
];

// Forecast tails per horizon (appended to historical)
const forecastTails: Record<Horizon, { date: string; yield: null; projected: number }[]> = {
  '24h': [
    { date: 'Sep 06', yield: null, projected: 187.8 },
  ],
  '3d': [
    { date: 'Sep 06', yield: null, projected: 187.8 },
    { date: 'Sep 07', yield: null, projected: 189.2 },
    { date: 'Sep 08', yield: null, projected: 190.1 },
  ],
  '7d': [
    { date: 'Sep 06', yield: null, projected: 187.8 },
    { date: 'Sep 07', yield: null, projected: 189.2 },
    { date: 'Sep 08', yield: null, projected: 190.1 },
    { date: 'Sep 09', yield: null, projected: 191.3 },
    { date: 'Sep 10', yield: null, projected: 192.4 },
    { date: 'Sep 11', yield: null, projected: 191.8 },
    { date: 'Sep 12', yield: null, projected: 190.9 },
  ],
};

const horizonMeta: Record<Horizon, {
  label: string;
  projectedRange: string;
  trend: 'up' | 'flat' | 'down';
  trendLabel: string;
  confidence: string;
  basis: string;
}> = {
  '24h': {
    label: '24 Hours',
    projectedRange: '187–189 kg',
    trend: 'up',
    trendLabel: '+1.4 kg projected',
    confidence: 'Based on today\'s weight trend (±3%)',
    basis: 'H-102, H-103, H-105 showing active nectar flow; weather dry.',
  },
  '3d': {
    label: '3 Days',
    projectedRange: '189–192 kg',
    trend: 'up',
    trendLabel: '+3.7 kg projected over 3 days',
    confidence: 'Based on 7-day weight trajectory (±6%)',
    basis: 'Continued dry weather forecast. H-104 excluded from estimate (watch status).',
  },
  '7d': {
    label: '7 Days',
    projectedRange: '190–195 kg',
    trend: 'flat',
    trendLabel: 'Plateau expected by Sep 11',
    confidence: 'Based on seasonal nectar flow model (±9%)',
    basis: 'Mustard bloom typically peaks at 6 weeks — may begin tapering by Sep 10.',
  },
};

export const YieldPrediction: React.FC = () => {
  const [horizon, setHorizon] = useState<Horizon>('3d');

  const meta = horizonMeta[horizon];
  const chartData = [...historical, ...forecastTails[horizon]];

  const TrendIcon = meta.trend === 'up' ? TrendingUp : meta.trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    meta.trend === 'up'
      ? 'text-green-600 dark:text-green-400'
      : meta.trend === 'down'
      ? 'text-red-500'
      : 'text-[var(--text-secondary)]';

  return (
    <div className="bg-[var(--surface)] p-6 sm:p-7 rounded-3xl border border-[var(--border)] h-full flex flex-col shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <TrendingUp className="w-5 h-5" />
          <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">Yield Forecast</h2>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold">
          SIMULATED
        </span>
      </div>
      <p className="text-[11px] text-[var(--text-secondary)] mb-4">
        Deterministic trend projection — Demo mode · Not connected to a live AI model
      </p>

      {/* Horizon selector */}
      <div className="flex items-center gap-1 p-1 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl mb-5 self-start">
        {(['24h', '3d', '7d'] as Horizon[]).map((h) => (
          <button
            key={h}
            onClick={() => setHorizon(h)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              horizon === h
                ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {h}
          </button>
        ))}
      </div>

      {/* Current + projected range */}
      <div className="mb-4">
        <p className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-1 font-semibold">
          Projected Range · Next {meta.label}
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-serif font-bold text-[var(--text-primary)]">{meta.projectedRange}</span>
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${trendColor}`}>
            <TrendIcon size={13} />
            {meta.trendLabel}
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] mt-1">{meta.confidence}</p>
      </div>

      {/* Chart */}
      <div className="w-full h-[160px] mt-2 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '11px' }}
              itemStyle={{ color: 'var(--accent)' }}
              formatter={(value: any, name: string) => [
                `${value} kg`,
                name === 'yield' ? 'Observed' : 'Projected',
              ]}
            />
            {/* Today reference line */}
            <ReferenceLine x="Sep 05" stroke="var(--border)" strokeDasharray="4 2" label={{ value: 'Today', fontSize: 9, fill: 'var(--text-secondary)' }} />
            {/* Observed line */}
            <Area
              type="monotone"
              dataKey="yield"
              stroke="var(--accent)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorYield)"
              connectNulls={false}
              dot={false}
            />
            {/* Projected dashed line */}
            <Area
              type="monotone"
              dataKey="projected"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 3"
              fillOpacity={1}
              fill="url(#colorProjected)"
              connectNulls={true}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Basis note */}
      <div className="pt-3 border-t border-[var(--border)] text-[11px] text-[var(--text-secondary)]">
        <span className="font-semibold text-[var(--text-primary)]">Basis:</span> {meta.basis}
      </div>
    </div>
  );
};

export default YieldPrediction;
