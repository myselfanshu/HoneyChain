export type UserRole = 'ADMIN' | 'MARKET_HEAD' | 'BEEKEEPER' | 'PROCESSOR' | 'PACKER' | 'DISTRIBUTOR' | 'RETAILER' | 'AUDITOR' | 'GUEST';

export interface AuthPayload {
  id: string;
  email: string;
  role: UserRole;
  isGuest: boolean;
  iat?: number;
  exp?: number;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string | null;
  role: UserRole;
  location: string | null;
  isGuest: boolean;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
