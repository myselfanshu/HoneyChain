import React, { useState, useEffect } from 'react';
import { MarketProduct } from '@/components/market/MarketProduct';
import { RegionalPriceFeed } from '@/components/market/RegionalPriceFeed';
import { batchesApi, MarketProduct as ApiMarketProduct, RegionalMarketRate } from '@/api';
import { ShoppingBag, ArrowUpDown, Loader2, PackageOpen, ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export const MarketPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [rates, setRates] = useState<RegionalMarketRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc' | 'score'>('latest');

  const canEdit = user?.role === 'ADMIN' || user?.role === 'MARKET_HEAD';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      batchesApi.getMarketProducts(token).catch(() => [] as ApiMarketProduct[]),
      batchesApi.getMarketRates(token).catch(() => [] as RegionalMarketRate[]),
    ])
      .then(([productsData, ratesData]) => {
        if (!isMounted) return;
        const mapped = productsData.map((item: ApiMarketProduct) => ({
          id: item.id,
          batchId: item.batchId,
          name: item.batch?.name || `Verified Batch #${item.batchId}`,
          floralSource: item.batch?.passport?.floralSource || 'Mustard & Wildflower',
          location: item.batch?.location || 'Apiary Location',
          harvestDate: item.batch?.harvestDate || new Date().toISOString(),
          pricePerKg: item.pricePerKg,
          weightAvailableKg: item.availableWeightKg,
          trustScore: item.batch?.passport?.purityPct ? Math.round(item.batch.passport.purityPct) : 98,
          seller: {
            name: item.sellerName || 'Verified Apiary Partner',
            role: item.sellerRole || 'Beekeeper',
          },
        }));
        setProducts(mapped);
        setRates(ratesData);
      })
      .catch((err) => {
        console.error('Failed to load market data:', err);
        setProducts([]);
        setRates([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [token]);



  const filterOptions = [
    { key: 'all', label: t.common.all },
    { key: 'mustard', label: t.market.floralMustard },
    { key: 'wildflower', label: t.market.floralWildflower },
    { key: 'acacia', label: t.market.floralAcacia },
    { key: 'eucalyptus', label: t.market.floralEucalyptus },
  ];

  const filteredProducts = products
    .filter(product => {
      if (activeFilter === 'all') return true;
      return product.floralSource.toLowerCase().includes(activeFilter.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerKg - b.pricePerKg;
      if (sortBy === 'price-desc') return b.pricePerKg - a.pricePerKg;
      if (sortBy === 'score') return b.trustScore - a.trustScore;
      return 0; // default order
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)]">
            <ShoppingBag size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">{t.market.title}</h1>
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/20 font-semibold">
                {user?.role}
              </span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-0.5">
              {t.market.subtitle}
            </p>
          </div>
        </div>
        
        {/* Sort Selector */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-xl self-start md:self-auto shadow-xs">
          <ArrowUpDown size={15} className="text-[var(--accent)]" />
          <span className="font-medium text-[var(--text-primary)]">{t.market.sortBy}:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-[var(--text-primary)] text-sm font-medium focus:outline-none cursor-pointer"
          >
            <option value="latest" className="bg-[var(--surface)] text-[var(--text-primary)]">{t.market.sortLatest}</option>
            <option value="score" className="bg-[var(--surface)] text-[var(--text-primary)]">{t.market.sortScore}</option>
            <option value="price-asc" className="bg-[var(--surface)] text-[var(--text-primary)]">{t.market.sortPriceAsc}</option>
            <option value="price-desc" className="bg-[var(--surface)] text-[var(--text-primary)]">{t.market.sortPriceDesc}</option>
          </select>
        </div>
      </div>

      {/* Regional Market Price Benchmark Feed */}
      {rates.length > 0 && <RegionalPriceFeed rates={rates} />}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setActiveFilter(opt.key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === opt.key
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-[var(--surface)] border border-[var(--border)] rounded-3xl">
          <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin mb-3" />
          <p className="text-sm text-[var(--text-secondary)]">{t.common.loading}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-3xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--text-secondary)] border border-[var(--border)]">
            <PackageOpen size={24} />
          </div>
          <h3 className="text-lg font-serif font-bold text-[var(--text-primary)]">
            No Verified Honey Products Available
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
            There are currently no honey batches listed in the open verified marketplace matching your selection.
          </p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <MarketProduct key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketPage;

