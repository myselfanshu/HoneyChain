import React from 'react';
import { Link } from 'react-router-dom';
import { Thermometer, Droplets, Weight, ArrowRight } from 'lucide-react';
import { Hive } from '@/data/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useTranslation } from '@/contexts/LanguageContext';

interface HiveCardProps {
  hive: Hive | {
    id: string;
    name: string;
    status: 'Healthy' | 'Watch' | 'Inspect';
    sensors?: Array<{ temperature: number; humidity: number; weight: number }>;
    temp?: number;
    humidity?: number;
    weight?: number;
    location?: string;
  };
}

export const HiveCard: React.FC<HiveCardProps> = ({ hive }) => {
  const { t } = useTranslation();
  const latestSensor = 'sensors' in hive && hive.sensors && hive.sensors.length > 0 
    ? hive.sensors[hive.sensors.length - 1] 
    : undefined;

  const temp = latestSensor ? latestSensor.temperature.toFixed(1) : (hive as any).temp ?? '32.8';
  const humidity = latestSensor ? Math.round(latestSensor.humidity) : (hive as any).humidity ?? '58';
  const weight = latestSensor ? latestSensor.weight.toFixed(1) : (hive as any).weight ?? '42.1';
  const location = ('location' in hive && hive.location) || 'Northern Field';

  const statusType = hive.status.toLowerCase() as 'healthy' | 'watch' | 'inspect';

  return (
    <Link to={`/smart-hives/${hive.id}`} className="block group">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-[var(--accent)] flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="font-mono text-xs font-semibold text-[var(--accent)] tracking-wider block mb-1">
                {hive.id}
              </span>
              <h3 className="font-serif text-xl text-[var(--text-primary)] font-bold group-hover:text-[var(--accent)] transition-colors">
                {hive.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{location}</p>
            </div>
            <StatusBadge status={statusType} />
          </div>
          
          <div className="grid grid-cols-3 gap-3 my-4 p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)]">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center text-[var(--text-secondary)] mb-1 gap-1">
                <Thermometer size={13} className="text-[var(--accent)]" />
                <span className="text-[11px]">{t.smartHives.temp}</span>
              </div>
              <span className="text-[var(--text-primary)] font-semibold text-sm">{temp}°C</span>
            </div>
            
            <div className="flex flex-col items-center text-center border-x border-[var(--border)]">
              <div className="flex items-center text-[var(--text-secondary)] mb-1 gap-1">
                <Droplets size={13} className="text-blue-500" />
                <span className="text-[11px]">{t.smartHives.humidity}</span>
              </div>
              <span className="text-[var(--text-primary)] font-semibold text-sm">{humidity}%</span>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center text-[var(--text-secondary)] mb-1 gap-1">
                <Weight size={13} className="text-[var(--accent)]" />
                <span className="text-[11px]">{t.smartHives.weight}</span>
              </div>
              <span className="text-[var(--text-primary)] font-semibold text-sm">{weight} kg</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
          <span>{t.smartHives.telemetryActive}</span>
          <span className="flex items-center gap-1 font-medium text-[var(--accent)] group-hover:translate-x-1 transition-transform">
            {t.smartHives.telemetryEvents} <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
};
