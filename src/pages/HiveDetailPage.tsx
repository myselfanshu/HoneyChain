import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, Thermometer, Droplets, Weight, Activity, TrendingUp, Shield, ChevronRight, Check } from 'lucide-react';
import { HiveVisualization } from '@/components/hives/HiveVisualization';
import { ActivityTimeline } from '@/components/hives/ActivityTimeline';
import { RecentEvents } from '@/components/hives/RecentEvents';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { hives } from '@/data/hives';

export const HiveDetailPage: React.FC = () => {
  const { hiveId = 'H-104' } = useParams<{ hiveId: string }>();
  const [copied, setCopied] = useState(false);

  // Find hive or fallback to H-104
  const hive = hives.find(h => h.id.toLowerCase() === hiveId.toLowerCase()) || hives.find(h => h.id === 'H-104') || hives[0]!;

  const latestSensor = hive.sensors && hive.sensors.length > 0
    ? hive.sensors[hive.sensors.length - 1]
    : undefined;

  const temp = latestSensor ? latestSensor.temperature.toFixed(1) : '32.8';
  const humidity = latestSensor ? Math.round(latestSensor.humidity) : 58;
  const weight = latestSensor ? latestSensor.weight.toFixed(1) : '42.1';
  const colonyActivity = latestSensor && latestSensor.colonyActivity > 75 ? 'High' : 'Normal';
  const weightChange = hive.weightChange > 0 ? `+ ${hive.weightChange}%` : `${hive.weightChange}%`;
  const riskLevel = hive.aiRiskLevel || 'Low';

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-[var(--text-secondary)]">
        <Link to="/smart-hives" className="hover:text-[var(--accent)] transition-colors">Smart Hives</Link>
        <ChevronRight size={16} className="mx-2 text-[var(--border)]" />
        <span className="text-[var(--text-primary)] font-medium">{hive.id}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">Hive {hive.id}</h1>
            <StatusBadge status={hive.status.toLowerCase() as any} />
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            {hive.location} • Last updated: 03 Sep 2026, 08:42 AM
          </p>
        </div>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors text-sm"
          title="Share hive link"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
          <span>{copied ? 'Link Copied' : 'Share Telemetry'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Hive Illustration */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[420px] shadow-sm relative overflow-hidden">
          <div className="absolute top-4 left-4 text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">
            Field Unit Architecture
          </div>
          <HiveVisualization />
          <div className="mt-4 text-center">
            <p className="font-serif text-sm font-semibold text-[var(--text-primary)]">{hive.name}</p>
            <p className="text-xs text-[var(--text-secondary)]">Langstroth 10-Frame System with Acoustic Sensors</p>
          </div>
        </div>

        {/* Right Side: 6 Metrics Grid (matches reference exactly) */}
        <div className="grid grid-cols-2 gap-4">
          <MetricCard 
            icon={<Thermometer size={20} />} 
            label="Temperature" 
            value={`${temp} °C`} 
          />
          <MetricCard 
            icon={<Droplets size={20} />} 
            label="Humidity" 
            value={`${humidity} %`} 
          />
          <MetricCard 
            icon={<Weight size={20} />} 
            label="Hive Weight" 
            value={`${weight} kg`} 
          />
          <MetricCard 
            icon={<Activity size={20} />} 
            label="Colony Activity" 
            value={colonyActivity} 
          />
          <MetricCard 
            icon={<TrendingUp size={20} />} 
            label="Weight Change (7d)" 
            value={weightChange} 
            valueColor="text-green-600 dark:text-green-400" 
          />
          <MetricCard 
            icon={<Shield size={20} />} 
            label="AI Risk" 
            value={riskLevel} 
            valueColor={riskLevel === 'Low' ? 'text-green-600 dark:text-green-400' : 'text-amber-500'} 
          />
        </div>
      </div>

      {/* Bottom Section: Activity Timeline & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActivityTimeline />
        <RecentEvents />
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  valueColor?: string; 
}> = ({ icon, label, value, valueColor }) => (
  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-[var(--accent)] transition-colors">
    <div className="flex items-center text-[var(--text-secondary)] mb-3">
      <div className="p-2.5 bg-[var(--surface-secondary)] text-[var(--accent)] rounded-xl mr-3 border border-[var(--border)]">
        {icon}
      </div>
      <span className="text-xs sm:text-sm font-medium">{label}</span>
    </div>
    <div className={`text-2xl sm:text-3xl font-serif font-bold ${valueColor || 'text-[var(--text-primary)]'}`}>
      {value}
    </div>
  </div>
);

export default HiveDetailPage;
