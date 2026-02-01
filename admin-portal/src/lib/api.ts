import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.kallaichess.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const stored = localStorage.getItem('kdca-auth');
      if (stored) {
        try {
          const { state } = JSON.parse(stored);
          if (state.refreshToken) {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'https://api.kallaichess.com/v1'}/auth/refresh`,
              { refreshToken: state.refreshToken }
            );

            const tokens = response.data;

            // Update stored tokens
            const newState = {
              ...state,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            };
            localStorage.setItem('kdca-auth', JSON.stringify({ state: newState }));

            // Retry original request
            originalRequest.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
            return api(originalRequest);
          }
        } catch {
          // Clear auth state on refresh failure
          localStorage.removeItem('kdca-auth');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);
