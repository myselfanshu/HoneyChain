import { apiRequest } from './client';

export interface TelemetryReading {
  id: string;
  hiveId: string;
  recordedAt: string;
  temperatureC?: number | null;
  humidityPct?: number | null;
  weightKg?: number | null;
  colonyActivity?: number | null;
  acousticLevel?: number | null;
  source: string;
  dataStatus: 'VERIFIED' | 'OBSERVED' | 'DEMO';
}

export interface Apiary {
  id: string;
  name: string;
  location: string;
}

export interface Hive {
  id: string;
  name: string;
  location: string;
  status: 'HEALTHY' | 'WATCH' | 'INSPECT';
  queenAgeMonths?: number | null;
  lastInspection?: string | null;
  ownerId: string;
  apiaryId?: string | null;
  apiary?: Apiary | null;
  telemetry?: TelemetryReading[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateHiveDto {
  id?: string;
  name: string;
  location: string;
  status?: 'HEALTHY' | 'WATCH' | 'INSPECT';
  queenAgeMonths?: number;
  lastInspection?: string | Date;
  apiaryName?: string;
}

export interface UpdateHiveDto {
  name?: string;
  location?: string;
  status?: 'HEALTHY' | 'WATCH' | 'INSPECT';
  queenAgeMonths?: number;
  lastInspection?: string | Date;
}

export interface AddTelemetryDto {
  recordedAt?: string | Date;
  temperatureC?: number;
  humidityPct?: number;
  weightKg?: number;
  colonyActivity?: number;
  acousticLevel?: number;
  source?: string;
}

export const hivesApi = {
  getHives: (token?: string | null) =>
    apiRequest<Hive[]>('/hives', {}, token),

  getHive: (hiveId: string, token?: string | null) =>
    apiRequest<Hive>(`/hives/${encodeURIComponent(hiveId)}`, {}, token),

  createHive: (data: CreateHiveDto, token?: string | null) =>
    apiRequest<Hive>('/hives', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  updateHive: (hiveId: string, data: UpdateHiveDto, token?: string | null) =>
    apiRequest<Hive>(`/hives/${encodeURIComponent(hiveId)}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, token),

  deleteHive: (hiveId: string, token?: string | null) =>
    apiRequest<void>(`/hives/${encodeURIComponent(hiveId)}`, {
      method: 'DELETE',
    }, token),

  addTelemetry: (hiveId: string, data: AddTelemetryDto, token?: string | null) =>
    apiRequest<TelemetryReading>(`/hives/${encodeURIComponent(hiveId)}/telemetry`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),
};
