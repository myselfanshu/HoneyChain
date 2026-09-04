import { Batch } from './types';
import { actors } from './users';

export const batches: Batch[] = [
  {
    id: 'HC-2026-0142',
    name: 'MUSTARD GOLD',
    location: 'Uttar Pradesh',
    harvestDate: '2026-08-28T08:00:00Z',
    hiveId: 'H-104',
    weightKg: 18.4,
    trustScore: 96,
    passport: {
      floralSource: 'Mustard',
      purity: 99.2,
      moisture: 16.5,
      hmfLevel: 12.4,
      antibioticsResidue: false,
      qualityVerified: true
    },
    events: []
  },
  {
    id: 'HC-2026-0143',
    name: 'WILDFLOWER HONEY',
    location: 'Himachal Pradesh',
    harvestDate: '2026-08-20T09:30:00Z',
    hiveId: 'H-082',
    weightKg: 12.7,
    trustScore: 94,
    passport: {
      floralSource: 'Mixed Wildflower',
      purity: 98.5,
      moisture: 17.1,
      hmfLevel: 14.2,
      antibioticsResidue: false,
      qualityVerified: true
    },
    events: []
  },
  {
    id: 'HC-2026-0138',
    name: 'ACACIA HONEY',
    location: 'Kashmir Valley',
    harvestDate: '2026-08-12T10:15:00Z',
    hiveId: 'H-055',
    weightKg: 9.3,
    trustScore: 93,
    passport: {
      floralSource: 'Acacia',
      purity: 97.8,
      moisture: 18.0,
      hmfLevel: 15.6,
      antibioticsResidue: false,
      qualityVerified: true
    },
    events: []
  },
  {
    id: 'HC-2026-0130',
    name: 'EUCALYPTUS HONEY',
    location: 'Tamil Nadu',
    harvestDate: '2026-08-05T07:45:00Z',
    hiveId: 'H-120',
    weightKg: 14.6,
    trustScore: 92,
    passport: {
      floralSource: 'Eucalyptus',
      purity: 98.0,
      moisture: 17.5,
      hmfLevel: 16.1,
      antibioticsResidue: false,
      qualityVerified: true
    },
    events: []
  }
];
