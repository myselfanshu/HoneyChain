import { Alert } from './types';

export const alerts: Alert[] = [
  {
    id: 'ALT-001',
    type: 'Critical',
    title: 'Hive H-107 Needs Inspection',
    message: 'Significant weight loss detected. Immediate attention recommended.',
    timestamp: '2026-09-04T08:30:00Z',
    read: false,
    link: '/hives/H-107'
  },
  {
    id: 'ALT-002',
    type: 'Warning',
    title: 'Acoustic Anomaly in H-104',
    message: '18% decrease in acoustic activity. AI suggests checking within 24 hours.',
    timestamp: '2026-09-04T10:15:00Z',
    read: false,
    link: '/hives/H-104'
  },
  {
    id: 'ALT-003',
    type: 'Info',
    title: 'Batch HC-2026-0142 Listed',
    message: 'Your Mustard Gold batch has been successfully listed on the marketplace.',
    timestamp: '2026-09-02T12:00:00Z',
    read: true,
    link: '/batches/HC-2026-0142'
  },
  {
    id: 'ALT-004',
    type: 'Info',
    title: 'Quality Check Passed',
    message: 'Batch HC-2026-0143 passed all lab purity tests with 98.5% purity.',
    timestamp: '2026-08-30T16:45:00Z',
    read: true,
    link: '/batches/HC-2026-0143'
  }
];
