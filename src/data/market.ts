import { MarketProduct } from './types';
import { actors } from './users';

export const marketProducts: MarketProduct[] = [
  {
    id: 'MP-001',
    batchId: 'HC-2026-0142',
    name: 'MUSTARD GOLD',
    floralSource: 'Mustard',
    location: 'Uttar Pradesh',
    pricePerKg: 650,
    weightAvailableKg: 18.4,
    trustScore: 96,
    seller: actors['beekeeper']!
  },
  {
    id: 'MP-002',
    batchId: 'HC-2026-0143',
    name: 'WILDFLOWER HONEY',
    floralSource: 'Mixed Wildflower',
    location: 'Himachal Pradesh',
    pricePerKg: 720,
    weightAvailableKg: 12.7,
    trustScore: 94,
    seller: actors['processor']!
  },
  {
    id: 'MP-003',
    batchId: 'HC-2026-0138',
    name: 'ACACIA HONEY',
    floralSource: 'Acacia',
    location: 'Kashmir Valley',
    pricePerKg: 850,
    weightAvailableKg: 9.3,
    trustScore: 93,
    seller: actors['packer']!
  },
  {
    id: 'MP-004',
    batchId: 'HC-2026-0130',
    name: 'EUCALYPTUS HONEY',
    floralSource: 'Eucalyptus',
    location: 'Tamil Nadu',
    pricePerKg: 680,
    weightAvailableKg: 14.6,
    trustScore: 92,
    seller: actors['distributor']!
  },
  {
    id: 'MP-005',
    batchId: 'HC-2026-0125',
    name: 'DESERT BLOOM',
    floralSource: 'Desert Flora',
    location: 'Rajasthan',
    pricePerKg: 750,
    weightAvailableKg: 22.1,
    trustScore: 90,
    seller: actors['retailer']!
  },
  {
    id: 'MP-006',
    batchId: 'HC-2026-0118',
    name: 'TROPICAL NECTAR',
    floralSource: 'Tropical Forest',
    location: 'Kerala',
    pricePerKg: 810,
    weightAvailableKg: 16.5,
    trustScore: 95,
    seller: actors['processor']!
  }
];
