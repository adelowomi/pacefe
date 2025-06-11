/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { OrganizationView2 } from './OrganizationView2';
export type StandardResponseOfOrganizationView = {
  success?: boolean;
  message?: string | null;
  data?: OrganizationView2;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

