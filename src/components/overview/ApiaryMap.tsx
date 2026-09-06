import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Plus } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Hive } from '@/api/hives';

interface ApiaryMapProps {
  hives?: Hive[];
}

export const ApiaryMap: React.FC<ApiaryMapProps> = ({ hives = [] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredHive, setHoveredHive] = useState<Hive | null>(null);

  // Default coordinate slots for up to 8 hives on the topo grid
  const slotCoords = [
    { x: 80, y: 110 },
    { x: 155, y: 80 },
    { x: 230, y: 130 },
    { x: 175, y: 195 },
    { x: 295, y: 100 },
    { x: 320, y: 180 },
    { x: 95, y: 220 },
    { x: 220, y: 240 },
  ];

  const hiveNodes = hives.map((hive, idx) => {
    const slot = slotCoords[idx % slotCoords.length] || { x: 100 + (idx * 30) % 200, y: 100 + (idx * 25) % 120 };
    const latestTele = hive.telemetry?.[0];
    return {
      hive,
      id: hive.id,
      name: hive.name,
      x: slot.x,
      y: slot.y,
      status: hive.status || 'HEALTHY',
      temp: latestTele?.temperatureC != null ? `${Number(latestTele.temperatureC).toFixed(1)}°C` : '—',
      weight: latestTele?.weightKg != null ? `${Number(latestTele.weightKg).toFixed(1)} kg` : '—',
    };
  });

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'HEALTHY') return 'var(--success)';
    if (s === 'WATCH') return 'var(--warning)';
    if (s === 'INSPECT') return 'var(--danger)';
    return 'var(--accent)';
  };

  const getLocalizedStatus = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'HEALTHY') return t.common.healthy;
    if (s === 'WATCH') return t.common.watch;
    if (s === 'INSPECT') return t.common.inspect;
    return status;
  };

  return (
    <div className="bg-[var(--surface)] p-6 sm:p-7 rounded-3xl border border-[var(--border)] h-full flex flex-col justify-between shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-[var(--accent)]" />
          <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">{t.overview.spatialMap}</h3>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-secondary)]">
          {hives.length} {hives.length === 1 ? 'Hive Node' : 'Hive Nodes'}
        </span>
      </div>

      <div className="flex-1 rounded-2xl bg-[var(--surface-secondary)]/60 overflow-hidden relative min-h-[290px] border border-[var(--border)] flex items-center justify-center p-2">
        <svg viewBox="0 0 400 280" className="w-full h-full object-cover">
          {/* Topographic field contours */}
          <path d="M 30,50 Q 150,20 280,60 T 380,40" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3,3" />
          <path d="M 20,120 Q 120,90 250,140 T 390,110" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" />
          <path d="M 40,200 Q 170,170 300,220 T 370,190" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3,3" />
          <path d="M 10,260 Q 140,240 270,270 T 390,250" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="5,5" />

          {/* Flora / Apiary boundary */}
          <rect x="25" y="35" width="350" height="215" rx="16" fill="none" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="6,4" />
          <text x="35" y="52" fill="var(--text-secondary)" fontSize="9" fontFamily="monospace" opacity="0.7">APIARY SECTOR — REGISTERED COLONIES</text>

          {/* Hive Nodes */}
          {hiveNodes.map((node) => {
            const isHovered = hoveredHive?.id === node.id;
            const col = getStatusColor(node.status);
            return (
              <g
                key={node.id}
                className="cursor-pointer transition-all duration-200"
                onClick={() => navigate(`/smart-hives/${encodeURIComponent(node.id)}`)}
                onMouseEnter={() => setHoveredHive(node.hive)}
                onMouseLeave={() => setHoveredHive(null)}
              >
                {/* Pulse ring for watch/inspect */}
                {(node.status === 'WATCH' || node.status === 'INSPECT') && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? 18 : 13}
                    fill={col}
                    fillOpacity="0.2"
                    className="animate-pulse"
                  />
                )}
                {/* Outer ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 13 : 9}
                  fill="var(--surface)"
                  stroke={col}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />
                {/* Center dot */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 5 : 3.5}
                  fill={col}
                />
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y - 12}
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="pointer-events-none select-none"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Empty state overlay if no hives */}
        {hives.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[var(--surface-secondary)]/80 backdrop-blur-xs space-y-2">
            <MapPin size={24} className="text-[var(--text-secondary)] opacity-60" />
            <p className="text-xs font-semibold text-[var(--text-primary)]">No Registered Hive Nodes</p>
            <p className="text-[11px] text-[var(--text-secondary)] max-w-xs">
              Add your first Smart Hive to visualize spatial placement across your apiary grid.
            </p>
          </div>
        )}

        {/* Hover info tooltip card */}
        {hoveredHive && (
          <div className="absolute bottom-3 left-3 right-3 bg-[var(--surface)]/95 backdrop-blur-md p-3 rounded-xl border border-[var(--border)] shadow-lg flex items-center justify-between text-xs z-20 animate-fade-in pointer-events-none">
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: getStatusColor(hoveredHive.status) }}
              />
              <div>
                <span className="font-bold text-[var(--text-primary)] font-serif">{hoveredHive.id} • {hoveredHive.name}</span>
                <span className="text-[var(--text-secondary)] block text-[10px]">
                  {hoveredHive.location} • Status: {getLocalizedStatus(hoveredHive.status)}
                </span>
              </div>
            </div>
            <span className="text-[var(--accent)] font-medium text-[11px] flex items-center gap-1">
              View Hive <ArrowRight size={11} />
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
            <span className="text-[var(--text-secondary)]">{t.common.healthy}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--warning)' }} />
            <span className="text-[var(--text-secondary)]">{t.common.watch}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--danger)' }} />
            <span className="text-[var(--text-secondary)]">{t.common.inspect}</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/smart-hives')}
          className="text-[var(--accent)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{t.nav.viewApiary}</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default ApiaryMap;
