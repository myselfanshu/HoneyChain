import React from 'react';
import { useTranslation } from '@/contexts/LanguageContext';

const RecentActivity: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)]">
      <h3 className="text-xl font-serif text-[var(--text-primary)] mb-4">{t.overview.recentActivity}</h3>
      <ul className="space-y-4">
        <li className="flex gap-4">
          <div className="w-2 h-2 mt-2 rounded-full bg-[var(--accent)] flex-shrink-0"></div>
          <div>
            <p className="font-sans text-sm text-[var(--text-primary)]">{t.overview.activity1}</p>
            <p className="font-sans text-xs text-[var(--text-secondary)]">{t.overview.activity1Time}</p>
          </div>
        </li>
        <li className="flex gap-4">
          <div className="w-2 h-2 mt-2 rounded-full bg-[var(--warning)] flex-shrink-0"></div>
          <div>
            <p className="font-sans text-sm text-[var(--text-primary)]">{t.overview.activity2}</p>
            <p className="font-sans text-xs text-[var(--text-secondary)]">{t.overview.activity2Time}</p>
          </div>
        </li>
        <li className="flex gap-4">
          <div className="w-2 h-2 mt-2 rounded-full bg-[var(--success)] flex-shrink-0"></div>
          <div>
            <p className="font-sans text-sm text-[var(--text-primary)]">{t.overview.activity3}</p>
            <p className="font-sans text-xs text-[var(--text-secondary)]">{t.overview.activity3Time}</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default RecentActivity;
