import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import type { StandardResponseOfListOfTransferRequestView } from '../../../api/models/StandardResponseOfListOfTransferRequestView';
import type { StandardResponseOfTransferRequestView } from '../../../api/models/StandardResponseOfTransferRequestView';
import type { CreateTransferRequestModel } from '../../../api/models/CreateTransferRequestModel';

export function useTransferRequests(organizationId: string) {
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
      // Invalidate and refetch transfer requests
      if (data.data?.organizationId) {
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-requests', data.data.organizationId] 
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
      // Invalidate and refetch transfer requests
      if (data.data?.organizationId) {
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-requests', data.data.organizationId] 
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
      // Invalidate and refetch transfer requests
      if (data.data?.organizationId) {
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-requests', data.data.organizationId] 
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
