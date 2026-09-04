import React from 'react';
import { Calendar, Bell, ArrowRight, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import ApiaryMap from '@/components/overview/ApiaryMap';
import LiveConditions from '@/components/overview/LiveConditions';
import AIObservation from '@/components/overview/AIObservation';
import RecentActivity from '@/components/overview/RecentActivity';
import { currentUser, batches } from '@/data';
import { Link } from 'react-router-dom';

const OverviewPage: React.FC = () => {
  const activeBatch = batches[0]!;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto min-h-screen space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] mb-1">
            Good morning, Ravi!
          </h1>
          <p className="font-sans text-[var(--text-secondary)] text-sm sm:text-base">
            Your apiary is <span className="text-[var(--success)] font-semibold">87% healthy</span> today. 21 of 24 colonies within optimal acoustic thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--text-secondary)] bg-[var(--surface)] px-3.5 py-2 rounded-xl border border-[var(--border)] shadow-xs">
            <Calendar size={14} className="text-[var(--accent)]" />
            <span>03 Sep 2026</span>
          </div>
          <Link 
            to="/alerts" 
            className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors relative shadow-xs"
            aria-label="View alerts"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent)] rounded-full"></span>
          </Link>
        </div>
      </div>

      {/* Row 1: 4 Core Metric Cards (matching reference) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Hives Monitored" 
          value="24" 
          trend="↑ 2 from last week" 
          trendUp={true} 
        />
        <MetricCard 
          title="Healthy Colonies" 
          value="21" 
          trend="87% of total" 
          trendUp={true} 
        />
        <MetricCard 
          title="Expected Yield" 
          value="186.4 kg" 
          trend="↑ 12.8% this cycle" 
          trendUp={true} 
        />
        
        {/* Trust Score Card matching reference */}
        <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--border)] flex flex-col justify-between shadow-xs hover:border-[var(--accent)] transition-colors">
          <div className="flex justify-between items-start">
            <h4 className="font-sans text-sm font-medium text-[var(--text-secondary)]">Trust Score</h4>
            <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-serif font-bold text-[var(--text-primary)]">96/100</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-green-600 dark:text-green-400">Excellent</span>
              <span className="text-[var(--text-secondary)] font-mono">Consensus verified</span>
            </div>
            <div className="w-full bg-[var(--surface-secondary)] h-1.5 rounded-full overflow-hidden border border-[var(--border)]">
              <div className="bg-[var(--accent)] h-full rounded-full w-[96%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Apiary Map, Live Conditions & AI Observation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6">
          <ApiaryMap />
        </div>
        <div className="lg:col-span-3">
          <LiveConditions />
        </div>
        <div className="lg:col-span-3">
          <AIObservation />
        </div>
      </div>

      {/* Row 3: Recent Activity + Latest Batch Provenance Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6">
          <RecentActivity />
        </div>

        {/* Active Harvest Batch Provenance Card */}
        <div className="lg:col-span-6 bg-[var(--surface)] p-6 sm:p-7 rounded-3xl border border-[var(--border)] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-[var(--accent)]">
                <Award size={18} />
                <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">Active Certified Harvest</h3>
              </div>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 font-semibold">
                {activeBatch.id}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase block">Honey Variety</span>
                <span className="text-sm font-serif font-bold text-[var(--text-primary)] truncate block">{activeBatch.name}</span>
              </div>
              <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase block">Origin Hive</span>
                <span className="text-sm font-serif font-bold text-[var(--accent)] block">{activeBatch.hiveId}</span>
              </div>
              <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase block">Batch Mass</span>
                <span className="text-sm font-serif font-bold text-[var(--text-primary)] block">{activeBatch.weightKg} kg</span>
              </div>
              <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase block">Lab Moisture</span>
                <span className="text-sm font-serif font-bold text-green-600 block">{activeBatch.passport.moisture}%</span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Harvested on 28 Aug 2026 from Northern Field mustard blooms. All 5 supply chain handoffs sealed on Polygon PoS.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--border)] mt-4">
            <Link 
              to={`/honey-passport/${activeBatch.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[var(--surface-secondary)] text-[var(--accent)] font-medium text-xs border border-[var(--border)] hover:border-[var(--accent)] transition-all"
            >
              <span>View Honey Passport</span>
              <ArrowRight size={13} />
            </Link>
            <Link 
              to={`/verify/${activeBatch.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[var(--accent)] text-white font-medium text-xs hover:opacity-90 transition-opacity"
            >
              <span>Consumer QR Story</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
