import React, { useState } from 'react';
import { Thermometer, Droplets, Weight, Activity, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

type StatusLevel = 'Optimal' | 'Elevated' | 'Warning' | 'Critical';

interface Condition {
  icon: React.ElementType;
  label: string;
  value: string;
  status: StatusLevel;
  updatedAt: string;
  detail: string;
  iconColor?: string;
}

const statusStyles: Record<StatusLevel, string> = {
  Optimal:  'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  Elevated: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  Warning:  'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  Critical: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
};

const LiveConditions: React.FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const conditions: Condition[] = [
    {
      icon: Thermometer,
      label: t.overview.condTemp,
      value: '32.8 °C',
      status: 'Optimal',
      updatedAt: `2 min`,
      detail: t.overview.condTempDetail,
    },
    {
      icon: Droplets,
      label: t.overview.condHumidity,
      value: '58%',
      status: 'Optimal',
      updatedAt: `2 min`,
      detail: t.overview.condHumidityDetail,
    },
    {
      icon: Weight,
      label: t.overview.condWeight,
      value: '42.1 kg',
      status: 'Optimal',
      updatedAt: `5 min`,
      detail: t.overview.condWeightDetail,
    },
    {
      icon: Activity,
      label: t.overview.condActivity,
      value: t.common.optimal,
      status: 'Optimal',
      updatedAt: `1 min`,
      detail: t.overview.condActivityDetail,
    },
    {
      icon: Shield,
      label: t.overview.condRisk,
      value: t.intelligence.observed,
      status: 'Elevated',
      updatedAt: `8 min`,
      detail: t.overview.condRiskDetail,
      iconColor: 'text-[var(--warning)]',
    },
  ];

  const getLocalizedStatus = (status: StatusLevel) => {
    switch (status) {
      case 'Optimal': return t.common.optimal;
      case 'Elevated': return t.common.elevated;
      case 'Warning': return t.common.warning;
      case 'Critical': return t.common.critical;
      default: return status;
    }
  };

  const visibleConditions = expanded ? conditions : conditions.slice(0, 3);

  return (
    <div className="bg-[var(--surface)] p-5 sm:p-6 rounded-xl border border-[var(--border)]">
      <h3 className="text-base font-serif font-bold text-[var(--text-primary)] mb-4">
        {t.overview.liveConditions} <span className="text-sm font-sans font-normal text-[var(--text-secondary)]">({t.overview.average})</span>
      </h3>

      <div className="space-y-0">
        {visibleConditions.map((cond, idx) => {
          const Icon = cond.icon;
          const isLast = idx === visibleConditions.length - 1;
          return (
            <div
              key={idx}
              className={`py-3 ${!isLast ? 'border-b border-[var(--border)]' : ''} transition-all`}
            >
              {/* Top row: icon + label + value */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2.5 ${cond.iconColor ?? 'text-[var(--text-secondary)]'}`}>
                  <Icon size={16} className="shrink-0" />
                  <span className="font-sans text-sm text-[var(--text-secondary)]">{cond.label}</span>
                </div>
                <span className="font-sans font-semibold text-sm text-[var(--text-primary)]">{cond.value}</span>
              </div>

              {/* Expanded detail row */}
              {expanded && (
                <div className="mt-2 flex items-start justify-between gap-3 pl-6">
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed flex-1">{cond.detail}</p>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyles[cond.status]}`}>
                      {getLocalizedStatus(cond.status)}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] font-mono">{cond.updatedAt}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 text-left font-sans text-sm text-[var(--accent)] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
        aria-expanded={expanded}
      >
        {expanded ? (
          <>{t.overview.showLess} <ChevronUp size={14} /></>
        ) : (
          <>{t.overview.viewAllConditions} <ChevronDown size={14} /></>
        )}
      </button>
    </div>
  );
};

export default LiveConditions;
