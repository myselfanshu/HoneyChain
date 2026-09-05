import React, { useState } from 'react';
import { Home, Droplet, ShieldCheck, Factory, Package, ShoppingBag, Check, X } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

interface Step {
  id: number;
  title: string;
  date: string;
  sub: string;
  icon: React.ElementType;
  completed: boolean;
  detail: {
    label: string;
    value: string;
  }[];
  note?: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Hive Monitored',
    date: '25 Aug 2026',
    sub: 'H-104 Telemetry',
    icon: Home,
    completed: true,
    detail: [
      { label: 'Hive ID', value: 'H-104' },
      { label: 'Avg Temperature', value: '34.5 °C' },
      { label: 'Colony Activity', value: 'High (85 avg/min)' },
      { label: 'Hive Weight', value: '42.1 kg' },
      { label: 'Acoustic Freq.', value: '240 Hz (baseline)' },
    ],
    note: 'Telemetry sealed on-chain at block 7,841,220.',
  },
  {
    id: 2,
    title: 'Harvest Recorded',
    date: '28 Aug 2026',
    sub: '18.4 kg Extracted',
    icon: Droplet,
    completed: true,
    detail: [
      { label: 'Extracted Weight', value: '18.4 kg' },
      { label: 'Harvest Method', value: 'Cold extraction (<40 °C)' },
      { label: 'Initial Moisture', value: '17.8%' },
      { label: 'Frames Harvested', value: '11 frames' },
      { label: 'Beekeeper', value: 'Ravi Kumar' },
    ],
    note: 'Harvest event logged by beekeeper and co-signed by IoT gateway.',
  },
  {
    id: 3,
    title: 'Quality Verified',
    date: '28 Aug 2026',
    sub: 'Purity 99.2%',
    icon: ShieldCheck,
    completed: true,
    detail: [
      { label: 'Purity', value: '99.2%' },
      { label: 'HMF', value: '12 mg/kg (< 40 limit)' },
      { label: 'pH', value: '3.8' },
      { label: 'Diastase', value: '18.4 DN' },
      { label: 'Lab', value: 'FSSAI Accredited, Delhi' },
    ],
    note: 'Lab certificate hash anchored on Polygon PoS.',
  },
  {
    id: 4,
    title: 'Processed',
    date: '29 Aug 2026',
    sub: 'Filtered & Tested',
    icon: Factory,
    completed: true,
    detail: [
      { label: 'Processor', value: 'NaturePure Pvt. Ltd.' },
      { label: 'Filter Temp.', value: '38 °C max (gentle)' },
      { label: 'Duration', value: '4 hours' },
      { label: 'Post-process Moisture', value: '17.2%' },
      { label: 'Batch Split', value: 'None — single batch' },
    ],
    note: 'Processing event co-signed by processor on-chain.',
  },
  {
    id: 5,
    title: 'Packaged',
    date: '30 Aug 2026',
    sub: 'Batch Sealed',
    icon: Package,
    completed: true,
    detail: [
      { label: 'Batch ID', value: 'HC-2026-0142' },
      { label: 'Jar Size', value: '250 g glass' },
      { label: 'Units Packed', value: '73 jars' },
      { label: 'Seal Type', value: 'Tamper-evident + QR' },
      { label: 'Seal Date', value: '30 Aug 2026' },
    ],
    note: 'Batch NFT minted on Polygon PoS — token #4219.',
  },
  {
    id: 6,
    title: 'Market Ready',
    date: '31 Aug 2026',
    sub: 'Available for Sale',
    icon: ShoppingBag,
    completed: true,
    detail: [
      { label: 'Listing Price', value: '₹ 480 / 250 g jar' },
      { label: 'Channel', value: 'HoneyChain Marketplace' },
      { label: 'Units Available', value: '73 jars' },
      { label: 'Consumer QR', value: 'Active — scannable' },
      { label: 'Trust Score', value: '96 / 100' },
    ],
    note: 'Consumers can scan any jar QR to view this full journey.',
  },
];

export const JourneySnapshot: React.FC = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const activeStepData = steps.find((s) => s.id === activeStep);

  const handleClick = (id: number) => {
    setActiveStep((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full mt-8 p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border)]">
        <div>
          <h3 className="text-xl font-serif font-bold text-[var(--text-primary)]">{t.passport.journeySnapshot}</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {t.traceability.supplyChainJourney}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--accent)] font-medium bg-[var(--surface-secondary)] px-3 py-1 rounded-full border border-[var(--border)]">
          <Check size={14} />
          <span>6 {t.common.verified}</span>
        </div>
      </div>

      {/* Stage circles */}
      <div className="relative">
        {/* Track line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-[var(--border)] z-0 hidden md:block" />
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-[var(--accent)] z-0 hidden md:block" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 md:gap-2 relative z-10">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => handleClick(step.id)}
                className={`flex flex-row md:flex-col items-center md:text-center gap-3 md:gap-0 group transition-all text-left md:text-center focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded-xl p-1`}
                title={`View ${step.title} details`}
                aria-pressed={isActive}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-md shrink-0 transition-all duration-200 ${
                    isActive
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white scale-110 shadow-lg shadow-amber-500/20'
                      : 'border-[var(--surface)] bg-[var(--accent)] text-white group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-amber-500/20'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="md:mt-3">
                  <div className={`font-serif font-bold text-sm transition-colors ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs font-medium text-[var(--accent)] mt-0.5">{step.date}</div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{step.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel — slides open when a stage is active */}
      {activeStepData && (
        <div className="mt-6 p-5 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--accent)]/30 animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-serif font-bold text-base text-[var(--text-primary)]">
                Stage {activeStepData.id}: {activeStepData.title}
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">Sealed · {activeStepData.date}</p>
            </div>
            <button
              onClick={() => setActiveStep(null)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-lg hover:bg-[var(--border)]"
              aria-label="Close detail panel"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
            {activeStepData.detail.map((d) => (
              <div key={d.label} className="p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                <span className="text-[10px] uppercase font-semibold text-[var(--text-secondary)] block mb-1">
                  {d.label}
                </span>
                <span className="text-sm font-serif font-bold text-[var(--text-primary)]">{d.value}</span>
              </div>
            ))}
          </div>

          {activeStepData.note && (
            <p className="text-[11px] text-[var(--text-secondary)] italic border-t border-[var(--border)] pt-3">
              🔒 {activeStepData.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JourneySnapshot;
