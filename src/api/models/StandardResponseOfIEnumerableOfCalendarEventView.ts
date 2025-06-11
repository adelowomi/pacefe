/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalendarEventView2 } from './CalendarEventView2';
import type { HttpStatusCode } from './HttpStatusCode';
export type StandardResponseOfIEnumerableOfCalendarEventView = {
  success?: boolean;
  message?: string | null;
  data?: Array<CalendarEventView2> | null;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

