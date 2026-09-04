import React from 'react';
import { User, Factory, Package, Truck, Store, CheckCircle } from 'lucide-react';

const actors = [
  { role: 'Beekeeper', name: 'Ravi Kumar', station: 'Royal Crest Apiaries (UP)', icon: User },
  { role: 'Processor', name: 'HoneyPure Pvt. Ltd.', station: 'Haryana Facility', icon: Factory },
  { role: 'Packer', name: 'PurePack Industries', station: 'Delhi Packaging Hub', icon: Package },
  { role: 'Distributor', name: 'GreenHive Supplies', station: 'Maharashtra Logistics', icon: Truck },
  { role: 'Retailer', name: "Nature's Basket", station: 'Pan-India Distribution', icon: Store },
];

export const ActorsInvolved: React.FC = () => {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="pb-4 mb-6 border-b border-[var(--border)]">
        <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">Actors Involved</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Verified custodian signatures across chain.</p>
      </div>

      <div className="space-y-4">
        {actors.map((actor, index) => {
          const Icon = actor.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-[var(--surface-secondary)]/40 border border-[var(--border)] hover:border-[var(--accent)] transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center text-[var(--accent)] border border-[var(--border)] shadow-xs">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">{actor.role}</div>
                  <div className="font-bold text-[var(--text-primary)] text-sm">{actor.name}</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">{actor.station}</div>
                </div>
              </div>
              <div className="text-green-600 dark:text-green-400" title="Key Authenticated">
                <CheckCircle size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActorsInvolved;
