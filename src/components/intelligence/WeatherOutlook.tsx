import React from 'react';
import { Sun, Wind, Droplets, CloudRain, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

export const WeatherOutlook: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-[var(--surface)] p-5 sm:p-7 rounded-3xl border border-[var(--border)] h-full flex flex-col justify-between shadow-sm min-w-0 w-full">
      <div>
        <div className="flex items-start sm:items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[var(--text-primary)] break-words">{t.intelligence.weatherOutlookTitle}</h2>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)] font-semibold shrink-0">
            APIARY STATION 1
          </span>
        </div>

        <div className="flex items-center justify-between my-3 p-3.5 sm:p-4 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-amber-500/10 text-[var(--accent)] border border-[var(--accent)]/20 shrink-0">
              <Sun className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="min-w-0">
              <span className="text-2xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] block">28°C</span>
              <p className="text-xs text-[var(--text-secondary)] font-medium truncate">{t.intelligence.weatherClear}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 my-3">
          <div className="p-2 sm:p-3 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] text-center min-w-0">
            <Wind className="w-4 h-4 text-[var(--accent)] mx-auto mb-1 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] block truncate">12 km/h</span>
            <span className="text-[9px] sm:text-[10px] text-[var(--text-secondary)] block truncate">{t.intelligence.wind}</span>
          </div>
          <div className="p-2 sm:p-3 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] text-center min-w-0">
            <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] block truncate">46%</span>
            <span className="text-[9px] sm:text-[10px] text-[var(--text-secondary)] block truncate">{t.smartHives.humidity}</span>
          </div>
          <div className="p-2 sm:p-3 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] text-center min-w-0">
            <CloudRain className="w-4 h-4 text-[var(--text-secondary)] mx-auto mb-1 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)] block truncate">0%</span>
            <span className="text-[9px] sm:text-[10px] text-[var(--text-secondary)] block truncate">{t.intelligence.precip}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-2.5 sm:p-3 rounded-2xl text-center text-xs font-semibold flex items-center justify-center gap-1.5 break-words">
        <CheckCircle size={15} className="shrink-0" />
        <span className="break-words leading-tight">{t.intelligence.foragingFavorable}</span>
      </div>
    </div>
  );
};

export default WeatherOutlook;
