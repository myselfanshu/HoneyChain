import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Thermometer, Droplets, Weight, ArrowRight, Edit2, Trash2 } from 'lucide-react';
import { Hive } from '@/api/hives';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useTranslation } from '@/contexts/LanguageContext';

interface HiveCardProps {
  hive: Hive;
  onEdit?: (hive: Hive) => void;
  onDelete?: (hive: Hive) => void;
}

export const HiveCard: React.FC<HiveCardProps> = ({ hive, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const latestTelemetry = hive.telemetry && hive.telemetry.length > 0 ? hive.telemetry[0] : null;

  const temp = latestTelemetry?.temperatureC != null ? `${Number(latestTelemetry.temperatureC).toFixed(1)}°C` : '—';
  const humidity = latestTelemetry?.humidityPct != null ? `${Math.round(Number(latestTelemetry.humidityPct))}%` : '—';
  const weight = latestTelemetry?.weightKg != null ? `${Number(latestTelemetry.weightKg).toFixed(1)} kg` : '—';
  const location = hive.location || hive.apiary?.name || 'Local Apiary';

  const statusType = (hive.status?.toLowerCase() || 'healthy') as 'healthy' | 'watch' | 'inspect';

  const handleCardClick = () => {
    navigate(`/smart-hives/${encodeURIComponent(hive.id)}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:border-[var(--accent)] flex flex-col justify-between h-full group cursor-pointer"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0 flex-1 pr-2">
            <span className="font-mono text-xs font-semibold text-[var(--accent)] tracking-wider block mb-1 truncate">
              {hive.id}
            </span>
            <h3 className="font-serif text-xl text-[var(--text-primary)] font-bold group-hover:text-[var(--accent)] transition-colors truncate">
              {hive.name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 truncate">{location}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={statusType} />
            {onEdit && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(hive); }}
                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--surface-secondary)] rounded-lg transition-colors cursor-pointer"
                title="Edit Hive"
                aria-label="Edit Hive"
              >
                <Edit2 size={14} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(hive); }}
                className="p-1.5 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                title="Delete Hive"
                aria-label="Delete Hive"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 my-4 p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)]">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center text-[var(--text-secondary)] mb-1 gap-1">
              <Thermometer size={13} className="text-[var(--accent)]" />
              <span className="text-[11px]">{t.smartHives.temp}</span>
            </div>
            <span className="text-[var(--text-primary)] font-semibold text-sm">{temp}</span>
          </div>
          
          <div className="flex flex-col items-center text-center border-x border-[var(--border)]">
            <div className="flex items-center text-[var(--text-secondary)] mb-1 gap-1">
              <Droplets size={13} className="text-blue-500" />
              <span className="text-[11px]">{t.smartHives.humidity}</span>
            </div>
            <span className="text-[var(--text-primary)] font-semibold text-sm">{humidity}</span>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center text-[var(--text-secondary)] mb-1 gap-1">
              <Weight size={13} className="text-[var(--accent)]" />
              <span className="text-[11px]">{t.smartHives.weight}</span>
            </div>
            <span className="text-[var(--text-primary)] font-semibold text-sm">{weight}</span>
          </div>
        </div>
      </div>

      <Link
        to={`/smart-hives/${encodeURIComponent(hive.id)}`}
        className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
      >
        <span>{latestTelemetry ? t.smartHives.telemetryActive : 'No telemetry yet'}</span>
        <span className="flex items-center gap-1 font-medium text-[var(--accent)] group-hover:translate-x-1 transition-transform">
          {t.smartHives.telemetryEvents} <ArrowRight size={12} />
        </span>
      </Link>
    </div>
  );
};

export default HiveCard;
