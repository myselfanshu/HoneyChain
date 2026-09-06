import { apiRequest } from './client';

export interface ApiUser {
  id: string;
  name: string;
  email: string | null;
  role: string;
  location: string | null;
  isGuest: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: ApiUser;
  captchaDemoMode?: boolean;
}

export const authApi = {
  login: (email: string, password: string, captchaToken?: string) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, captchaToken }),
    }),

  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: string,
    captchaToken?: string
  ) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword, role, captchaToken }),
    }),

  guest: (captchaToken?: string) =>
    apiRequest<AuthResponse>('/auth/guest', {
      method: 'POST',
      body: JSON.stringify({ captchaToken }),
    }),

  me: (accessToken: string) => apiRequest<ApiUser>('/auth/me', {}, accessToken),

  logout: (accessToken?: string) =>
    apiRequest<{ message: string }>('/auth/logout', { method: 'POST' }, accessToken),
};

export interface PublicVerification {
  verificationStatus: 'DEMO_RECORD_NOT_INDEPENDENTLY_VERIFIED' | 'RECORDED_NOT_INDEPENDENTLY_VERIFIED' | 'VERIFIED_RECORD' | 'NOT_FOUND';
  batch?: {
    id: string;
    name: string;
    location: string;
    harvestDate: string;
    dataStatus: 'DEMO' | 'OBSERVED' | 'VERIFIED';
    events: Array<{ stage: string; occurredAt: string; location: string; status: string }>;
  };
}

export const publicApi = {
  batch: (batchId: string) => apiRequest<PublicVerification>(`/public/batches/${encodeURIComponent(batchId)}`),
};
