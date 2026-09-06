import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { alertsApi, Alert } from '@/api/alerts';

type FilterType = 'All' | 'Critical' | 'Warnings' | 'Info';

export const AlertsPage = () => {
  const { t } = useTranslation();
  const { token } = useAuth();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await alertsApi.getAlerts(token);
      setAlerts(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load alerts.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await alertsApi.markAsRead(id, token);
      setAlerts(alerts.map((a) => (a.id === id ? { ...a, readAt: new Date().toISOString() } : a)));
    } catch (err: any) {
      console.error(err);
    }
  };

  const getFilteredAlerts = () => {
    if (activeFilter === 'All') return alerts;
    if (activeFilter === 'Critical') return alerts.filter((a) => a.severity === 'CRITICAL');
    if (activeFilter === 'Warnings') return alerts.filter((a) => a.severity === 'WARNING');
    if (activeFilter === 'Info') return alerts.filter((a) => a.severity === 'INFO');
    return alerts;
  };

  const filteredAlerts = getFilteredAlerts();

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />;
      case 'WARNING':
        return <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'INFO':
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
      default:
        return <AlertCircle className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">{t.alerts.title}</h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-1">{t.alerts.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'Critical', 'Warnings', 'Info'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]'
              }`}
            >
              {filter}
            </button>
          ))}
          <button
            onClick={fetchAlerts}
            disabled={loading}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Alerts"
            aria-label="Refresh Alerts"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading && alerts.length === 0 && (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[var(--text-secondary)]">Checking colony telemetry alerts…</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400 flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && alerts.length === 0 && (
        <div className="py-16 px-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-center max-w-lg mx-auto space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center mx-auto">
            <CheckCircle size={28} />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)]">No Active Alerts</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            All your smart hives and apiaries are reporting normal thermal, acoustic, and colony activity levels.
          </p>
        </div>
      )}

      {!loading && filteredAlerts.length > 0 && (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                !alert.readAt
                  ? 'bg-[var(--surface)] border-[var(--accent)]/40 shadow-xs'
                  : 'bg-[var(--surface)]/60 border-[var(--border)] opacity-85'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {getIcon(alert.severity)}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-serif text-base font-bold text-[var(--text-primary)]">{alert.title}</h4>
                      {alert.hiveId && (
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)]">
                          {alert.hiveId}
                        </span>
                      )}
                      {!alert.readAt && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{alert.message}</p>
                    <p className="text-[11px] text-[var(--text-secondary)]/60 pt-1 font-mono">
                      {new Date(alert.createdAt).toLocaleString('en-GB')} • Source: {alert.source}
                    </p>
                  </div>
                </div>

                {!alert.readAt && (
                  <button
                    onClick={() => handleMarkAsRead(alert.id)}
                    className="shrink-0 px-3 py-1.5 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--surface-secondary)] rounded-lg transition-colors border border-[var(--border)] cursor-pointer"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
