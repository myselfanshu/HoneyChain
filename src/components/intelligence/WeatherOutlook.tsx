import React from 'react';
import { Sun, Wind, Droplets, CloudRain, CheckCircle } from 'lucide-react';

export const WeatherOutlook: React.FC = () => {
  return (
    <div className="bg-[var(--surface)] p-6 sm:p-7 rounded-3xl border border-[var(--border)] h-full flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">Weather Outlook</h2>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)] font-semibold">
            APIARY STATION 1
          </span>
        </div>

        <div className="flex items-center justify-between my-4 p-4 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-[var(--accent)] border border-[var(--accent)]/20">
              <Sun className="w-8 h-8" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)]">28°C</span>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Clear Skies • Optimal Sun</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 my-4">
          <div className="p-3 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] text-center">
            <Wind className="w-4 h-4 text-[var(--accent)] mx-auto mb-1" />
            <span className="text-xs font-bold text-[var(--text-primary)] block">12 km/h</span>
            <span className="text-[10px] text-[var(--text-secondary)]">Wind</span>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] text-center">
            <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <span className="text-xs font-bold text-[var(--text-primary)] block">46%</span>
            <span className="text-[10px] text-[var(--text-secondary)]">Humidity</span>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] text-center">
            <CloudRain className="w-4 h-4 text-[var(--text-secondary)] mx-auto mb-1" />
            <span className="text-xs font-bold text-[var(--text-primary)] block">0%</span>
            <span className="text-[10px] text-[var(--text-secondary)]">Precip</span>
          </div>
        </div>
      </div>
      
      <div className="mt-2 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-3 rounded-2xl text-center text-xs font-semibold flex items-center justify-center gap-2">
        <CheckCircle size={15} />
        <span>Favorable for foraging & hive inspection</span>
      </div>
    </div>
  );
};

export default WeatherOutlook;
