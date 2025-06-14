import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import type { StandardResponseOfVirtualAccountView } from '../../../api/models/StandardResponseOfVirtualAccountView';
import type { StandardResponseOfPagedCollectionOfVirtualAccountTransactionView } from '../../../api/models/StandardResponseOfPagedCollectionOfVirtualAccountTransactionView';

export function useRequestVirtualAccount() {
  const queryClient = useQueryClient();
  
  return useMutation<StandardResponseOfVirtualAccountView, Error, string>({
    mutationFn: (organizationId: string) => 
      apiClient.organization.assignVirtualAccountAsync({ id: organizationId }),
    onSuccess: (data, organizationId) => {
      // Invalidate organization queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['virtual-account', organizationId] });
    },
  });
}

export function useVirtualAccount(organizationId: string, enabled = true) {
  return useQuery({
    queryKey: ['virtual-account', organizationId],
    queryFn: () => apiClient.organization.getVirtualAccountAsync({ id: organizationId }),
    enabled: enabled && !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

interface VirtualAccountTransactionsParams {
  organizationId: string;
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function useVirtualAccountTransactions({
  organizationId,
  pageNumber = 1,
  pageSize = 10,
  searchTerm,
  sortBy,
  sortOrder,
}: VirtualAccountTransactionsParams) {
  return useQuery({
    queryKey: [
      'virtual-account-transactions',
      organizationId,
      pageNumber,
      pageSize,
      searchTerm,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      apiClient.organization.getVirtualAccountTransactionsAsync({
        id: organizationId,
        pageNumber,
        pageSize,
        searchTerm,
        sortBy,
        sortOrder,
      }),
    enabled: !!organizationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
