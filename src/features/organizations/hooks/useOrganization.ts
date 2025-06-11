import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import type { StandardResponseOfOrganizationView } from '../../../api/models/StandardResponseOfOrganizationView';

export function useOrganization(organizationId: string) {
  return useQuery<StandardResponseOfOrganizationView, Error>({
    queryKey: ['organization', organizationId],
    queryFn: () => apiClient.organization.getOrganizationAsync({ organizationId }),
    enabled: !!organizationId,
  });
}

export function useOrganizations(params?: {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  return useQuery({
    queryKey: ['organizations', params],
    queryFn: () => apiClient.organization.getOrganizationsAsync(params || {}),
  });
}
