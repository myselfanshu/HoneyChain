import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, AlertTriangle, Activity, Thermometer, Droplets, Weight, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/contexts/LanguageContext';
import { Hive } from '@/api/hives';

interface ColonyInsightProps {
  hive?: Hive | null;
}

export const ColonyInsight: React.FC<ColonyInsightProps> = ({ hive }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hiveId = hive?.id || 'H-101';
  const hiveName = hive?.name || 'Smart Hive';
  const latestSensor = hive?.telemetry && hive.telemetry.length > 0 ? hive.telemetry[0] : null;

  const acousticFreq = latestSensor?.acousticLevel != null ? `${Number(latestSensor.acousticLevel).toFixed(1)} Hz` : '240.0 Hz';
  const acousticVal = latestSensor?.acousticLevel != null ? Number(latestSensor.acousticLevel) : null;
  const acousticDrop = acousticVal != null && acousticVal < 220 
    ? `${Math.round(((240 - acousticVal) / 240) * 100)}%` 
    : null;
  const temperature = latestSensor?.temperatureC != null ? `${Number(latestSensor.temperatureC).toFixed(1)} °C` : '35.0 °C';
  const weight = latestSensor?.weightKg != null ? `${Number(latestSensor.weightKg).toFixed(1)} kg` : '35.0 kg';
  const humidity = latestSensor?.humidityPct != null ? `${Math.round(Number(latestSensor.humidityPct))}%` : '60%';
  const isWarning = hive?.status === 'WATCH' || hive?.status === 'INSPECT' || Boolean(acousticDrop);

  return (
    <>
      <div className="bg-[var(--surface)] p-5 sm:p-7 rounded-3xl border border-[var(--border)] h-full flex flex-col justify-between shadow-sm min-w-0 w-full">
        <div>
          <div className="flex items-start sm:items-center justify-between gap-2 mb-1 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldAlert className="w-5 h-5 text-[var(--accent)] shrink-0" />
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[var(--text-primary)] break-words">{t.intelligence.colonyInsightTitle}</h2>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[var(--accent)] border border-[var(--accent)]/20 font-semibold shrink-0">
              {t.intelligence.observedBadge}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] mb-5 break-words">
            {t.intelligence.colonyInsightSubtitle} ({hiveName})
          </p>

          {/* Alert / Nominal banner */}
          {isWarning ? (
            <div className="mb-5 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-2 min-w-0">
              <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed break-words">
                <span className="font-bold">Colony {hiveName} ({hiveId}):</span> {t.intelligence.riskFlagText}
              </p>
            </div>
          ) : (
            <div className="mb-5 p-3 rounded-xl bg-green-500/8 border border-green-500/20 flex items-start gap-2 min-w-0">
              <CheckCircle2 size={15} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed break-words">
                <span className="font-bold">Colony {hiveName} ({hiveId}):</span> Telemetry within nominal baseline range (240 Hz / 35°C).
              </p>
            </div>
          )}

          {/* Observed metrics grid */}
          <div className="space-y-3 min-w-0">
            <div className="flex items-center justify-between text-xs sm:text-sm py-2.5 border-b border-[var(--border)] gap-2">
              <span className="flex items-center gap-2 text-[var(--text-secondary)] min-w-0 truncate">
                <Activity size={14} className="shrink-0" /> <span className="truncate">{t.smartHives.acousticFreq}</span>
              </span>
              <span className="font-mono font-bold text-[var(--text-primary)] shrink-0 text-right">
                {acousticFreq}
                {acousticDrop && <span className="text-[10px] text-amber-600 ml-1">↓ {acousticDrop}</span>}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm py-2.5 border-b border-[var(--border)] gap-2">
              <span className="flex items-center gap-2 text-[var(--text-secondary)] min-w-0 truncate">
                <Thermometer size={14} className="shrink-0" /> <span className="truncate">{t.smartHives.temp}</span>
              </span>
              <span className="font-mono font-bold text-[var(--text-primary)] shrink-0">{temperature}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm py-2.5 border-b border-[var(--border)] gap-2">
              <span className="flex items-center gap-2 text-[var(--text-secondary)] min-w-0 truncate">
                <Weight size={14} className="shrink-0" /> <span className="truncate">{t.smartHives.weight}</span>
              </span>
              <span className="font-mono font-bold text-[var(--text-primary)] shrink-0 text-right">
                {weight}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm py-2.5 gap-2">
              <span className="flex items-center gap-2 text-[var(--text-secondary)] min-w-0 truncate">
                <Droplets size={14} className="shrink-0" /> <span className="truncate">{t.smartHives.humidity}</span>
              </span>
              <span className="font-mono font-bold text-[var(--text-primary)] shrink-0">{humidity}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 px-4 border border-[var(--border)] text-[var(--text-primary)] rounded-xl hover:border-[var(--accent)] hover:bg-[var(--surface-secondary)] transition-all font-medium text-xs sm:text-sm shadow-xs cursor-pointer"
        >
          <span>{t.intelligence.viewDiagnostic}</span>
          <ArrowRight className="w-4 h-4 text-[var(--accent)] shrink-0" />
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${t.intelligence.colonyInsightTitle}: ${hiveName} (${hiveId})`}>
        <div className="space-y-4 text-xs font-sans text-[var(--text-secondary)]">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[var(--text-primary)]">
            <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400 mb-1">
              <AlertTriangle size={16} />
              <span>{t.intelligence.riskFlagText}</span>
            </div>
            <p>{t.overview.suggestedActionText}</p>
          </div>

          <div>
            <h4 className="font-bold text-[var(--text-primary)] mb-1 text-sm">{t.overview.whyItMatters}</h4>
            <p className="leading-relaxed">{t.overview.whyItMattersText}</p>
          </div>

          <div>
            <h4 className="font-bold text-[var(--text-primary)] mb-1 text-sm">{t.overview.confidenceLimitation}</h4>
            <p className="leading-relaxed italic">{t.overview.confidenceLimitationText}</p>
          </div>

          {hive && (
            <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center">
              <Link
                to={`/smart-hives/${encodeURIComponent(hive.id)}`}
                className="text-[var(--accent)] font-semibold hover:underline text-xs"
              >
                {t.overview.openTelemetry} →
              </Link>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ColonyInsight;
