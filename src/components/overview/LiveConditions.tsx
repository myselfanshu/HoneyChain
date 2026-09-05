import React, { useState } from 'react';
import { Thermometer, Droplets, Weight, Activity, Shield, ChevronDown, ChevronUp } from 'lucide-react';

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

const conditions: Condition[] = [
  {
    icon: Thermometer,
    label: 'Temperature',
    value: '32.8 °C',
    status: 'Optimal',
    updatedAt: '2 min ago',
    detail: 'Within normal brood nest range (30–36 °C)',
  },
  {
    icon: Droplets,
    label: 'Humidity',
    value: '58%',
    status: 'Optimal',
    updatedAt: '2 min ago',
    detail: 'Ideal for nectar ripening (50–70%)',
  },
  {
    icon: Weight,
    label: 'Hive Weight',
    value: '42.1 kg',
    status: 'Optimal',
    updatedAt: '5 min ago',
    detail: 'Average across 24 hives. +1.2 kg over 7 days.',
  },
  {
    icon: Activity,
    label: 'Colony Activity',
    value: 'High',
    status: 'Optimal',
    updatedAt: '1 min ago',
    detail: 'Forager flights: 85 avg/min. Normal for daytime.',
  },
  {
    icon: Shield,
    label: 'Risk Assessment',
    value: 'Low',
    status: 'Elevated',
    updatedAt: '8 min ago',
    detail: 'H-104 has acoustic anomaly. 1 hive under watch.',
    iconColor: 'text-[var(--warning)]',
  },
];

const statusStyles: Record<StatusLevel, string> = {
  Optimal:  'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  Elevated: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  Warning:  'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  Critical: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
};

const LiveConditions: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const visibleConditions = expanded ? conditions : conditions.slice(0, 3);

  return (
    <div className="bg-[var(--surface)] p-5 sm:p-6 rounded-xl border border-[var(--border)]">
      <h3 className="text-base font-serif font-bold text-[var(--text-primary)] mb-4">Live Conditions <span className="text-sm font-sans font-normal text-[var(--text-secondary)]">(Avg)</span></h3>

      <div className="space-y-0">
        {visibleConditions.map((cond, idx) => {
          const Icon = cond.icon;
          const isLast = idx === visibleConditions.length - 1;
          return (
            <div
              key={cond.label}
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
                      {cond.status}
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
        className="mt-4 text-left font-sans text-sm text-[var(--accent)] hover:underline flex items-center gap-1 transition-colors"
        aria-expanded={expanded}
      >
        {expanded ? (
          <>Show less <ChevronUp size={14} /></>
        ) : (
          <>View all conditions <ChevronDown size={14} /></>
        )}
      </button>
    </div>
  );
};

export default LiveConditions;
