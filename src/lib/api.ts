/**
 * Thin client boundary for replacing src/data mock imports incrementally.
 * Theme and language stay entirely in their existing React contexts.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function api<T>(path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...init.headers },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new ApiError(response.status, payload.error || 'Request failed');
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export const honeychainApi = {
  login: (email: string, password: string) => api<{ accessToken: string; user: { id: string; name: string; role: string } }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getHives: (token: string) => api('/hives', {}, token),
  getHive: (id: string, token: string) => api(`/hives/${encodeURIComponent(id)}`, {}, token),
  verifyQrToken: (token: string) => api(`/public/verify/${encodeURIComponent(token)}`),
};
