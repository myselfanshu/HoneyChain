import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/contexts/LanguageContext';
import { Hive } from '@/api/hives';

interface AIObservationProps {
  hives?: Hive[];
}

export const AIObservation: React.FC<AIObservationProps> = ({ hives = [] }) => {
  const { t } = useTranslation();
  const [showRec, setShowRec] = useState(false);

  // Check if any user hive needs attention
  const watchHive = hives.find((h) => h.status === 'WATCH' || h.status === 'INSPECT');

  if (!watchHive) {
    return (
      <div className="bg-[var(--surface)] p-5 sm:p-6 rounded-3xl border border-[var(--border)] h-full flex flex-col justify-between shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={20} />
            <h3 className="text-base font-serif font-bold text-[var(--text-primary)]">Telemetry Diagnostics</h3>
            <span className="ml-auto text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              NOMINAL
            </span>
          </div>

          <div className="space-y-2 mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Colony Status</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {hives.length === 0
                ? 'No smart hives registered yet. Add a hive to activate acoustic and thermal monitoring.'
                : 'All registered colonies are reporting stable thermal conditions and healthy flight activity.'}
            </p>
          </div>
        </div>

        {hives.length > 0 && (
          <div className="pt-4 border-t border-[var(--border)] mt-4">
            <Link
              to="/intelligence"
              className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center justify-between"
            >
              <span>View Intelligence Center</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    );
  }

  const latest = watchHive.telemetry?.[0];
  const temp = latest?.temperatureC != null ? `${Number(latest.temperatureC).toFixed(1)} °C` : '—';
  const humidity = latest?.humidityPct != null ? `${Math.round(Number(latest.humidityPct))}%` : '—';
  const weight = latest?.weightKg != null ? `${Number(latest.weightKg).toFixed(1)} kg` : '—';
  const acoustic = latest?.acousticLevel != null ? `${Number(latest.acousticLevel).toFixed(0)} Hz` : '—';

  return (
    <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 shadow-xs">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--warning)]" />

      <div>
        <div className="flex items-center gap-2 mb-3 text-[var(--warning)]">
          <AlertTriangle size={18} className="shrink-0" />
          <h3 className="text-base font-serif font-bold text-[var(--text-primary)]">{t.overview.observation}</h3>
          <span className="ml-auto text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shrink-0">
            {watchHive.status}
          </span>
        </div>

        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
            {watchHive.name} ({watchHive.id})
          </p>
          <p className="font-sans text-[var(--text-secondary)] leading-relaxed text-xs">
            {t.overview.observationText}
          </p>
        </div>

        <div className="bg-[var(--background)] rounded-xl p-3 mb-3 border border-[var(--border)]">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs font-sans">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>{t.smartHives.temp}:</span>
              <span className="font-semibold text-[var(--text-primary)]">{temp}</span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>{t.smartHives.humidity}:</span>
              <span className="font-semibold text-[var(--text-primary)]">{humidity}</span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>{t.smartHives.weight}:</span>
              <span className="font-semibold text-[var(--text-primary)]">{weight}</span>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Acoustic:</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">{acoustic}</span>
            </div>
          </div>
        </div>

        {showRec && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-800 dark:text-amber-300 mb-3 animate-fade-in">
            <p className="font-bold mb-1">{t.overview.suggestedAction}</p>
            <p className="text-[11px]">{t.overview.suggestedActionText}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] mt-2">
        <button
          onClick={() => setShowRec(!showRec)}
          className="text-xs font-semibold text-[var(--accent)] flex items-center gap-1 cursor-pointer"
        >
          <span>{showRec ? t.overview.hideRecommendation : t.overview.viewRecommendation}</span>
          {showRec ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <Link
          to={`/smart-hives/${encodeURIComponent(watchHive.id)}`}
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          Inspect Hive →
        </Link>
      </div>
    </div>
  );
};

export default AIObservation;
