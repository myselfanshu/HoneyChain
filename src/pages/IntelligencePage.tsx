import React, { useState } from 'react';
import { ColonyInsight } from '@/components/intelligence/ColonyInsight';
import { YieldPrediction } from '@/components/intelligence/YieldPrediction';
import { WeatherOutlook } from '@/components/intelligence/WeatherOutlook';
import { Brain, Sparkles, CheckCircle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const IntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions' | 'recommendations'>('insights');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)]">
            <Brain size={22} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">AI Intelligence</h1>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-0.5">
              Predictive acoustic analytics, foraging weather correlation, and colony stress detection.
            </p>
          </div>
        </div>

        {/* Intelligence Tabs */}
        <div className="flex items-center p-1 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-2xl self-start sm:self-auto">
          {[
            { id: 'insights', label: 'Insights' },
            { id: 'predictions', label: 'Predictions' },
            { id: 'recommendations', label: 'Recommendations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[var(--surface)] text-[var(--accent)] shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3-Column Intelligence Matrix (matching reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="min-h-[420px]">
          <ColonyInsight />
        </div>
        <div className="min-h-[420px]">
          <YieldPrediction />
        </div>
        <div className="min-h-[420px]">
          <WeatherOutlook />
        </div>
      </div>

      {/* Recommendations & Actionable Intel Section */}
      {activeTab === 'recommendations' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-[var(--border)]">
            <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Automated Field Recommendations</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Generated based on acoustic telemetry, weight deltas, and microclimate data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] space-y-2">
              <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-sm">
                <ShieldAlert size={16} />
                <span>Immediate Priority: Hive H-104</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Inspect brood nest for queen swarm cells. Frequency signature (196 Hz) indicates 78% likelihood of secondary swarm preparation.
              </p>
              <Link to="/smart-hives/H-104" className="text-xs font-medium text-[var(--accent)] hover:underline block pt-1">
                Open Telemetry & Event Log →
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] space-y-2">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm">
                <CheckCircle size={16} />
                <span>Super Addition: Hive H-102</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Colony weight reached 45.3 kg with +3.1 kg 7-day delta. High nectar flow demands an additional shallow super within 3 days.
              </p>
              <Link to="/smart-hives/H-102" className="text-xs font-medium text-[var(--accent)] hover:underline block pt-1">
                View Hive 102 Data →
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] space-y-2">
              <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-sm">
                <Sparkles size={16} />
                <span>Optimal Harvest Window</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Weather conditions over next 72h are dry and warm (28°C, 0% rain). Ideal for extracting mature capped frames in Sector A.
              </p>
              <Link to="/reports" className="text-xs font-medium text-[var(--accent)] hover:underline block pt-1">
                Review Yield Reports →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligencePage;
