import React from 'react';
import { Thermometer, Droplets, Weight, Activity, Shield } from 'lucide-react';

const LiveConditions: React.FC = () => {
  return (
    <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] h-full flex flex-col">
      <h3 className="text-xl font-serif text-[var(--text-primary)] mb-6">Live Conditions (Avg)</h3>
      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <Thermometer size={18} />
            <span className="font-sans">Temperature</span>
          </div>
          <span className="font-sans font-medium text-[var(--text-primary)]">32.8 °C</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <Droplets size={18} />
            <span className="font-sans">Humidity</span>
          </div>
          <span className="font-sans font-medium text-[var(--text-primary)]">58%</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <Weight size={18} />
            <span className="font-sans">Hive Weight</span>
          </div>
          <span className="font-sans font-medium text-[var(--text-primary)]">42.1 kg</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <Activity size={18} />
            <span className="font-sans">Colony Activity</span>
          </div>
          <span className="font-sans font-medium text-[var(--text-primary)]">High</span>
        </div>
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-3 text-[var(--danger)]">
            <Shield size={18} />
            <span className="font-sans">AI Risk</span>
          </div>
          <span className="font-sans font-medium text-[var(--danger)]">Low</span>
        </div>
      </div>
      <button className="mt-4 text-left font-sans text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
        View all conditions &rarr;
      </button>
    </div>
  );
};

export default LiveConditions;
