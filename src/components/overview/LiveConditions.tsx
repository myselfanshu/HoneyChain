import React, { useState } from 'react';
import { Thermometer, Droplets, Weight, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Hive } from '@/api/hives';

interface LiveConditionsProps {
  hives?: Hive[];
}

export const LiveConditions: React.FC<LiveConditionsProps> = ({ hives = [] }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  // Find latest telemetry across all user's hives
  const allTelemetry = hives.flatMap((h) => (h.telemetry || []));
  const latest = allTelemetry.length > 0
    ? allTelemetry.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())[0]
    : null;

  const tempVal = latest?.temperatureC != null ? `${Number(latest.temperatureC).toFixed(1)} °C` : '—';
  const humidityVal = latest?.humidityPct != null ? `${Math.round(Number(latest.humidityPct))}%` : '—';
  const weightVal = latest?.weightKg != null ? `${Number(latest.weightKg).toFixed(1)} kg` : '—';
  const activityVal = latest?.colonyActivity != null ? `${Math.round(Number(latest.colonyActivity))}%` : '—';

  const conditions = [
    {
      icon: Thermometer,
      label: t.overview.condTemp,
      value: tempVal,
      status: latest ? 'Optimal' : 'Inactive',
      detail: latest ? 'Latest sensor reading' : 'No sensor connected',
    },
    {
      icon: Droplets,
      label: t.overview.condHumidity,
      value: humidityVal,
      status: latest ? 'Optimal' : 'Inactive',
      detail: latest ? 'Relative nest humidity' : 'No sensor connected',
    },
    {
      icon: Weight,
      label: t.overview.condWeight,
      value: weightVal,
      status: latest ? 'Optimal' : 'Inactive',
      detail: latest ? 'Latest hive mass' : 'No scale connected',
    },
    {
      icon: Activity,
      label: t.overview.condActivity,
      value: activityVal,
      status: latest ? 'Optimal' : 'Inactive',
      detail: latest ? 'Flight & acoustic index' : 'No acoustic sensor connected',
    },
  ];

  return (
    <div className="bg-[var(--surface)] p-5 sm:p-6 rounded-3xl border border-[var(--border)] h-full flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">{t.overview.liveConditions}</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]">
            {latest ? 'TELEMETRY ACTIVE' : 'NO SENSORS'}
          </span>
        </div>

        <div className="space-y-2.5">
          {conditions.slice(0, expanded ? undefined : 3).map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shrink-0">
                  <item.icon size={15} />
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)]">{item.label}</p>
                  <p className="text-[10px] text-[var(--text-secondary)]/70">{item.detail}</p>
                </div>
              </div>
              <span className="font-serif font-bold text-sm text-[var(--text-primary)]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center justify-center gap-1 transition-colors cursor-pointer"
      >
        <span>{expanded ? 'Show Less' : 'Show All Metrics'}</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
    </div>
  );
};

export default LiveConditions;
