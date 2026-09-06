import React from 'react';
import { TrendingUp, TrendingDown, MapPin, IndianRupee } from 'lucide-react';
import { RegionalMarketRate } from '@/api/batches';

interface RegionalPriceFeedProps {
  rates: RegionalMarketRate[];
}

export const RegionalPriceFeed: React.FC<RegionalPriceFeedProps> = ({ rates }) => {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-7 shadow-sm space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
              <IndianRupee size={16} />
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[var(--text-primary)]">
              Regional Market Price Benchmark Feed
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Real-time APMC & certified fair-trade market rates across Indian beekeeping territories
          </p>
        </div>
        <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 font-semibold self-start sm:self-auto shrink-0">
          LIVE APMC BENCHMARK
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {rates.map((rate) => {
          const isPositive = rate.weeklyChangePct >= 0;
          return (
            <div
              key={rate.id}
              className="p-4 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] space-y-2.5 hover:border-[var(--accent)]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 text-[11px] text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1 truncate font-medium">
                    <MapPin size={12} className="text-[var(--accent)] shrink-0" />
                    <span className="truncate">{rate.region}</span>
                  </span>
                  <span className={`font-mono font-bold text-[10px] flex items-center shrink-0 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                    {isPositive ? <TrendingUp size={11} className="mr-0.5" /> : <TrendingDown size={11} className="mr-0.5" />}
                    {isPositive ? `+${rate.weeklyChangePct}%` : `${rate.weeklyChangePct}%`}
                  </span>
                </div>

                <div className="mt-2">
                  <span className="text-[10px] text-[var(--text-secondary)] block truncate">
                    {rate.floralSource}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-serif font-bold text-[var(--text-primary)]">
                      ₹{rate.benchmarkPrice}
                    </span>
                    <span className="text-[10px] text-[var(--text-secondary)] font-mono">/ kg</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border)] grid grid-cols-2 gap-1 text-[10px] text-[var(--text-secondary)]">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[var(--text-secondary)]/80">MSP Floor</span>
                  <span className="font-mono font-semibold text-[var(--text-primary)]">₹{rate.minSupportPrice}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] uppercase tracking-wider text-[var(--text-secondary)]/80">Demand</span>
                  <span className="font-mono font-semibold text-[var(--accent)]">{rate.demandIndex}x</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
