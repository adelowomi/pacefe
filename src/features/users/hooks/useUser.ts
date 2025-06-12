import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiClient } from '@/api/ApiClient';
import type { UpdateUserProfileModel } from '@/api/models/UpdateUserProfileModel';
import type { ChangePasswordModel } from '@/api/models/ChangePasswordModel';
import type { InitiatePasswordResetModel } from '@/api/models/InitiatePasswordResetModel';
import type { CompletePasswordResetModel } from '@/api/models/CompletePasswordResetModel';
import { OpenAPI } from '@/api';
import axios from 'axios';
import { requestInterceptor, responseInterceptor } from '@/lib/axios-interceptors';

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

// Get user profile
export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => apiClient.user.getUserProfileAsync(),
  });
}

// Update user profile
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateUserProfileModel) => 
      apiClient.user.updateUserProfileAsync({ requestBody: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
}

// Change password
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordModel) => 
      apiClient.user.changePasswordAsync({ requestBody: data }),
  });
}

// Initiate password reset
export function useInitiatePasswordReset() {
  return useMutation({
    mutationFn: (data: InitiatePasswordResetModel) => 
      apiClient.user.initiatePasswordResetAsync({ requestBody: data }),
  });
}

// Complete password reset
export function useCompletePasswordReset() {
  return useMutation({
    mutationFn: (data: CompletePasswordResetModel) => 
      apiClient.user.completePasswordResetAsync({ requestBody: data }),
  });
}
