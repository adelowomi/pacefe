import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../../lib/api-client';
import type { DashboardView } from '../../../api/models/DashboardView';

export const useDashboard = (organizationId?: string) => {
  return useQuery({
    queryKey: ['dashboard', organizationId],
    queryFn: async () => {
      const response = await dashboardService.getApiDashboardGet({
        organizationId: organizationId || undefined,
      });
      return response.data as DashboardView;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};
