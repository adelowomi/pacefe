/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { PagedCollectionOfOrganizationView } from './PagedCollectionOfOrganizationView';
export type StandardResponseOfPagedCollectionOfOrganizationView = {
  success?: boolean;
  message?: string | null;
  data?: PagedCollectionOfOrganizationView;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

