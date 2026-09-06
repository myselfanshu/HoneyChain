import { apiRequest } from './client';
import { Hive } from './hives';

export interface Passport {
  id: string;
  batchId: string;
  floralSource?: string | null;
  purityPct?: number | null;
  moisturePct?: number | null;
  hmfMgKg?: number | null;
  antibioticsDetected?: boolean | null;
  certificateUrl?: string | null;
  qualityStatus: 'VERIFIED' | 'OBSERVED' | 'DEMO';
  issuedAt: string;
}

export interface TraceabilityEvent {
  id: string;
  batchId: string;
  stage: string;
  description: string;
  occurredAt: string;
  actorName: string;
  actorRole: string;
  location: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dataStatus: 'VERIFIED' | 'OBSERVED' | 'DEMO';
  verificationMethod: 'RECORDED' | 'THIRD_PARTY_CERTIFICATE' | 'BLOCKCHAIN_CONFIRMED';
  externalProofRef?: string | null;
  recordedAt: string;
}

export interface MarketProduct {
  id: string;
  batchId: string;
  pricePerKg: number;
  availableWeightKg: number;
  currency: string;
  sellerName: string;
  sellerRole: string;
  active: boolean;
  batch?: Batch;
}

export interface Batch {
  id: string;
  name: string;
  location: string;
  harvestDate: string;
  hiveId?: string | null;
  hive?: Hive | null;
  weightKg: number;
  dataStatus: 'VERIFIED' | 'OBSERVED' | 'DEMO';
  publicTokenHash?: string | null;
  passport?: Passport | null;
  events?: TraceabilityEvent[];
  product?: MarketProduct | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBatchDto {
  id?: string;
  name: string;
  location?: string;
  harvestDate?: string | Date;
  hiveId: string;
  weightKg: number;
  floralSource?: string;
  purityPct?: number;
  moisturePct?: number;
}

export interface RegionalMarketRate {
  id: string;
  region: string;
  state: string;
  floralSource: string;
  benchmarkPrice: number;
  minSupportPrice: number;
  maxCeilingPrice: number;
  demandIndex: number;
  weeklyChangePct: number;
  moistureMaxPct: number;
}

export const batchesApi = {
  getBatches: (token?: string | null) =>
    apiRequest<Batch[]>('/batches', {}, token),

  getBatch: (batchId: string, token?: string | null) =>
    apiRequest<Batch>(`/batches/${encodeURIComponent(batchId)}`, {}, token),

  createBatch: (data: CreateBatchDto, token?: string | null) =>
    apiRequest<Batch>('/batches', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  getMarketProducts: (token?: string | null) =>
    apiRequest<MarketProduct[]>('/market/products', {}, token),

  getMarketRates: (token?: string | null) =>
    apiRequest<RegionalMarketRate[]>('/market/rates', {}, token),
};
