/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { PagedCollectionOfTransferRequestView } from './PagedCollectionOfTransferRequestView';
export type StandardResponseOfPagedCollectionOfTransferRequestView = {
  success?: boolean;
  message?: string | null;
  data?: PagedCollectionOfTransferRequestView;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

