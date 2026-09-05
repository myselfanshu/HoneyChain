import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/contexts/LanguageContext';

const data = [
  { time: '03 AM', activity: 30 },
  { time: '06 AM', activity: 45 },
  { time: '09 AM', activity: 85 },
  { time: '12 PM', activity: 95 },
  { time: '03 PM', activity: 88 },
  { time: '06 PM', activity: 60 },
  { time: '09 PM', activity: 40 },
  { time: '12 AM', activity: 35 },
];

export const ActivityTimeline: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-6 h-full">
      <h3 className="font-serif text-lg text-[var(--text-primary)] font-bold mb-6">{t.smartHives.activityTimeline}</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis 
              stroke="var(--text-secondary)" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => {
                if (val >= 80) return t.common.optimal;
                if (val >= 40) return t.common.watch;
                return t.common.inspect;
              }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Area type="monotone" dataKey="activity" stroke="#f59e0b" fillOpacity={1} fill="url(#colorActivity)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center mt-4 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
          {t.smartHives.activity}
        </div>
      </div>
    </div>
  );
};
