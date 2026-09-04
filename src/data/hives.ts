import { Hive } from './types';

const generateHourlyData = (hours: number, baseTemp: number, baseWeight: number, baseActivity: number) => {
  return Array.from({ length: hours }).map((_, i) => ({
    timestamp: new Date(Date.now() - (hours - i - 1) * 3600000).toISOString(),
    temperature: baseTemp + Math.random() * 2 - 1,
    humidity: 45 + Math.random() * 10 - 5,
    weight: baseWeight + (i * 0.05) + Math.random() * 0.1 - 0.05,
    colonyActivity: baseActivity + Math.random() * 20 - 10,
    acousticLevel: 40 + Math.random() * 15 - 7.5
  }));
};

export const hives: Hive[] = [
  {
    id: 'H-101',
    name: 'Hive 101',
    location: 'Sector A, Northern Field',
    status: 'Healthy',
    queenAge: 8,
    lastInspection: '2026-08-25T10:30:00Z',
    sensors: generateHourlyData(24, 34.5, 42.1, 85),
    weightChange: 2.4,
    aiRiskLevel: 'Low',
    expectedYield: 8.5
  },
  {
    id: 'H-102',
    name: 'Hive 102',
    location: 'Sector A, Northern Field',
    status: 'Healthy',
    queenAge: 6,
    lastInspection: '2026-08-25T11:00:00Z',
    sensors: generateHourlyData(24, 34.2, 45.3, 90),
    weightChange: 3.1,
    aiRiskLevel: 'Low',
    expectedYield: 9.2
  },
  {
    id: 'H-103',
    name: 'Hive 103',
    location: 'Sector B, Eastern Edge',
    status: 'Healthy',
    queenAge: 12,
    lastInspection: '2026-08-20T09:15:00Z',
    sensors: generateHourlyData(24, 34.8, 41.5, 78),
    weightChange: 1.8,
    aiRiskLevel: 'Low',
    expectedYield: 7.8
  },
  {
    id: 'H-104',
    name: 'Hive 104',
    location: 'Sector B, Eastern Edge',
    status: 'Watch',
    queenAge: 14,
    lastInspection: '2026-08-20T09:45:00Z',
    sensors: generateHourlyData(24, 35.1, 38.2, 55),
    weightChange: -0.5,
    aiRiskLevel: 'Medium',
    expectedYield: 6.5
  },
  {
    id: 'H-105',
    name: 'Hive 105',
    location: 'Sector C, Southern Copse',
    status: 'Healthy',
    queenAge: 5,
    lastInspection: '2026-08-28T14:20:00Z',
    sensors: generateHourlyData(24, 34.4, 46.8, 92),
    weightChange: 3.5,
    aiRiskLevel: 'Low',
    expectedYield: 9.8
  },
  {
    id: 'H-106',
    name: 'Hive 106',
    location: 'Sector C, Southern Copse',
    status: 'Healthy',
    queenAge: 4,
    lastInspection: '2026-08-28T14:50:00Z',
    sensors: generateHourlyData(24, 34.6, 44.5, 88),
    weightChange: 2.9,
    aiRiskLevel: 'Low',
    expectedYield: 8.9
  },
  {
    id: 'H-107',
    name: 'Hive 107',
    location: 'Sector D, Western Windbreak',
    status: 'Inspect',
    queenAge: 18,
    lastInspection: '2026-08-15T08:30:00Z',
    sensors: generateHourlyData(24, 33.2, 35.1, 30),
    weightChange: -2.1,
    aiRiskLevel: 'High',
    expectedYield: 4.2
  }
];
