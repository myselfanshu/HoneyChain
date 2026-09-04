import React from 'react';
import { Route, ShieldCheck, Sparkles, Link } from 'lucide-react';

const pillars = [
  {
    title: 'TRACE',
    description: 'Every action is recorded',
    icon: Route,
  },
  {
    title: 'VERIFY',
    description: 'Every batch is verified',
    icon: ShieldCheck,
  },
  {
    title: 'PREDICT',
    description: 'AI insights for healthier hives',
    icon: Sparkles,
  },
  {
    title: 'CONNECT',
    description: 'From hive to happy homes',
    icon: Link,
  },
];

const ValuePillars: React.FC = () => {
  return (
    <div className="w-full py-16 px-6 border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <div key={index} className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-colors group">
              <div className="w-12 h-12 rounded-full bg-[var(--background)] flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-sans font-bold tracking-widest text-[var(--text-primary)] text-sm mb-2">{pillar.title}</h3>
                <p className="font-sans text-[var(--text-secondary)] text-sm">{pillar.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ValuePillars;
