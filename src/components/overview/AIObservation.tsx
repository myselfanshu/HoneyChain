import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/contexts/LanguageContext';

const AIObservation: React.FC = () => {
  const { t } = useTranslation();
  const [showRec, setShowRec] = useState(false);

  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] relative overflow-hidden">
      {/* Accent left bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-[var(--warning)]" />

      {/* Card body with consistent padding */}
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 text-[var(--warning)]">
          <AlertTriangle size={18} className="shrink-0" />
          <h3 className="text-base font-serif font-bold text-[var(--text-primary)]">{t.overview.observation}</h3>
          <span className="ml-auto text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shrink-0">
            {t.common.watch.toUpperCase()}
          </span>
        </div>

        {/* OBSERVATION */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">{t.overview.observation}</p>
          <p className="font-sans text-[var(--text-secondary)] leading-relaxed text-sm">
            {t.overview.observationText}
          </p>
        </div>

        {/* Sensor snapshot — compact grid */}
        <div className="bg-[var(--background)] rounded-lg p-3 mb-4 border border-[var(--border)]">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-2">
            {t.overview.sensorSnapshot}
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs font-sans">
            {[
              { label: t.smartHives.temp, value: '35.1 °C' },
              { label: t.smartHives.humidity, value: '61%' },
              { label: t.smartHives.weight, value: '38.2 kg' },
              { label: t.smartHives.activity, value: t.intelligence.acousticDecline, highlight: true },
              { label: t.smartHives.queenAge, value: '14 mo.' },
              { label: t.smartHives.acousticFreq, value: '196 Hz', highlight: true },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex justify-between gap-1 min-w-0">
                <span className="text-[var(--text-secondary)] shrink-0">{label}:</span>
                <span className={`font-semibold truncate ${highlight ? 'text-amber-700 dark:text-amber-400' : 'text-[var(--text-primary)]'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setShowRec((v) => !v)}
          className="w-full py-2 px-4 rounded-lg border border-[var(--warning)] text-[var(--warning)] hover:bg-amber-500/10 transition-colors font-sans text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          aria-expanded={showRec}
        >
          {showRec
            ? <><ChevronUp size={14} className="shrink-0" /> {t.overview.hideRecommendation}</>
            : <>{t.overview.viewRecommendation} <ChevronDown size={14} className="shrink-0" /></>
          }
        </button>

        {/* Recommendation panel */}
        {showRec && (
          <div className="mt-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs overflow-hidden">
            <div className="p-4 space-y-3 max-h-72 overflow-y-auto">

              {/* WHY IT MATTERS */}
              <div>
                <p className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">{t.overview.whyItMatters}</p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {t.overview.whyItMattersText}
                </p>
              </div>

              {/* SUGGESTED ACTION */}
              <div className="pt-2 border-t border-amber-500/20">
                <p className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">{t.overview.suggestedAction}</p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {t.overview.suggestedActionText}
                </p>
              </div>

              {/* CONFIDENCE / DATA LIMITATION */}
              <div className="pt-2 border-t border-amber-500/20">
                <p className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">{t.overview.confidenceLimitation}</p>
                <p className="text-[var(--text-secondary)] italic leading-relaxed">
                  {t.overview.confidenceLimitationText}
                </p>
              </div>

              {/* Link */}
              <Link
                to="/smart-hives/H-104"
                className="flex items-center gap-1 text-[var(--accent)] font-semibold hover:underline pt-1 w-fit"
              >
                {t.overview.openTelemetry} <ExternalLink size={11} className="shrink-0" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIObservation;
