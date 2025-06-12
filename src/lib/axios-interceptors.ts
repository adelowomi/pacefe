import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { AuthConfig } from './auth-config';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add auth token
export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = AuthConfig.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor to handle token refresh
export const responseInterceptor = async (error: any) => {
  const originalRequest = error.config;

  // If error is not 401 or request already retried, reject
  if (!error.response || error.response.status !== 401 || originalRequest._retry) {
    return Promise.reject(error);
  }

  if (isRefreshing) {
    // If already refreshing, queue this request
    try {
      const token = await new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return axios(originalRequest);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // Start refreshing process
  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const refreshToken = AuthConfig.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Make direct axios call to avoid circular dependency
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const refreshResponse = await axios.post(`${baseUrl}/api/auth/refresh`, {
      refreshToken
    });

    const response = refreshResponse.data;

    // Store new tokens
    AuthConfig.setTokens({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      tokenType: response.tokenType || 'Bearer',
      expiresIn: response.expiresIn
    });

    // Process queued requests
    processQueue(null, response.accessToken);

    // Retry original request
    originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
    return axios(originalRequest);
  } catch (refreshError) {
    // If refresh fails, clear tokens and reject all queued requests
    processQueue(refreshError, null);
    AuthConfig.clearTokens();
    AuthConfig.logout();
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
};
