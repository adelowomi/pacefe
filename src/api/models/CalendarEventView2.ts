/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserView } from './UserView';
export type CalendarEventView2 = {
  id?: string;
  title: string;
  description?: string | null;
  startTime?: string;
  endTime?: string;
  isAllDay?: boolean;
  location?: string | null;
  recurrenceRule?: string | null;
  status?: string;
  createdBy?: UserView;
  dateCreated?: string;
  dateUpdated?: string | null;
  isActive?: boolean;
};

