/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DashboardView } from './DashboardView';
import type { HttpStatusCode } from './HttpStatusCode';
export type StandardResponseOfDashboardView = {
  success?: boolean;
  message?: string | null;
  data?: DashboardView;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

