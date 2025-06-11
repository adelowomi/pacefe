import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { CreateCalendarModel } from '@/api/models/CreateCalendarModel';
import type { StandardResponseOfCalendarView } from '@/api/models/StandardResponseOfCalendarView';

export function useCreateCalendar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ organizationId, data }: { organizationId: string; data: CreateCalendarModel }) =>
      apiClient.calendar.createCalendarAsync({ organizationId, requestBody: data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['calendars'] });
      // Also invalidate the organization owner calendar in case this becomes the default
      queryClient.invalidateQueries({ queryKey: ['organization-owner-calendar', variables.organizationId] });
    },
  });
}

export function useCalendar(organizationId: string, calendarId: string) {
  return useQuery<StandardResponseOfCalendarView, Error>({
    queryKey: ['calendar', organizationId, calendarId],
    queryFn: () => apiClient.calendar.getCalendarAsync({ organizationId, calendarId }),
    enabled: !!organizationId && !!calendarId,
  });
}

export function useOrganizationOwnerCalendar(organizationId: string) {
  return useQuery<StandardResponseOfCalendarView, Error>({
    queryKey: ['organization-owner-calendar', organizationId],
    queryFn: () => apiClient.calendar.getOrganizationOwnerCalendarAsync({ organizationId }),
    enabled: !!organizationId,
  });
}
