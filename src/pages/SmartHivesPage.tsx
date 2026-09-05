import React, { useState } from 'react';
import { HiveCard } from '@/components/hives/HiveCard';
import { hives } from '@/data/hives';
import { FilterPills } from '@/components/ui/FilterPills';
import { Box } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

export const SmartHivesPage: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { key: 'all', label: t.common.all },
    { key: 'healthy', label: t.common.healthy },
    { key: 'watch', label: t.common.watch },
    { key: 'inspect', label: t.common.inspect },
  ];

  const filteredHives = hives.filter(hive => {
    if (filter === 'all') return true;
    return hive.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)]">
              <Box size={22} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">{t.smartHives.title}</h1>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-0.5">
                {t.smartHives.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === opt.key
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHives.map(hive => (
          <HiveCard key={hive.id} hive={hive} />
        ))}
      </div>
    </div>
  );
};

export default SmartHivesPage;
