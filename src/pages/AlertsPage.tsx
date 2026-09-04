import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, Check, MoreVertical, Filter } from 'lucide-react';
// import { alerts } from '@/data';

// Fallback mock data with the specific examples requested
const MOCK_ALERTS = [
  { 
    id: '1', 
    type: 'critical', 
    title: 'Hive H-103 temperature exceeding safe range', 
    description: 'Internal temperature reached 41°C. Immediate inspection required to prevent colony loss.', 
    timestamp: '10 mins ago', 
    related: 'Hive H-103', 
    status: 'New' 
  },
  { 
    id: '2', 
    type: 'warning', 
    title: 'Colony activity decrease detected in H-104', 
    description: 'Foraging activity down by 30% compared to previous week averages.', 
    timestamp: '2 hours ago', 
    related: 'Hive H-104', 
    status: 'New' 
  },
  { 
    id: '3', 
    type: 'info', 
    title: 'Weather conditions favorable for inspection', 
    description: 'Clear skies and 24°C predicted for the next 4 hours. Optimal time for routine checks.', 
    timestamp: '5 hours ago', 
    related: 'North Apiary', 
    status: 'New' 
  },
  { 
    id: '4', 
    type: 'warning', 
    title: 'Hive H-105 weight loss detected - possible swarming', 
    description: 'Sudden weight drop of 2kg detected in the last 24 hours. Check for swarm cells.', 
    timestamp: '1 day ago', 
    related: 'Hive H-105', 
    status: 'Acknowledged' 
  },
  { 
    id: '5', 
    type: 'info', 
    title: 'Monthly report ready for review', 
    description: 'The productivity and health report for last month has been generated and is ready for download.', 
    timestamp: '2 days ago', 
    related: 'System', 
    status: 'Resolved' 
  },
];

type FilterType = 'All' | 'Critical' | 'Warnings' | 'Info';

const AlertsPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const getFilteredAlerts = () => {
    if (activeFilter === 'All') return alerts;
    if (activeFilter === 'Critical') return alerts.filter(a => a.type === 'critical');
    if (activeFilter === 'Warnings') return alerts.filter(a => a.type === 'warning');
    if (activeFilter === 'Info') return alerts.filter(a => a.type === 'info');
    return alerts;
  };

  const filteredAlerts = getFilteredAlerts();

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'warning': return <AlertCircle className="w-6 h-6 text-amber-500" />;
      case 'info': return <Info className="w-6 h-6 text-blue-500" />;
      default: return <AlertCircle className="w-6 h-6 text-[var(--text-secondary)]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--accent)] text-white">New</span>;
      case 'Acknowledged':
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">Acknowledged</span>;
      case 'Resolved':
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-500 border border-green-500/20">Resolved</span>;
      default:
        return null;
    }
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'Acknowledged' } : alert
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[var(--text-primary)]">Alerts</h1>
          <p className="text-[var(--text-secondary)] mt-1">Monitor system notifications and critical events.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        <Filter className="w-4 h-4 text-[var(--text-secondary)] mr-2" />
        {(['All', 'Critical', 'Warnings', 'Info'] as FilterType[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-t-md font-medium text-sm transition-colors whitespace-nowrap ${
              activeFilter === filter
                ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-12 text-center">
            <CheckCircle className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--text-primary)]">No alerts found</h3>
            <p className="text-[var(--text-secondary)] mt-1">You're all caught up! There are no {activeFilter.toLowerCase()} alerts right now.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`bg-[var(--surface)] border ${alert.status === 'New' ? 'border-[var(--accent)]/30' : 'border-[var(--border)]'} rounded-xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row gap-5 items-start`}
            >
              <div className="mt-1 flex-shrink-0 bg-[var(--background)] p-3 rounded-full border border-[var(--border)]">
                {getIcon(alert.type)}
              </div>
              
              <div className="flex-grow space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-medium text-[var(--text-primary)]">{alert.title}</h3>
                  {getStatusBadge(alert.status)}
                </div>
                
                <p className="text-[var(--text-secondary)] max-w-3xl">
                  {alert.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] pt-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {alert.timestamp}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div>
                  <div className="font-medium text-[var(--text-secondary)]">
                    Related: {alert.related}
                  </div>
                </div>
              </div>

              <div className="flex w-full md:w-auto md:flex-col justify-end gap-2 mt-4 md:mt-0">
                {alert.status === 'New' && (
                  <button 
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-[var(--accent)] hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Acknowledge
                  </button>
                )}
                <button className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 border border-[var(--border)] hover:bg-[var(--background)] text-[var(--text-primary)] rounded-lg text-sm font-medium transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
