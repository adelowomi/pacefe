import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { CreateCalendarEventModel } from '@/api/models/CreateCalendarEventModel';
import type { StandardResponseOfIEnumerableOfCalendarEventView } from '@/api/models/StandardResponseOfIEnumerableOfCalendarEventView';

export function useCalendarEvents(
  organizationId: string,
  calendarId: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery<StandardResponseOfIEnumerableOfCalendarEventView, Error>({
    queryKey: ['calendar-events', organizationId, calendarId, startDate, endDate],
    queryFn: () =>
      apiClient.calendar.getCalendarEventsAsync({
        organizationId,
        calendarId,
        startDate,
        endDate,
      }),
    enabled: !!organizationId && !!calendarId,
  });
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      calendarId,
      data,
    }: {
      organizationId: string;
      calendarId: string;
      data: CreateCalendarEventModel;
    }) =>
      apiClient.calendar.createEventAsync({
        organizationId,
        calendarId,
        requestBody: data,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['calendar-events', variables.organizationId, variables.calendarId],
      });
    },
  });
}

export function useImportIcsFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      calendarId,
      file,
      clearExisting = false,
    }: {
      organizationId: string;
      calendarId: string;
      file: File;
      clearExisting?: boolean;
    }) =>
      apiClient.calendar.importIcsFileAsync({
        organizationId,
        calendarId,
        formData: { icsFile: file },
        clearExisting,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['calendar-events', variables.organizationId, variables.calendarId],
      });
    },
  });
}
