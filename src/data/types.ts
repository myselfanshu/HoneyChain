export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  location: string;
  joinDate: string;
  trustScore: number;
  stats: {
    totalHives: number;
    healthyColonies: number;
    expectedYieldKg: number;
  };
}

export interface HiveSensorData {
  timestamp: string;
  temperature: number;
  humidity: number;
  weight: number;
  colonyActivity: number;
  acousticLevel: number;
}

export interface Hive {
  id: string;
  name: string;
  location: string;
  status: 'Healthy' | 'Watch' | 'Inspect';
  queenAge: number;
  lastInspection: string;
  sensors: HiveSensorData[];
  weightChange: number;
  aiRiskLevel: 'Low' | 'Medium' | 'High';
  expectedYield: number;
}

export interface Actor {
  id: string;
  name: string;
  role: 'Beekeeper' | 'Processor' | 'Packer' | 'Distributor' | 'Retailer';
  location: string;
  verified: boolean;
}

export interface TraceabilityEvent {
  id: string;
  batchId: string;
  stage: string;
  description: string;
  date: string;
  actor: Actor;
  location: string;
  transactionHash: string;
  verified: boolean;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export interface HoneyPassport {
  floralSource: string;
  purity: number;
  moisture: number;
  hmfLevel: number;
  antibioticsResidue: boolean;
  qualityVerified: boolean;
}

export interface Batch {
  id: string;
  name: string;
  location: string;
  harvestDate: string;
  hiveId: string;
  weightKg: number;
  trustScore: number;
  passport: HoneyPassport;
  events: TraceabilityEvent[];
}

export interface AIInsight {
  id: string;
  type: 'Observation' | 'Prediction' | 'Alert' | 'Anomaly';
  hiveId?: string;
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
  actionRequired: boolean;
  recommendedAction?: string;
}

export interface MarketProduct {
  id: string;
  batchId: string;
  name: string;
  floralSource: string;
  location: string;
  pricePerKg: number;
  weightAvailableKg: number;
  trustScore: number;
  image?: string;
  seller: Actor;
}

export interface Alert {
  id: string;
  type: 'Info' | 'Warning' | 'Critical';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface EnvironmentalReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  condition: string;
}

export interface WeatherData {
  current: EnvironmentalReading;
  forecast: EnvironmentalReading[];
  summary: string;
}
