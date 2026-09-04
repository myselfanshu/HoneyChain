import React from 'react';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Aug 10', yield: 150 },
  { date: 'Aug 15', yield: 158 },
  { date: 'Aug 20', yield: 165 },
  { date: 'Aug 25', yield: 172 },
  { date: 'Aug 30', yield: 178 },
  { date: 'Sep 05', yield: 182 },
  { date: 'Sep 10', yield: 186.4 },
];

export const YieldPrediction: React.FC = () => {
  return (
    <div className="bg-[var(--surface)] p-6 sm:p-7 rounded-3xl border border-[var(--border)] h-full flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <TrendingUp className="w-5 h-5" />
            <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">Yield Prediction</h2>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 font-semibold">
            OPTIMAL HARVEST
          </span>
        </div>

        <div className="mb-4">
          <p className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-1 font-semibold">Expected Honey Yield</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]">186.4 kg</span>
            <span className="text-green-600 dark:text-green-400 text-xs font-semibold flex items-center gap-0.5">
              ↑ 12.8% <span className="text-[var(--text-secondary)] font-normal hidden sm:inline">from last cycle</span>
            </span>
          </div>
        </div>
      </div>

      <div className="w-full h-[180px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: 'var(--accent)' }}
              formatter={(value: any) => [`${value} kg`, 'Expected Yield']}
            />
            <Area type="monotone" dataKey="yield" stroke="var(--accent)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorYield)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] flex justify-between items-center">
        <span>Nectar flow forecast: High</span>
        <span className="text-[var(--accent)] font-medium">Model v4.2</span>
      </div>
    </div>
  );
};

export default YieldPrediction;
