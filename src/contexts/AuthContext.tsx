import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, ApiUser, ApiError } from '../api';

const TOKEN_KEY = 'honeychain-access-token';

export interface AuthState {
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  captchaDemoMode: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string, captchaToken?: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string, role: string, captchaToken?: string) => Promise<void>;
  continueAsGuest: (captchaToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [captchaDemoMode, setCaptchaDemoMode] = useState<boolean>(false);

  const clearError = useCallback(() => setError(null), []);

  // On mount, validate existing stored token against backend
  useEffect(() => {
    const storedToken = sessionStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      authApi
        .me(storedToken)
        .then((u) => {
          setUser(u);
          setToken(storedToken);
        })
        .catch(() => {
          // Token is expired or backend is unavailable — clear silently
          sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const persistAuth = (newToken: string, newUser: ApiUser, demoMode: boolean) => {
    sessionStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
    setCaptchaDemoMode(demoMode);
    setError(null);
  };

  const login = useCallback(async (email: string, password: string, captchaToken?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.login(email, password, captchaToken);
      persistAuth(res.accessToken, res.user, res.captchaDemoMode ?? false);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Login failed. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, confirmPassword: string, role: string, captchaToken?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authApi.register(name, email, password, confirmPassword, role, captchaToken);
        persistAuth(res.accessToken, res.user, res.captchaDemoMode ?? false);
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Registration failed. Please try again.';
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const continueAsGuest = useCallback(async (captchaToken?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.guest(captchaToken);
      persistAuth(res.accessToken, res.user, res.captchaDemoMode ?? false);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not start guest session. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) await authApi.logout(token);
    } catch {
      // Swallow logout errors; local cleanup always happens
    } finally {
      sessionStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      setError(null);
    }
  }, [token]);

  const isAuthenticated = !!token && !!user && !user.isGuest;
  const isGuest = !!token && !!user && user.isGuest === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isGuest,
        isLoading,
        captchaDemoMode,
        login,
        register,
        continueAsGuest,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
