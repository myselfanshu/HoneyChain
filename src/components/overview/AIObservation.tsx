import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AIObservation: React.FC = () => {
  return (
    <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-[var(--danger)]"></div>
      <div className="flex items-center gap-2 mb-4 text-[var(--danger)]">
        <AlertTriangle size={20} />
        <h3 className="text-xl font-serif text-[var(--text-primary)]">AI Observation</h3>
      </div>
      
      <p className="font-sans text-[var(--text-secondary)] mb-6 leading-relaxed">
        Hive <strong className="text-[var(--text-primary)]">H-104</strong> shows an unusual drop in acoustic activity.
      </p>

      <div className="bg-[var(--background)] rounded-lg p-4 mb-6 border border-[var(--border)]">
        <h4 className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-sans mb-3 font-semibold">Correlated Data</h4>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm font-sans">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Temp:</span>
            <span className="text-[var(--text-primary)]">32.8°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Humidity:</span>
            <span className="text-[var(--text-primary)]">58%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Weight:</span>
            <span className="text-[var(--text-primary)]">42.1 kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Activity:</span>
            <span className="text-[var(--text-primary)]">High</span>
          </div>
          <div className="flex justify-between col-span-2">
            <span className="text-[var(--danger)]">AI Risk:</span>
            <span className="text-[var(--danger)]">Low</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <p className="font-sans text-sm text-[var(--text-secondary)] mb-4">
          <strong className="text-[var(--text-primary)]">Recommended Action:</strong> Inspect within 24 hours.
        </p>
        <button className="w-full py-2 px-4 rounded-md border border-[var(--warning)] text-[var(--warning)] hover:bg-[var(--warning)] hover:text-white transition-colors font-sans text-sm font-medium">
          View Recommendation
        </button>
      </div>
    </div>
  );
};

export default AIObservation;
