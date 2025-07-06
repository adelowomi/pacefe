import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import type { StandardResponseOfListOfTransferRequestView } from '../../../api/models/StandardResponseOfListOfTransferRequestView';
import type { StandardResponseOfPagedCollectionOfTransferRequestView } from '../../../api/models/StandardResponseOfPagedCollectionOfTransferRequestView';
import type { StandardResponseOfTransferRequestView } from '../../../api/models/StandardResponseOfTransferRequestView';
import type { CreateTransferRequestModel } from '../../../api/models/CreateTransferRequestModel';

export interface TransferRequestFilters {
  pageNumber?: number;
  pageSize?: number;
  statuses?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  requesterId?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useTransferRequests(organizationId: string, filters?: TransferRequestFilters) {
  return useQuery<StandardResponseOfPagedCollectionOfTransferRequestView, Error>({
    queryKey: ['transfer-requests-v2', organizationId, filters],
    queryFn: () => apiClient.transfer.getApiTransferV2RequestOrganization({ 
      organizationId,
      pageNumber: filters?.pageNumber || 1,
      pageSize: filters?.pageSize || 20,
      statuses: filters?.statuses,
      dateFrom: filters?.dateFrom,
      dateTo: filters?.dateTo,
      minAmount: filters?.minAmount,
      maxAmount: filters?.maxAmount,
      requesterId: filters?.requesterId,
      searchTerm: filters?.searchTerm,
      sortBy: filters?.sortBy,
      sortOrder: filters?.sortOrder,
    }),
    enabled: !!organizationId,
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Legacy hook for backward compatibility
export function useTransferRequestsLegacy(organizationId: string) {
  return useQuery<StandardResponseOfListOfTransferRequestView, Error>({
    queryKey: ['transfer-requests', organizationId],
    queryFn: () => apiClient.transfer.getApiTransferRequestOrganization({ organizationId }),
    enabled: !!organizationId,
  });
}

export function useTransferRequest(requestId: string) {
  return useQuery<StandardResponseOfTransferRequestView, Error>({
    queryKey: ['transfer-request', requestId],
    queryFn: () => apiClient.transfer.getApiTransferRequest({ requestId }),
    enabled: !!requestId,
  });
}

export function useCreateTransferRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTransferRequestModel) => 
      apiClient.transfer.postApiTransferRequestCreate({ requestBody: data }),
    onSuccess: (data) => {
      // Invalidate and refetch transfer requests (both V1 and V2)
      if (data.data?.organizationId) {
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-requests', data.data.organizationId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-requests-v2', data.data.organizationId] 
        });
      }
    },
  });
}

export function useApproveTransferRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (requestId: string) => 
      apiClient.transfer.postApiTransferRequestApprove({ requestId }),
    onSuccess: (data) => {
      // Invalidate and refetch transfer requests (both V1 and V2)
      if (data.data?.organizationId) {
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-requests', data.data.organizationId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-requests-v2', data.data.organizationId] 
        });
      }
      // Also invalidate the specific request
      if (data.data?.id) {
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-request', data.data.id] 
        });
      }
    },
  });
}

export function useRejectTransferRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason: string }) => 
      apiClient.transfer.postApiTransferRequestReject({ requestId, requestBody: reason }),
    onSuccess: (data) => {
      // Invalidate and refetch transfer requests (both V1 and V2)
      if (data.data?.organizationId) {
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-requests', data.data.organizationId] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-requests-v2', data.data.organizationId] 
        });
      }
      // Also invalidate the specific request
      if (data.data?.id) {
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-request', data.data.id] 
        });
      }
    },
  });
}
