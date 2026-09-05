import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIObservation: React.FC = () => {
  const [showRec, setShowRec] = useState(false);

  return (
    /*
      Do NOT use h-full here — that causes the card to stretch to the grid
      row height, which means expanding this card forces the row taller and
      pushes the ApiaryMap. Instead: natural block flow. The parent grid uses
      items-start so each column sizes independently.
    */
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] relative overflow-hidden">
      {/* Accent left bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-[var(--warning)]" />

      {/* Card body with consistent padding */}
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 text-[var(--warning)]">
          <AlertTriangle size={18} className="shrink-0" />
          <h3 className="text-base font-serif font-bold text-[var(--text-primary)]">Observation</h3>
          <span className="ml-auto text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shrink-0">
            WATCH
          </span>
        </div>

        {/* OBSERVATION */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Observation</p>
          <p className="font-sans text-[var(--text-secondary)] leading-relaxed text-sm">
            Hive <strong className="text-[var(--text-primary)]">H-104</strong> shows a possible reduction
            in acoustic activity — currently approx.{' '}
            <span className="text-[var(--warning)] font-semibold">196 Hz</span>, down from its typical
            240 Hz baseline.
          </p>
        </div>

        {/* Sensor snapshot — compact grid, no overflow */}
        <div className="bg-[var(--background)] rounded-lg p-3 mb-4 border border-[var(--border)]">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-2">
            Correlated Sensor Snapshot
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs font-sans">
            {[
              { label: 'Temp', value: '35.1 °C' },
              { label: 'Humidity', value: '61%' },
              { label: 'Weight', value: '38.2 kg' },
              { label: 'Activity', value: 'Reduced', highlight: true },
              { label: 'Queen age', value: '14 mo.' },
              { label: 'Acoustic', value: '196 Hz', highlight: true },
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
          className="w-full py-2 px-4 rounded-lg border border-[var(--warning)] text-[var(--warning)] hover:bg-amber-500/10 transition-colors font-sans text-sm font-medium flex items-center justify-center gap-1.5"
          aria-expanded={showRec}
        >
          {showRec
            ? <><ChevronUp size={14} className="shrink-0" /> Hide Recommendation</>
            : <>View Recommendation <ChevronDown size={14} className="shrink-0" /></>
          }
        </button>

        {/* Recommendation panel — expands below button, inside the card,
            contained scroll for tall content. Does NOT change grid row height
            because the grid uses items-start. */}
        {showRec && (
          <div className="mt-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs overflow-hidden">
            <div className="p-4 space-y-3 max-h-72 overflow-y-auto">

              {/* WHY IT MATTERS */}
              <div>
                <p className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Why It Matters</p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  The current acoustic reading differs from H-104's established baseline. Combined with a
                  14-month queen age and a 7-day weight delta of −0.5 kg, this may indicate a possible colony
                  stress signal. However, readings can also reflect normal diurnal quieting — a physical
                  inspection is the only reliable way to determine the cause.
                </p>
              </div>

              {/* SUGGESTED ACTION */}
              <div className="pt-2 border-t border-amber-500/20">
                <p className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Suggested Action</p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Conduct a physical brood-nest inspection of <strong className="text-[var(--text-primary)]">H-104</strong> within
                  the next monitoring window (24–48 hours). Look for swarm cells on frame bottoms, queen
                  presence, brood pattern, and entry-point clustering.
                </p>
              </div>

              {/* CONFIDENCE / DATA LIMITATION */}
              <div className="pt-2 border-t border-amber-500/20">
                <p className="font-semibold text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Confidence / Data Limitation</p>
                <p className="text-[var(--text-secondary)] italic leading-relaxed">
                  Insufficient data for a reliable confidence estimate. This observation is based on acoustic
                  sensor correlation only. No disease is diagnosed or implied. Do not intervene without a
                  physical inspection.
                </p>
              </div>

              {/* Link */}
              <Link
                to="/smart-hives/H-104"
                className="flex items-center gap-1 text-[var(--accent)] font-semibold hover:underline pt-1 w-fit"
              >
                Open H-104 Telemetry <ExternalLink size={11} className="shrink-0" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIObservation;
