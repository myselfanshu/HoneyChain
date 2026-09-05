import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, Check, Filter } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

type FilterType = 'All' | 'Critical' | 'Warnings' | 'Info';

const AlertsPage = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const alertsData = [
    { 
      id: '1', 
      type: 'critical', 
      title: t.alerts.alert1Title, 
      description: t.alerts.alert1Desc, 
      timestamp: t.alerts.time10m, 
      related: `${t.nav.hives} H-103`, 
      status: 'New' 
    },
    { 
      id: '2', 
      type: 'warning', 
      title: t.alerts.alert2Title, 
      description: t.alerts.alert2Desc, 
      timestamp: t.alerts.time2h, 
      related: `${t.nav.hives} H-104`, 
      status: 'New' 
    },
    { 
      id: '3', 
      type: 'info', 
      title: t.alerts.alert3Title, 
      description: t.alerts.alert3Desc, 
      timestamp: t.alerts.time5h, 
      related: t.alerts.northApiary, 
      status: 'New' 
    },
    { 
      id: '4', 
      type: 'warning', 
      title: t.alerts.alert4Title, 
      description: t.alerts.alert4Desc, 
      timestamp: t.alerts.time1d, 
      related: `${t.nav.hives} H-105`, 
      status: 'Acknowledged' 
    },
    { 
      id: '5', 
      type: 'info', 
      title: t.alerts.alert5Title, 
      description: t.alerts.alert5Desc, 
      timestamp: t.alerts.time2d, 
      related: t.alerts.system, 
      status: 'Resolved' 
    },
  ];

  const [alerts, setAlerts] = useState(alertsData);

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
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--accent)] text-white">{t.common.new}</span>;
      case 'Acknowledged':
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">{t.common.acknowledged}</span>;
      case 'Resolved':
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-500 border border-green-500/20">{t.common.resolved}</span>;
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
    <div className="space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[var(--text-primary)] font-bold">{t.alerts.title}</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">{t.alerts.subtitle}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-4 overflow-x-auto">
        {[
          { key: 'All', label: t.alerts.filterAll, count: alerts.length },
          { key: 'Critical', label: t.alerts.filterCritical, count: alerts.filter(a => a.type === 'critical').length },
          { key: 'Warnings', label: t.alerts.filterWarnings, count: alerts.filter(a => a.type === 'warning').length },
          { key: 'Info', label: t.alerts.filterInfo, count: alerts.filter(a => a.type === 'info').length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key as FilterType)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeFilter === key
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] border border-[var(--border)]'
            }`}
          >
            <span>{label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              activeFilter === key ? 'bg-white/20 text-white' : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)]'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--accent)] transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)] shrink-0">
                  {getIcon(alert.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-serif font-bold text-base text-[var(--text-primary)]">{alert.title}</h3>
                    {getStatusBadge(alert.status)}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">{alert.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                    <span className="font-mono text-[var(--accent)] font-semibold">{alert.related}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {alert.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {alert.status === 'New' && (
                  <button 
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] hover:border-[var(--accent)] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check size={13} className="text-[var(--accent)]" />
                    <span>{t.alerts.acknowledge}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3 opacity-60" />
            <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">{t.alerts.emptyTitle}</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">{t.alerts.emptyDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
