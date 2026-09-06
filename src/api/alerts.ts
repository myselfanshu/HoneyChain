import { apiRequest } from './client';

export interface Alert {
  id: string;
  recipientId: string;
  hiveId?: string | null;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  readAt?: string | null;
  source: string;
  dataStatus: 'VERIFIED' | 'OBSERVED' | 'DEMO';
  createdAt: string;
}

export interface CreateAlertDto {
  hiveId?: string;
  severity?: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  message: string;
  source?: string;
}

export const alertsApi = {
  getAlerts: (token?: string | null) =>
    apiRequest<Alert[]>('/alerts', {}, token),

  createAlert: (data: CreateAlertDto, token?: string | null) =>
    apiRequest<Alert>('/alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token),

  markAsRead: (alertId: string, token?: string | null) =>
    apiRequest<void>(`/alerts/${encodeURIComponent(alertId)}/read`, {
      method: 'PATCH',
    }, token),
};
