/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { OrganizationMemberView } from './OrganizationMemberView';
export type StandardResponseOfIEnumerableOfOrganizationMemberView = {
  success?: boolean;
  message?: string | null;
  data?: Array<OrganizationMemberView> | null;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

