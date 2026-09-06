import React from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Alert } from '@/api/alerts';
import { FieldReport } from '@/api/reports';
import { Link } from 'react-router-dom';

interface RecentActivityProps {
  alerts?: Alert[];
  reports?: FieldReport[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ alerts = [], reports = [] }) => {
  const { t } = useTranslation();

  const activities = [
    ...alerts.slice(0, 3).map((a) => ({
      id: a.id,
      title: a.title,
      time: new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      type: a.severity === 'CRITICAL' ? 'danger' : 'warning',
      link: '/alerts',
    })),
    ...reports.slice(0, 3).map((r) => ({
      id: r.id,
      title: r.title,
      time: new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      type: 'success',
      link: '/reports',
    })),
  ];

  return (
    <div className="bg-[var(--surface)] p-6 sm:p-7 rounded-3xl border border-[var(--border)] h-full flex flex-col justify-between shadow-xs">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">{t.overview.recentActivity}</h3>
          <Link to="/alerts" className="text-xs text-[var(--accent)] font-semibold hover:underline">
            View Alerts
          </Link>
        </div>

        {activities.length > 0 ? (
          <ul className="space-y-3.5">
            {activities.slice(0, 4).map((act) => {
              const dotColor =
                act.type === 'danger'
                  ? 'bg-red-500'
                  : act.type === 'warning'
                  ? 'bg-[var(--warning)]'
                  : 'bg-emerald-500';
              return (
                <li key={act.id} className="flex gap-3 items-start">
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${dotColor} shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-xs sm:text-sm text-[var(--text-primary)] font-medium truncate">
                      {act.title}
                    </p>
                    <p className="font-sans text-[10px] text-[var(--text-secondary)]">{act.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-8 text-center space-y-1 text-xs text-[var(--text-secondary)]">
            <p className="font-semibold text-[var(--text-primary)]">No recent events recorded</p>
            <p>New inspections, batch harvests, and alerts will appear here in chronological order.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
