import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useTranslation } from '@/contexts/LanguageContext';

type Horizon = '24h' | '3d' | '7d';

const historical = [
  { date: 'Aug 20', yield: 165, projected: null },
  { date: 'Aug 23', yield: 169, projected: null },
  { date: 'Aug 26', yield: 174, projected: null },
  { date: 'Aug 29', yield: 179, projected: null },
  { date: 'Sep 01', yield: 183, projected: null },
  { date: 'Sep 05', yield: 186.4, projected: 186.4 },
];

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

export const YieldPrediction: React.FC = () => {
  const { t } = useTranslation();
  const [horizon, setHorizon] = useState<Horizon>('3d');

  const horizonMeta: Record<Horizon, {
    label: string;
    projectedRange: string;
    trend: 'up' | 'flat' | 'down';
    trendLabel: string;
    confidence: string;
    basis: string;
  }> = {
    '24h': {
      label: t.intelligence.horizon24h,
      projectedRange: '187–189 kg',
      trend: 'up',
      trendLabel: '+1.4 kg',
      confidence: '±3%',
      basis: 'H-102, H-103, H-105 active nectar flow; dry weather.',
    },
    '3d': {
      label: t.intelligence.horizon3d,
      projectedRange: '189–192 kg',
      trend: 'up',
      trendLabel: '+3.7 kg (3d)',
      confidence: '±6%',
      basis: 'Continued dry weather forecast. H-104 excluded.',
    },
    '7d': {
      label: t.intelligence.horizon7d,
      projectedRange: '190–195 kg',
      trend: 'flat',
      trendLabel: 'Plateau Sep 11',
      confidence: '±9%',
      basis: 'Mustard bloom peaks at 6 weeks — tapering by Sep 10.',
    },
  };

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
    <div className="bg-[var(--surface)] p-5 sm:p-7 rounded-3xl border border-[var(--border)] h-full flex flex-col shadow-sm min-w-0 w-full">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-2 mb-1 flex-wrap">
        <div className="flex items-center gap-2 text-[var(--accent)] min-w-0">
          <TrendingUp className="w-5 h-5 shrink-0" />
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[var(--text-primary)] break-words">{t.intelligence.yieldForecastTitle}</h2>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold shrink-0">
          {t.intelligence.simulatedBadge}
        </span>
      </div>
      <p className="text-[11px] text-[var(--text-secondary)] mb-4 break-words">
        {t.intelligence.yieldForecastSubtitle}
      </p>

      {/* Horizon selector */}
      <div className="flex items-center gap-1 p-1 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl mb-4 self-start max-w-full overflow-x-auto">
        {(['24h', '3d', '7d'] as Horizon[]).map((h) => (
          <button
            key={h}
            onClick={() => setHorizon(h)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              horizon === h
                ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {h === '24h' ? t.intelligence.horizon24h : h === '3d' ? t.intelligence.horizon3d : t.intelligence.horizon7d}
          </button>
        ))}
      </div>

      {/* Current + projected range */}
      <div className="mb-4">
        <p className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-1 font-semibold break-words">
          {t.intelligence.projectedRange} · {meta.label}
        </p>
        <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)]">{meta.projectedRange}</span>
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${trendColor}`}>
            <TrendIcon size={13} />
            {meta.trendLabel}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[160px] mt-2 flex-1 min-w-0 overflow-hidden">
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
                name === 'yield' ? t.intelligence.observed : t.intelligence.projected,
              ]}
            />
            <ReferenceLine x="Sep 05" stroke="var(--border)" strokeDasharray="4 2" label={{ value: t.common.today, fontSize: 9, fill: 'var(--text-secondary)' }} />
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
        <span className="font-semibold text-[var(--text-primary)]">{t.intelligence.dataBasis}:</span> {meta.basis}
      </div>
    </div>
  );
};

export default YieldPrediction;
