import { apiRequest } from './client';

export interface ReportsSummary {
  totalHives: number;
  healthyHives: number;
  unreadAlerts: number;
  totalHarvestKg: number;
  note?: string;
}

export interface FieldReport {
  id: string;
  userId: string;
  hiveId?: string | null;
  title: string;
  period?: string | null;
  notes?: string | null;
  status: string;
  createdAt: string;
}

export interface CreateFieldReportDto {
  hiveId?: string;
  title: string;
  period?: string;
  notes?: string;
  status?: string;
}

export const reportsApi = {
  getSummary: (token?: string | null) =>
    apiRequest<ReportsSummary>('/reports/summary', {}, token),

  getFieldReports: (token?: string | null) =>
    apiRequest<FieldReport[]>('/reports', {}, token),

  createFieldReport: (data: CreateFieldReportDto, token?: string | null) =>
    apiRequest<FieldReport>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),
};
