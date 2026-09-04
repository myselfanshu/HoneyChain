import React from 'react';

const RecentActivity: React.FC = () => {
  return (
    <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)]">
      <h3 className="text-xl font-serif text-[var(--text-primary)] mb-4">Recent Activity</h3>
      <ul className="space-y-4">
        <li className="flex gap-4">
          <div className="w-2 h-2 mt-2 rounded-full bg-[var(--accent)] flex-shrink-0"></div>
          <div>
            <p className="font-sans text-sm text-[var(--text-primary)]">Completed inspection for Hive H-101</p>
            <p className="font-sans text-xs text-[var(--text-secondary)]">2 hours ago</p>
          </div>
        </li>
        <li className="flex gap-4">
          <div className="w-2 h-2 mt-2 rounded-full bg-[var(--warning)] flex-shrink-0"></div>
          <div>
            <p className="font-sans text-sm text-[var(--text-primary)]">AI flagged unusual acoustic pattern in H-104</p>
            <p className="font-sans text-xs text-[var(--text-secondary)]">5 hours ago</p>
          </div>
        </li>
        <li className="flex gap-4">
          <div className="w-2 h-2 mt-2 rounded-full bg-[var(--success)] flex-shrink-0"></div>
          <div>
            <p className="font-sans text-sm text-[var(--text-primary)]">Honey yield estimation updated</p>
            <p className="font-sans text-xs text-[var(--text-secondary)]">Yesterday</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default RecentActivity;
