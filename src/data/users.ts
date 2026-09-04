import { User, Actor } from './types';

export const currentUser: User = {
  id: 'USR-2026-001',
  name: 'Ravi Kumar',
  role: 'Beekeeper',
  avatar: '/avatars/ravi.jpg',
  location: 'Uttar Pradesh, India',
  joinDate: '2024-03-12T00:00:00Z',
  trustScore: 96,
  stats: {
    totalHives: 24,
    healthyColonies: 21,
    expectedYieldKg: 186.4
  }
};

export const actors: Record<string, Actor> = {
  beekeeper: {
    id: 'ACT-001',
    name: 'Ravi Kumar',
    role: 'Beekeeper',
    location: 'Uttar Pradesh',
    verified: true
  },
  processor: {
    id: 'ACT-002',
    name: 'HoneyPure Pvt. Ltd.',
    role: 'Processor',
    location: 'Haryana',
    verified: true
  },
  packer: {
    id: 'ACT-003',
    name: 'PurePack Industries',
    role: 'Packer',
    location: 'Delhi',
    verified: true
  },
  distributor: {
    id: 'ACT-004',
    name: 'GreenHive Supplies',
    role: 'Distributor',
    location: 'Maharashtra',
    verified: true
  },
  retailer: {
    id: 'ACT-005',
    name: 'Nature\'s Basket',
    role: 'Retailer',
    location: 'Multiple Locations',
    verified: true
  }
};
