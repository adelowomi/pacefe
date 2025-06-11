/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { OrganizationMemberView2 } from './OrganizationMemberView2';
export type StandardResponseOfOrganizationMemberView = {
  success?: boolean;
  message?: string | null;
  data?: OrganizationMemberView2;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

