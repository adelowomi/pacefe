import { ApiClient } from '../api/ApiClient';
import { OpenAPI } from '../api/core/OpenAPI';
import axios from 'axios';
import { requestInterceptor, responseInterceptor } from './axios-interceptors';

// Set the base URL for the API from environment variables
const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error('VITE_API_BASE_URL environment variable is required');
}
OpenAPI.BASE = baseUrl;

// Set up axios interceptors for token handling
axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use(response => response, responseInterceptor);

// Create a shared API client instance
export const apiClient = new ApiClient({
  BASE: baseUrl,
  WITH_CREDENTIALS: false,
  CREDENTIALS: 'omit',
  TOKEN: OpenAPI.TOKEN,
});

// Export individual services for convenience
export const userService = apiClient.user;
export const dashboardService = apiClient.dashboard;
export const organizationService = apiClient.organization;
export const organizationMemberService = apiClient.organizationMember;
export const transferService = apiClient.transfer;
export const directDebitService = apiClient.directDebit;
export const calendarService = apiClient.calendar;

// Helper function to set authentication token
export const setAuthToken = (token: string) => {
  OpenAPI.TOKEN = token;
};

// Helper function to clear authentication token
export const clearAuthToken = () => {
  OpenAPI.TOKEN = undefined;
};
