import React, { useState, useEffect, useCallback } from 'react';
import { Box, Plus, Search, AlertCircle, RefreshCw, X } from 'lucide-react';
import { HiveCard } from '@/components/hives/HiveCard';
import { hivesApi, Hive, CreateHiveDto } from '@/api/hives';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export const SmartHivesPage: React.FC = () => {
  const { t } = useTranslation();
  const { token, isGuest } = useAuth();

  const [hivesList, setHivesList] = useState<Hive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHive, setEditingHive] = useState<Hive | null>(null);
  const [deletingHive, setDeletingHive] = useState<Hive | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    location: string;
    apiaryName: string;
    status: 'HEALTHY' | 'WATCH' | 'INSPECT';
    queenAgeMonths: string;
    lastInspection: string;
  }>({
    id: '',
    name: '',
    location: '',
    apiaryName: '',
    status: 'HEALTHY',
    queenAgeMonths: '',
    lastInspection: new Date().toISOString().split('T')[0] || '',
  });

  const fetchHives = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hivesApi.getHives(token);
      setHivesList(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load smart hives.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHives();
  }, [fetchHives]);

  const openAddModal = () => {
    setEditingHive(null);
    setFormData({
      id: '',
      name: '',
      location: '',
      apiaryName: '',
      status: 'HEALTHY',
      queenAgeMonths: '',
      lastInspection: new Date().toISOString().split('T')[0] || '',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (hive: Hive) => {
    setEditingHive(hive);
    setFormData({
      id: hive.id,
      name: hive.name,
      location: hive.location,
      apiaryName: hive.apiary?.name || '',
      status: hive.status || 'HEALTHY',
      queenAgeMonths: hive.queenAgeMonths != null ? String(hive.queenAgeMonths) : '',
      lastInspection: hive.lastInspection ? new Date(hive.lastInspection).toISOString().split('T')[0] || '' : '',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSaveHive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setModalError('Hive name is required.');
      return;
    }
    if (!formData.location.trim()) {
      setModalError('Location is required.');
      return;
    }

    setModalLoading(true);
    setModalError(null);

    try {
      if (editingHive) {
        await hivesApi.updateHive(
          editingHive.id,
          {
            name: formData.name.trim(),
            location: formData.location.trim(),
            status: formData.status,
            queenAgeMonths: formData.queenAgeMonths ? Number(formData.queenAgeMonths) : undefined,
            lastInspection: formData.lastInspection ? new Date(formData.lastInspection) : undefined,
          },
          token
        );
      } else {
        const payload: CreateHiveDto = {
          name: formData.name.trim(),
          location: formData.location.trim(),
          status: formData.status,
          apiaryName: formData.apiaryName.trim() || undefined,
          queenAgeMonths: formData.queenAgeMonths ? Number(formData.queenAgeMonths) : undefined,
          lastInspection: formData.lastInspection ? new Date(formData.lastInspection) : undefined,
        };
        if (formData.id.trim()) {
          payload.id = formData.id.trim();
        }
        await hivesApi.createHive(payload, token);
      }

      setIsModalOpen(false);
      await fetchHives();
    } catch (err: any) {
      setModalError(err?.message || 'Could not save hive. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteHive = async () => {
    if (!deletingHive) return;
    setModalLoading(true);
    try {
      await hivesApi.deleteHive(deletingHive.id, token);
      setDeletingHive(null);
      await fetchHives();
    } catch (err: any) {
      alert(err?.message || 'Could not delete hive.');
    } finally {
      setModalLoading(false);
    }
  };

  const filterOptions = [
    { key: 'all', label: t.common.all },
    { key: 'healthy', label: t.common.healthy },
    { key: 'watch', label: t.common.watch },
    { key: 'inspect', label: t.common.inspect },
  ];

  const filteredHives = hivesList.filter((hive) => {
    const matchesFilter = filter === 'all' || hive.status?.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      hive.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hive.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hive.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)] shadow-xs">
              <Box size={24} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">{t.smartHives.title}</h1>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-0.5">
                {t.smartHives.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isGuest && (
            <button
              onClick={openAddModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-[var(--accent)] text-white font-semibold text-sm rounded-xl hover:opacity-95 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={18} />
              <span>Add Smart Hive</span>
            </button>
          )}
          <button
            onClick={fetchHives}
            disabled={loading}
            className="p-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Hives"
            aria-label="Refresh Hives"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hives by name, code or apiary..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === opt.key
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && hivesList.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Loading your smart hives…</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400 flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && hivesList.length === 0 && (
        <div className="py-16 px-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)] flex items-center justify-center mx-auto">
            <Box size={32} />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)]">No smart hives yet</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
            Add your first smart hive to begin monitoring acoustic telemetry, internal nest temperatures, colony mass, and swarm warnings.
          </p>
          {!isGuest ? (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--accent)] text-white font-semibold text-sm rounded-xl hover:opacity-95 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={18} />
              <span>Add Your First Hive</span>
            </button>
          ) : (
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Sign in to your beekeeper account to create and manage hives.
            </p>
          )}
        </div>
      )}

      {/* Filtered Empty State */}
      {!loading && hivesList.length > 0 && filteredHives.length === 0 && (
        <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
          No hives match the selected filter or search query.
        </div>
      )}

      {/* Hives Grid */}
      {!loading && filteredHives.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHives.map((hive) => (
            <HiveCard
              key={hive.id}
              hive={hive}
              onEdit={isGuest ? undefined : openEditModal}
              onDelete={isGuest ? undefined : setDeletingHive}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Hive Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
            <div className="relative px-6 pt-6 pb-4 border-b border-[var(--border)]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] rounded-full transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
                {editingHive ? 'Edit Smart Hive' : 'Add Smart Hive'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {editingHive ? `Updating ${editingHive.id}` : 'Register a new colony node into your apiary ledger.'}
              </p>
            </div>

            <form onSubmit={handleSaveHive} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {!editingHive && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Hive Code / ID <span className="text-[10px] lowercase text-[var(--text-secondary)]/60">(optional, e.g. H-104)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="Leave empty for auto-generated ID"
                    className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] font-mono placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Hive Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mustard Gold Queen Colony"
                  className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Location / Sector *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Sector B, Eastern Edge, Uttar Pradesh"
                  className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {!editingHive && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Apiary Name <span className="text-[10px] lowercase text-[var(--text-secondary)]/60">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.apiaryName}
                    onChange={(e) => setFormData({ ...formData, apiaryName: e.target.value })}
                    placeholder="e.g. Royal Crest Apiaries"
                    className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="HEALTHY">Healthy</option>
                    <option value="WATCH">Watch</option>
                    <option value="INSPECT">Inspect</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Queen Age (Months)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.queenAgeMonths}
                    onChange={(e) => setFormData({ ...formData, queenAgeMonths: e.target.value })}
                    placeholder="e.g. 14"
                    className="w-full px-3.5 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Last Inspection Date
                </label>
                <input
                  type="date"
                  value={formData.lastInspection}
                  onChange={(e) => setFormData({ ...formData, lastInspection: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-400">
                  {modalError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 bg-[var(--accent)] text-white font-semibold text-xs rounded-xl hover:opacity-95 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {modalLoading ? 'Saving…' : editingHive ? 'Update Hive' : 'Create Smart Hive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingHive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setDeletingHive(null)}
        >
          <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 border border-red-200 dark:border-red-900 flex items-center justify-center mx-auto">
              <Box size={24} />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-xl font-bold text-[var(--text-primary)]">Delete Hive {deletingHive.id}?</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                This will permanently delete "{deletingHive.name}" and its associated telemetry history from your ledger.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeletingHive(null)}
                className="flex-1 py-2.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHive}
                disabled={modalLoading}
                className="flex-1 py-2.5 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {modalLoading ? 'Deleting…' : 'Yes, Delete Hive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartHivesPage;
