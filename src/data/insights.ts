import { AIInsight } from './types';

export const insights: AIInsight[] = [
  {
    id: 'INS-001',
    type: 'Anomaly',
    hiveId: 'H-104',
    title: 'Acoustic Activity Drop',
    description: '18% decrease in acoustic activity detected over the last 12 hours.',
    confidence: 82,
    timestamp: '2026-09-04T10:15:00Z',
    actionRequired: true,
    recommendedAction: 'Recommend inspect within 24 hours to check for swarming or queen loss.'
  },
  {
    id: 'INS-002',
    type: 'Observation',
    title: 'Favorable Foraging Conditions',
    description: 'Current weather and floral bloom in Uttar Pradesh align for optimal nectar flow.',
    confidence: 91,
    timestamp: '2026-09-04T08:00:00Z',
    actionRequired: false
  },
  {
    id: 'INS-003',
    type: 'Prediction',
    title: 'Yield Optimization',
    description: 'Projected 15% increase in total yield if harvesting is delayed by 3 days for hives in Sector A.',
    confidence: 76,
    timestamp: '2026-09-03T18:30:00Z',
    actionRequired: false
  },
  {
    id: 'INS-004',
    type: 'Alert',
    hiveId: 'H-107',
    title: 'Critical Colony Health Risk',
    description: 'Significant weight loss and temperature drop. Immediate inspection required.',
    confidence: 96,
    timestamp: '2026-09-03T09:45:00Z',
    actionRequired: true,
    recommendedAction: 'Inspect immediately. Potential pest infestation or disease.'
  }
];
