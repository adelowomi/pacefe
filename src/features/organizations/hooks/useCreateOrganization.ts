import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import type { OrganizationModel } from '../../../api/models/OrganizationModel';
import type { StandardResponseOfOrganizationView } from '../../../api/models/StandardResponseOfOrganizationView';

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation<StandardResponseOfOrganizationView, Error, OrganizationModel>({
    mutationFn: (organizationData: OrganizationModel) =>
      apiClient.organization.createOrganizationAsync({ requestBody: organizationData }),
    onSuccess: () => {
      // Invalidate and refetch organization queries
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
