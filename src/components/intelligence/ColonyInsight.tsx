import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, AlertTriangle, Activity, Thermometer, Droplets, Weight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/contexts/LanguageContext';

export const ColonyInsight: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const observedData = {
    hiveId: 'H-104',
    acousticFreq: '196.4 Hz',
    acousticDrop: '18.2%',
    temperature: '35.1 °C',
    weight: '38.2 kg',
    weightDelta: '−0.5 kg',
    humidity: '61%',
  };

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
            {t.intelligence.colonyInsightSubtitle}
          </p>

          {/* Alert banner */}
          <div className="mb-5 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-2 min-w-0">
            <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed break-words">
              <span className="font-bold">Hive {observedData.hiveId}:</span> {t.intelligence.riskFlagText}
            </p>
          </div>

          {/* Observed metrics grid */}
          <div className="space-y-3 min-w-0">
            <div className="flex items-center justify-between text-xs sm:text-sm py-2.5 border-b border-[var(--border)] gap-2">
              <span className="flex items-center gap-2 text-[var(--text-secondary)] min-w-0 truncate">
                <Activity size={14} className="shrink-0" /> <span className="truncate">{t.smartHives.acousticFreq}</span>
              </span>
              <span className="font-mono font-bold text-[var(--text-primary)] shrink-0 text-right">
                {observedData.acousticFreq}
                <span className="text-[10px] text-amber-600 ml-1">↓ {observedData.acousticDrop}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm py-2.5 border-b border-[var(--border)] gap-2">
              <span className="flex items-center gap-2 text-[var(--text-secondary)] min-w-0 truncate">
                <Thermometer size={14} className="shrink-0" /> <span className="truncate">{t.smartHives.temp}</span>
              </span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">{observedData.temperature}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm py-2.5 border-b border-[var(--border)] gap-2">
              <span className="flex items-center gap-2 text-[var(--text-secondary)] min-w-0 truncate">
                <Weight size={14} className="shrink-0" /> <span className="truncate">{t.smartHives.weight}</span>
              </span>
              <span className="font-mono font-bold text-[var(--text-primary)] shrink-0 text-right">
                {observedData.weight}
                <span className="text-[10px] text-[var(--warning)] ml-1">{observedData.weightDelta}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm py-2.5 gap-2">
              <span className="flex items-center gap-2 text-[var(--text-secondary)] min-w-0 truncate">
                <Droplets size={14} className="shrink-0" /> <span className="truncate">{t.smartHives.humidity}</span>
              </span>
              <span className="font-mono font-bold text-[var(--text-primary)] shrink-0">{observedData.humidity}</span>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${t.intelligence.colonyInsightTitle}: Hive H-104`}>
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

          <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center">
            <Link
              to="/smart-hives/H-104"
              className="text-[var(--accent)] font-semibold hover:underline text-xs"
            >
              {t.overview.openTelemetry} →
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ColonyInsight;
