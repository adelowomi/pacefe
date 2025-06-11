import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';
import type { OrganizationMemberModel } from '../../../api/models/OrganizationMemberModel';

export function useOrganizationMembers(organizationId: string) {
  return useQuery({
    queryKey: ['organization-members', organizationId],
    queryFn: () => apiClient.organizationMember.getOrganizationMembersAsync({ organizationId }),
    enabled: !!organizationId,
  });
}

export function useAddOrganizationMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: OrganizationMemberModel) => 
      apiClient.organizationMember.addMemberAsync({ requestBody: data }),
    onSuccess: (_, variables) => {
      // Invalidate and refetch organization members
      queryClient.invalidateQueries({ 
        queryKey: ['organization-members', variables.organizationId] 
      });
    },
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: string }) =>
      apiClient.organizationMember.updateMemberRoleAsync({ 
        memberId, 
        requestBody: role 
      }),
    onSuccess: () => {
      // Invalidate all organization members queries
      queryClient.invalidateQueries({ 
        queryKey: ['organization-members'] 
      });
    },
  });
}

export function useRemoveOrganizationMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (memberId: string) =>
      apiClient.organizationMember.removeMemberAsync({ memberId }),
    onSuccess: () => {
      // Invalidate all organization members queries
      queryClient.invalidateQueries({ 
        queryKey: ['organization-members'] 
      });
    },
  });
}
