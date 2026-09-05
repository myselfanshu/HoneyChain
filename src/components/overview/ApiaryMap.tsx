import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

interface HiveNode {
  id: string;
  x: number;
  y: number;
  status: 'Healthy' | 'Watch' | 'Inspect';
  temp: number;
  weight: number;
}

const hivesOnMap: HiveNode[] = [
  { id: 'H-101', x: 80, y: 110, status: 'Healthy', temp: 34.5, weight: 42.1 },
  { id: 'H-102', x: 155, y: 80, status: 'Healthy', temp: 34.2, weight: 45.3 },
  { id: 'H-103', x: 230, y: 130, status: 'Watch', temp: 34.8, weight: 41.5 },
  { id: 'H-104', x: 175, y: 195, status: 'Inspect', temp: 32.8, weight: 42.1 },
  { id: 'H-105', x: 295, y: 100, status: 'Healthy', temp: 33.9, weight: 39.8 },
  { id: 'H-106', x: 320, y: 180, status: 'Healthy', temp: 34.1, weight: 44.0 },
  { id: 'H-107', x: 95, y: 220, status: 'Watch', temp: 35.0, weight: 37.6 },
];

export const ApiaryMap: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredHive, setHoveredHive] = useState<HiveNode | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'var(--success)';
      case 'Watch': return 'var(--warning)';
      case 'Inspect': return 'var(--danger)';
      default: return 'var(--accent)';
    }
  };

  const getLocalizedStatus = (status: string) => {
    switch (status) {
      case 'Healthy': return t.common.healthy;
      case 'Watch': return t.common.watch;
      case 'Inspect': return t.common.inspect;
      default: return status;
    }
  };

  return (
    <div className="bg-[var(--surface)] p-6 sm:p-7 rounded-3xl border border-[var(--border)] h-full flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-[var(--accent)]" />
          <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">{t.overview.spatialMap}</h3>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-secondary)]">{t.overview.sectorNodes}</span>
      </div>

      <div className="flex-1 rounded-2xl bg-[var(--surface-secondary)]/60 overflow-hidden relative min-h-[290px] border border-[var(--border)] flex items-center justify-center p-2">
        <svg viewBox="0 0 400 280" className="w-full h-full object-cover">
          {/* Topographic field contours */}
          <path d="M0,40 Q120,10 210,50 T400,20 L400,280 L0,280 Z" fill="var(--surface)" opacity="0.4" />
          <path d="M0,130 Q160,80 260,160 T400,100 L400,280 L0,280 Z" fill="var(--surface-secondary)" opacity="0.6" />
          
          {/* River / Floral Brook */}
          <path d="M-10,240 Q100,170 200,230 T420,190" fill="none" stroke="var(--border)" strokeWidth="8" opacity="0.5" />
          <path d="M-10,240 Q100,170 200,230 T420,190" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />

          {/* Interactive Hive Nodes */}
          {hivesOnMap.map((hive) => {
            const color = getStatusColor(hive.status);
            const isHovered = hoveredHive?.id === hive.id;

            return (
              <g 
                key={hive.id} 
                transform={`translate(${hive.x}, ${hive.y})`}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => navigate(`/smart-hives/${hive.id}`)}
                onMouseEnter={() => setHoveredHive(hive)}
                onMouseLeave={() => setHoveredHive(null)}
              >
                {/* Ping animation circle */}
                {isHovered && (
                  <circle cx="13" cy="25" r="18" fill={color} opacity="0.25" className="animate-ping" />
                )}
                
                {/* Hexagonal Base */}
                <polygon 
                  points="0,15 13,0 26,15 26,35 13,50 0,35" 
                  fill={color} 
                  opacity={isHovered ? 0.35 : 0.18} 
                  stroke={color} 
                  strokeWidth={isHovered ? 2.5 : 1.5} 
                />
                
                {/* Hive Core Node */}
                <circle cx="13" cy="25" r={isHovered ? 6 : 5} fill={color} />

                {/* Hive Label */}
                <rect x="-2" y="-14" width="30" height="13" rx="3" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />
                <text 
                  x="13" 
                  y="-5" 
                  fontSize="9" 
                  fontWeight="bold" 
                  textAnchor="middle" 
                  fill="var(--text-primary)" 
                  fontFamily="sans-serif"
                >
                  {hive.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredHive && (
          <div className="absolute top-3 right-3 bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)] shadow-lg text-xs space-y-0.5 pointer-events-none animate-fade-in">
            <div className="flex items-center gap-1.5 font-serif font-bold text-[var(--text-primary)]">
              <span>Hive {hoveredHive.id}</span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-sans font-bold ${
                hoveredHive.status === 'Healthy' ? 'text-green-600 bg-green-500/10' :
                hoveredHive.status === 'Watch' ? 'text-amber-500 bg-amber-500/10' : 'text-red-500 bg-red-500/10'
              }`}>
                {getLocalizedStatus(hoveredHive.status)}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">{t.smartHives.temp}: {hoveredHive.temp}°C • {hoveredHive.weight} kg</p>
            <p className="text-[10px] text-[var(--accent)] font-medium pt-0.5">{t.overview.clickTelemetry}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--success)]"></span> {t.common.healthy} (4)</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]"></span> {t.common.watch} (2)</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--danger)]"></span> {t.common.inspect} (1)</div>
        </div>
        <button 
          onClick={() => navigate('/smart-hives')}
          className="text-[var(--accent)] hover:underline flex items-center gap-1 font-medium hidden sm:flex"
        >
          <span>{t.overview.all24Hives}</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default ApiaryMap;
