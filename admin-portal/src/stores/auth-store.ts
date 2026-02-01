import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface User {
  id: string;
  kdcaId: string | null;
  email: string;
  phone: string;
  firstName: string;
  lastName: string | null;
  role: string;
  status: string;
  organizationId: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshTokens: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (identifier: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { identifier, password });
          const { user, tokens } = response.data;

          // Set token for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;

          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || error.message || 'Login failed',
          });
          return false;
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        try {
          if (refreshToken) {
            await api.post('/auth/logout', { refreshToken });
          }
        } catch {
          // Ignore logout errors
        }

        delete api.defaults.headers.common['Authorization'];
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      refreshTokens: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const response = await api.post('/auth/refresh', { refreshToken });
          const tokens = response.data;

          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;

          set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          });

          return true;
        } catch {
          get().logout();
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'kdca-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize auth header on store rehydration
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('kdca-auth');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state.accessToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${state.accessToken}`;
      }
    } catch {
      // Ignore parse errors
    }
  }
}
