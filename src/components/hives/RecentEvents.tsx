import React from 'react';

const events = [
  { id: 1, time: '08:42 AM', desc: 'Weight recorded: 42.1 kg' },
  { id: 2, time: '08:31 AM', desc: 'Temperature normal: 32.8 °C' },
  { id: 3, time: '08:16 AM', desc: 'High activity' },
  { id: 4, time: '07:52 AM', desc: 'Humidity stable: 58%' },
];

export const RecentEvents: React.FC = () => {
  return (
    <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-6 h-full flex flex-col">
      <h3 className="font-serif text-lg text-[var(--text-primary)] font-bold mb-6">Recent Events</h3>
      <div className="flex-1 space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex items-start">
            <div className="min-w-[70px] text-xs text-[var(--text-secondary)] pt-1">{event.time}</div>
            <div className="flex-1 ml-4 relative pb-4 border-l-2 border-[var(--border-color)] pl-4 last:border-0 last:pb-0">
              {/* Timeline dot */}
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-amber-500"></div>
              <p className="text-sm text-[var(--text-primary)]">{event.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 text-sm font-medium text-left">
        View All Events →
      </button>
    </div>
  );
};
