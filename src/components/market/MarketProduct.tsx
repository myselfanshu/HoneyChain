import React, { useState } from 'react';
import { CheckCircle, ShoppingBag, ShieldCheck, Award, ArrowRight, ExternalLink } from 'lucide-react';
import { MarketProduct as MarketProductType } from '@/data/types';
import { Link } from 'react-router-dom';
import { Modal } from '@/components/ui/Modal';
import { useTranslation } from '@/contexts/LanguageContext';

interface MarketProductProps {
  product: MarketProductType;
}

export const MarketProduct: React.FC<MarketProductProps> = ({ product }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Honey color tone depending on floral source
  const getHoneyGradients = (floral: string) => {
    switch (floral.toLowerCase()) {
      case 'mustard':
        return {
          from: '#EAB308',
          to: '#CA8A04',
          accent: '#FEF08A',
        };
      case 'acacia':
        return {
          from: '#FDE047',
          to: '#EAB308',
          accent: '#FEF9C3',
        };
      case 'eucalyptus':
        return {
          from: '#D97706',
          to: '#92400E',
          accent: '#FDE68A',
        };
      default:
        return {
          from: '#F59E0B',
          to: '#B45309',
          accent: '#FDE68A',
        };
    }
  };

  const getLocalizedLocation = (loc: string) => {
    if (loc.toLowerCase().includes('uttar pradesh')) return t.market.locationUP;
    if (loc.toLowerCase().includes('himachal')) return t.market.locationHP;
    if (loc.toLowerCase().includes('kashmir')) return t.market.locationKashmir;
    if (loc.toLowerCase().includes('tamil nadu')) return t.market.locationTamilNadu;
    return loc;
  };

  const getLocalizedFloral = (floral: string) => {
    if (floral.toLowerCase().includes('mustard')) return t.market.floralMustard;
    if (floral.toLowerCase().includes('wildflower')) return t.market.floralWildflower;
    if (floral.toLowerCase().includes('acacia')) return t.market.floralAcacia;
    if (floral.toLowerCase().includes('eucalyptus')) return t.market.floralEucalyptus;
    return floral;
  };

  const colors = getHoneyGradients(product.floralSource);

  return (
    <>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group hover:border-[var(--accent)]">
        {/* Visual Header / Honey Jar Showcase */}
        <div className="h-52 bg-gradient-to-b from-[var(--surface-secondary)] to-[var(--surface)] p-6 flex items-center justify-center relative overflow-hidden">
          <div 
            className="absolute w-36 h-36 rounded-full blur-2xl opacity-30 pointer-events-none"
            style={{ backgroundColor: colors.from }}
          />

          <svg width="120" height="150" viewBox="0 0 120 150" className="relative z-10 drop-shadow-md group-hover:scale-105 transition-transform duration-300">
            <ellipse cx="60" cy="142" rx="42" ry="7" fill="var(--card-border)" />
            <rect x="22" y="136" width="76" height="6" rx="2" fill="var(--text-tertiary)" opacity="0.3" />

            <path
              d="M 28 36 L 92 36 C 96 36, 100 40, 99 46 L 95 130 C 94 136, 88 140, 82 140 L 38 140 C 32 140, 26 136, 25 130 L 21 46 C 20 40, 24 36, 28 36 Z"
              fill="rgba(255, 255, 255, 0.05)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />

            <defs>
              <linearGradient id={`honey-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.accent} stopOpacity="0.9" />
                <stop offset="40%" stopColor={colors.from} stopOpacity="0.95" />
                <stop offset="100%" stopColor={colors.to} stopOpacity="1" />
              </linearGradient>
              <linearGradient id={`glass-glare-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d="M 27 50 Q 60 46 93 50 L 91 128 C 90 133, 85 136, 80 136 L 40 136 C 35 136, 30 133, 29 128 Z"
              fill={`url(#honey-${product.id})`}
            />

            <path
              d="M 30 52 L 32 126 C 32 128, 34 130, 36 130 L 42 130 L 40 52 Z"
              fill={`url(#glass-glare-${product.id})`}
            />

            <rect x="42" y="72" width="36" height="40" rx="4" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />
            <text x="60" y="88" textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="serif" fill="var(--accent)">
              HC
            </text>
            <text x="60" y="98" textAnchor="middle" fontSize="6" fontFamily="sans-serif" letterSpacing="0.5" fill="var(--text-secondary)">
              PURE
            </text>
            <circle cx="60" cy="104" r="2" fill="var(--accent)" />

            <path
              d="M 22 24 L 98 24 C 100 24, 102 26, 101 28 L 97 36 L 23 36 L 19 28 C 18 26, 20 24, 22 24 Z"
              fill="#78350F"
            />
            <rect x="20" y="20" width="80" height="5" rx="2" fill="#92400E" />
            <line x1="24" y1="36" x2="96" y2="36" stroke="#D97706" strokeWidth="2" strokeDasharray="3,1" />
          </svg>

          <div className="absolute top-3 left-3 bg-[var(--surface)]/90 backdrop-blur-sm border border-[var(--border)] px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold text-[var(--accent)] shadow-sm">
            {product.batchId}
          </div>
        </div>
        
        {/* Product Details */}
        <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-serif font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                {product.name}
              </h3>
            </div>
            <p className="text-[var(--text-secondary)] text-xs mb-3 flex items-center gap-1.5">
              <span>{getLocalizedLocation(product.location)}</span>
              <span>•</span>
              <span className="font-medium text-[var(--text-primary)]">{getLocalizedFloral(product.floralSource)}</span>
            </p>
            
            {/* Verified Badge */}
            <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs font-medium border border-green-500/20 mb-3">
              <CheckCircle size={12} className="text-green-600 dark:text-green-400" />
              <span>{t.market.verifiedHarvest}</span>
            </div>

            {/* Trust Score Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-secondary)] flex items-center gap-1">
                  <ShieldCheck size={13} className="text-[var(--accent)]" /> {t.overview.trustScore}
                </span>
                <span className="text-[var(--text-primary)] font-bold">{product.trustScore}/100</span>
              </div>
              <div className="w-full bg-[var(--surface-secondary)] rounded-full h-1.5 overflow-hidden border border-[var(--border)]">
                <div 
                  className="bg-[var(--accent)] h-full rounded-full transition-all duration-700" 
                  style={{ width: `${product.trustScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="pt-3 border-t border-[var(--border)]">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">{t.market.price}</p>
                <p className="text-base font-bold text-[var(--text-primary)]">
                  ₹{product.pricePerKg} <span className="text-xs font-normal text-[var(--text-secondary)]">/ {t.common.kg}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">{t.market.availableStock}</p>
                <p className="text-base font-bold text-[var(--text-primary)]">
                  {product.weightAvailableKg} <span className="text-xs font-normal text-[var(--text-secondary)]">{t.common.kg}</span>
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] text-white py-2.5 px-4 rounded-xl hover:opacity-90 transition-opacity font-medium text-sm shadow-sm cursor-pointer"
            >
              <ShoppingBag size={15} />
              {t.market.viewDetailsProvenance}
            </button>
          </div>
        </div>
      </div>

      {/* Provenance & Batch Detail Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={product.name}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
            <div>
              <span className="font-mono text-xs font-semibold text-[var(--accent)] block">{t.passport.batch} #{product.batchId}</span>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t.passport.origin}: {getLocalizedLocation(product.location)} • {t.passport.floralSource}: {getLocalizedFloral(product.floralSource)}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[var(--text-secondary)] block">{t.market.directPrice}</span>
              <span className="text-xl font-bold text-[var(--text-primary)]">₹{product.pricePerKg}/{t.common.kg}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
              <span className="text-[11px] text-[var(--text-secondary)] block">{t.market.qualityScore}</span>
              <span className="text-lg font-serif font-bold text-[var(--accent)]">{product.trustScore}/100</span>
              <span className="text-[10px] text-green-600 block">✓ {t.market.labVerified}</span>
            </div>
            <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
              <span className="text-[11px] text-[var(--text-secondary)] block">{t.market.availableStock}</span>
              <span className="text-lg font-serif font-bold text-[var(--text-primary)]">{product.weightAvailableKg} {t.common.kg}</span>
              <span className="text-[10px] text-[var(--text-secondary)] block">{t.market.sealedJars}</span>
            </div>
            <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)] col-span-2 sm:col-span-1">
              <span className="text-[11px] text-[var(--text-secondary)] block">{t.market.verifiedPartner}</span>
              <span className="text-sm font-semibold text-[var(--text-primary)] truncate block">{product.seller.name}</span>
              <span className="text-[10px] text-[var(--accent)] block">{product.seller.role}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] text-xs space-y-1.5 text-[var(--text-secondary)]">
            <p className="font-semibold text-[var(--text-primary)]">{t.market.blockchainGuarantee}</p>
            <p>{t.market.blockchainGuaranteeText}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link 
              to={`/honey-passport/${product.batchId}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[var(--accent)] text-[var(--accent)] font-medium text-sm hover:bg-[var(--surface-secondary)] transition-colors"
            >
              <Award size={16} />
              {t.market.inspectPassport}
            </Link>
            <Link 
              to={`/verify/${product.batchId}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--accent)] text-white font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <ExternalLink size={16} />
              {t.market.consumerStory}
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MarketProduct;
