import React, { useState } from 'react';
import { MarketProduct } from '@/components/market/MarketProduct';
import { marketProducts } from '@/data/market';
import { FilterPills } from '@/components/ui/FilterPills';
import { ShoppingBag, ArrowUpDown } from 'lucide-react';

export const MarketPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc' | 'score'>('latest');

  const filterOptions = ['All', 'Mustard', 'Wildflower', 'Acacia', 'Eucalyptus'];

  const filteredProducts = marketProducts
    .filter(product => {
      if (activeFilter === 'All') return true;
      return product.floralSource.toLowerCase().includes(activeFilter.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerKg - b.pricePerKg;
      if (sortBy === 'price-desc') return b.pricePerKg - a.pricePerKg;
      if (sortBy === 'score') return b.trustScore - a.trustScore;
      return 0; // default order
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)]">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[var(--text-primary)] font-bold">Marketplace</h1>
            <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-0.5">
              Direct-from-apiary verified pure honey with transparent blockchain provenance.
            </p>
          </div>
        </div>
        
        {/* Sort Selector */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-xl self-start md:self-auto">
          <ArrowUpDown size={15} className="text-[var(--accent)]" />
          <span className="font-medium text-[var(--text-primary)]">Sort:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-[var(--text-primary)] text-sm font-medium focus:outline-none cursor-pointer"
          >
            <option value="latest">Latest Harvest</option>
            <option value="score">Highest Trust Score</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center overflow-x-auto pb-1">
        <FilterPills 
          options={filterOptions}
          selected={activeFilter}
          onChange={setActiveFilter}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <MarketProduct key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MarketPage;
