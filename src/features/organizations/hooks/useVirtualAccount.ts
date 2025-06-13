import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import type { StandardResponseOfVirtualAccountView } from '../../../api/models/StandardResponseOfVirtualAccountView';

export function useRequestVirtualAccount() {
  const queryClient = useQueryClient();
  
  return useMutation<StandardResponseOfVirtualAccountView, Error, string>({
    mutationFn: (organizationId: string) => 
      apiClient.organization.assignVirtualAccountAsync({ id: organizationId }),
    onSuccess: (data, organizationId) => {
      // Invalidate organization queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}
