/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalendarEventView } from './CalendarEventView';
import type { HttpStatusCode } from './HttpStatusCode';
export type StandardResponseOfCalendarEventView = {
  success?: boolean;
  message?: string | null;
  data?: CalendarEventView;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

