/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalendarView } from './CalendarView';
import type { HttpStatusCode } from './HttpStatusCode';
export type StandardResponseOfCalendarView = {
  success?: boolean;
  message?: string | null;
  data?: CalendarView;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

