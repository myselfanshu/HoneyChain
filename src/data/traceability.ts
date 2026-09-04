import { TraceabilityEvent } from './types';
import { actors } from './users';

export const traceabilityEvents: TraceabilityEvent[] = [
  {
    id: 'EVT-001',
    batchId: 'HC-2026-0142',
    stage: 'Harvest Recorded',
    description: 'Raw honey extracted from Hive H-104 in Northern Field.',
    date: '2026-08-28T08:00:00Z',
    actor: actors['beekeeper']!,
    location: 'Uttar Pradesh',
    transactionHash: 'HCBA...7F3D',
    verified: true,
    status: 'Completed'
  },
  {
    id: 'EVT-002',
    batchId: 'HC-2026-0142',
    stage: 'Quality Check',
    description: 'Moisture: 17.2% • Purity: 98%',
    date: '2026-08-28T11:16:00Z',
    actor: actors['processor']!,
    location: 'Haryana Lab',
    transactionHash: 'HCBA...8B2F',
    verified: true,
    status: 'Completed'
  },
  {
    id: 'EVT-003',
    batchId: 'HC-2026-0142',
    stage: 'Processed',
    description: 'Filtered & Purified',
    date: '2026-08-29T01:32:00Z',
    actor: actors['processor']!,
    location: 'Haryana Processing Plant',
    transactionHash: 'HCBA...9C11',
    verified: true,
    status: 'Completed'
  },
  {
    id: 'EVT-004',
    batchId: 'HC-2026-0142',
    stage: 'Packaged',
    description: 'Batch sealed',
    date: '2026-08-30T02:22:00Z',
    actor: actors['packer']!,
    location: 'Delhi Packaging Facility',
    transactionHash: 'HCBA...AD91',
    verified: true,
    status: 'Completed'
  },
  {
    id: 'EVT-005',
    batchId: 'HC-2026-0142',
    stage: 'Market Ready',
    description: 'Available for sale',
    date: '2026-08-31T10:10:00Z',
    actor: actors['distributor']!,
    location: 'Maharashtra Logistics Hub',
    transactionHash: 'HCBA...BC74',
    verified: true,
    status: 'Completed'
  }
];
