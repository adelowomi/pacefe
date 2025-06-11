import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import type { StandardResponseOfListOfTransferRecipientView } from '../../../api/models/StandardResponseOfListOfTransferRecipientView';
import type { StandardResponseOfTransferRecipientView } from '../../../api/models/StandardResponseOfTransferRecipientView';
import type { StandardResponseOfListOfBankView } from '../../../api/models/StandardResponseOfListOfBankView';
import type { CreateTransferRecipientModel } from '../../../api/models/CreateTransferRecipientModel';

export function useTransferRecipients(organizationId: string) {
  return useQuery<StandardResponseOfListOfTransferRecipientView, Error>({
    queryKey: ['transfer-recipients', organizationId],
    queryFn: () => apiClient.transfer.getApiTransferRecipientsOrganization({ organizationId }),
    enabled: !!organizationId,
  });
}

export function useTransferRecipient(recipientId: string) {
  return useQuery<StandardResponseOfTransferRecipientView, Error>({
    queryKey: ['transfer-recipient', recipientId],
    queryFn: () => apiClient.transfer.getApiTransferRecipients({ recipientId }),
    enabled: !!recipientId,
  });
}

export function useBanks() {
  return useQuery<StandardResponseOfListOfBankView, Error>({
    queryKey: ['banks'],
    queryFn: () => apiClient.transfer.getApiTransferRecipientsBanks(),
    staleTime: 1000 * 60 * 60, // 1 hour - banks don't change often
  });
}

export function useCreateTransferRecipient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTransferRecipientModel) => 
      apiClient.transfer.postApiTransferRecipientsCreate({ requestBody: data }),
    onSuccess: (data) => {
      // Invalidate and refetch transfer recipients
      if (data.data?.organizationId) {
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-recipients', data.data.organizationId] 
        });
      }
    },
  });
}

export function useVerifyAccount() {
  return useMutation({
    mutationFn: ({ accountNumber, bankCode }: { accountNumber: string; bankCode: string }) => 
      apiClient.transfer.postApiTransferRecipientsVerifyAccount({ accountNumber, bankCode }),
  });
}

export function useDeleteTransferRecipient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (recipientId: string) => 
      apiClient.transfer.deleteApiTransferRecipients({ recipientId }),
    onSuccess: (data) => {
      // Invalidate and refetch transfer recipients
      if (data.data?.organizationId) {
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-recipients', data.data.organizationId] 
        });
      }
      // Also invalidate the specific recipient
      if (data.data?.id) {
        queryClient.invalidateQueries({ 
          queryKey: ['transfer-recipient', data.data.id] 
        });
      }
    },
  });
}
