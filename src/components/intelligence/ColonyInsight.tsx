import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, AlertTriangle, Activity, Thermometer, Droplets, Weight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Link } from 'react-router-dom';

// Current observed data snapshot (would come from real-time sensor feed)
const observedData = {
  hiveId: 'H-104',
  observationWindow: 'Last 6 hours',
  asOf: 'Today, 20:00 IST',
  acousticFreq: '196.4 Hz',
  acousticBaseline: '240 Hz',
  acousticDrop: '18.2%',
  temperature: '35.1 °C',
  tempStatus: 'Elevated (normal ≤ 35 °C)',
  weight: '38.2 kg',
  weightDelta: '−0.5 kg (7-day delta)',
  humidity: '61%',
  colonyActivity: 'Reduced',
  queenAge: '14 months',
  riskFlag: 'Possible colony stress — inspection recommended',
};

export const ColonyInsight: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[var(--surface)] p-6 sm:p-7 rounded-3xl border border-[var(--border)] h-full flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[var(--accent)]" />
              <h2 className="text-xl font-serif font-bold text-[var(--text-primary)]">Colony Insight</h2>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[var(--accent)] border border-[var(--accent)]/20 font-semibold">
              OBSERVED
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] mb-5">
            Current sensor readings · {observedData.observationWindow} · as of {observedData.asOf}
          </p>

          {/* Alert banner */}
          <div className="mb-5 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              <span className="font-bold">Hive {observedData.hiveId}:</span> {observedData.riskFlag}
            </p>
          </div>

          {/* Observed metrics grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm py-2 border-b border-[var(--border)]">
              <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Activity size={14} /> Acoustic Freq.
              </span>
              <span className="font-mono font-bold text-[var(--text-primary)]">{observedData.acousticFreq}
                <span className="text-[10px] text-amber-600 ml-1">↓ {observedData.acousticDrop}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b border-[var(--border)]">
              <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Thermometer size={14} /> Temperature
              </span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{observedData.temperature}</span>
            </div>
            <div className="flex items-center justify-between text-sm py-2 border-b border-[var(--border)]">
              <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Weight size={14} /> Hive Weight
              </span>
              <span className="font-mono font-bold text-[var(--text-primary)]">{observedData.weight}
                <span className="text-[10px] text-[var(--warning)] ml-1">{observedData.weightDelta}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-sm py-2">
              <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Droplets size={14} /> Humidity
              </span>
              <span className="font-mono font-bold text-[var(--text-primary)]">{observedData.humidity}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 px-4 border border-[var(--border)] text-[var(--text-primary)] rounded-xl hover:border-[var(--accent)] hover:bg-[var(--surface-secondary)] transition-all font-medium text-sm shadow-xs"
        >
          <span>View Full Diagnostic</span>
          <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Colony Diagnostic: Hive H-104">
        <div className="space-y-4 text-xs font-sans text-[var(--text-secondary)]">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[var(--text-primary)]">
            <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-400 mb-1">
              <AlertTriangle size={16} />
              <span>Recommended: Physical Inspection within 24 hours</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Acoustic sensors recorded a sustained drop from 240 Hz (active queen baseline) to 196 Hz. Combined
              with a 14-month queen age and a −0.5 kg 7-day weight delta, this may indicate colony stress.
              A physical brood nest inspection is the only way to confirm.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
              <span className="text-[10px] uppercase font-semibold block text-[var(--text-secondary)]">Acoustic Freq.</span>
              <span className="font-mono text-lg font-bold text-[var(--text-primary)]">196.4 Hz</span>
              <span className="text-[10px] text-amber-600 font-medium block">↓ 18.2% from baseline</span>
            </div>
            <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
              <span className="text-[10px] uppercase font-semibold block text-[var(--text-secondary)]">Hive Weight</span>
              <span className="font-mono text-lg font-bold text-[var(--text-primary)]">38.2 kg</span>
              <span className="text-[10px] text-[var(--warning)] font-medium block">−0.5 kg over 7 days</span>
            </div>
            <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
              <span className="text-[10px] uppercase font-semibold block text-[var(--text-secondary)]">Temperature</span>
              <span className="font-mono text-lg font-bold text-amber-600">35.1 °C</span>
              <span className="text-[10px] text-[var(--text-secondary)] font-medium block">Slightly elevated</span>
            </div>
            <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
              <span className="text-[10px] uppercase font-semibold block text-[var(--text-secondary)]">Queen Age</span>
              <span className="font-mono text-lg font-bold text-[var(--text-primary)]">14 months</span>
              <span className="text-[10px] text-[var(--text-secondary)] font-medium block">Consider requeening at 18m</span>
            </div>
          </div>

          <p className="text-[11px] italic text-[var(--text-secondary)] pt-2 border-t border-[var(--border)]">
            This insight is based on observed sensor data only. No disease is diagnosed or implied. Consult an experienced
            beekeeper before taking any action.
          </p>

          <div className="flex justify-between items-center pt-2">
            <Link to="/smart-hives/H-104" className="text-xs text-[var(--accent)] font-semibold hover:underline">
              Open H-104 Telemetry →
            </Link>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-medium hover:opacity-90"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ColonyInsight;
