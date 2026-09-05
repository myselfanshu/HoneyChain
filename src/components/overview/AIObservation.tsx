import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIObservation: React.FC = () => {
  const [showRec, setShowRec] = useState(false);

  return (
    <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] h-full flex flex-col relative overflow-hidden">
      {/* Accent left bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-[var(--warning)]" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 text-[var(--warning)]">
        <AlertTriangle size={20} />
        <h3 className="text-xl font-serif text-[var(--text-primary)]">Observation</h3>
        <span className="ml-auto text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
          WATCH
        </span>
      </div>

      {/* Main observation */}
      <p className="font-sans text-[var(--text-secondary)] mb-5 leading-relaxed text-sm">
        Hive <strong className="text-[var(--text-primary)]">H-104</strong> shows a possible drop in acoustic
        activity — currently approx. <span className="text-[var(--warning)] font-semibold">196 Hz</span>, down
        from its typical 240 Hz baseline. This may warrant closer monitoring.
      </p>

      {/* Correlated data */}
      <div className="bg-[var(--background)] rounded-lg p-4 mb-5 border border-[var(--border)]">
        <h4 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-sans mb-3 font-semibold">
          Correlated Sensor Snapshot
        </h4>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm font-sans">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Temp:</span>
            <span className="text-[var(--text-primary)]">35.1 °C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Humidity:</span>
            <span className="text-[var(--text-primary)]">61%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Weight:</span>
            <span className="text-[var(--text-primary)]">38.2 kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Activity:</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">Reduced</span>
          </div>
          <div className="flex justify-between col-span-2">
            <span className="text-[var(--text-secondary)]">Queen age:</span>
            <span className="text-[var(--text-primary)]">14 months</span>
          </div>
        </div>
      </div>

      {/* Expandable recommendation panel */}
      <div className="mt-auto">
        <button
          onClick={() => setShowRec((v) => !v)}
          className="w-full py-2 px-4 rounded-md border border-[var(--warning)] text-[var(--warning)] hover:bg-amber-500/10 transition-colors font-sans text-sm font-medium flex items-center justify-center gap-1.5"
          aria-expanded={showRec}
        >
          {showRec ? (
            <><ChevronUp size={14} /> Hide Recommendation</>
          ) : (
            <>View Recommendation <ChevronDown size={14} /></>
          )}
        </button>

        {showRec && (
          <div className="mt-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2">
            <p className="font-semibold text-[var(--text-primary)] text-sm">Suggested Action</p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              A physical inspection of <strong>H-104</strong>'s brood nest is recommended within the next
              24&nbsp;hours. Queen age (14 months) and the acoustic reading together suggest a possible colony
              stress signal — however, conditions could also reflect normal nighttime quieting.
            </p>
            <div className="pt-2 border-t border-amber-500/20 space-y-1">
              <p className="text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">What to look for:</span> swarm cells
                on frame bottoms, queen activity, abnormal brood pattern, unusual clustering.
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] italic">
                This observation is based on sensor correlation only. Physical inspection required before any
                intervention. Not a diagnosis.
              </p>
            </div>
            <Link
              to="/smart-hives/H-104"
              className="flex items-center gap-1 text-[var(--accent)] font-semibold hover:underline pt-1"
            >
              Open H-104 Telemetry <ExternalLink size={12} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIObservation;
