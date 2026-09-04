import React, { useState } from 'react';
import { HiveCard } from '@/components/hives/HiveCard';
import { hives } from '@/data/hives';
import { FilterPills } from '@/components/ui/FilterPills';
import { Plus, Box } from 'lucide-react';

export const SmartHivesPage: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const filterOptions = ['All', 'Healthy', 'Watch', 'Inspect'];

  const filteredHives = hives.filter(hive => {
    if (filter === 'All') return true;
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
              <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">Smart Hives</h1>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-0.5">
                Digital field journal & real-time telemetry across {hives.length} active colonies.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <FilterPills 
            options={filterOptions} 
            selected={filter} 
            onChange={setFilter} 
          />
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
