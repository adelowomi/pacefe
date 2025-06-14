/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { PagedCollectionOfVirtualAccountTransactionView } from './PagedCollectionOfVirtualAccountTransactionView';
export type StandardResponseOfPagedCollectionOfVirtualAccountTransactionView = {
  success?: boolean;
  message?: string | null;
  data?: PagedCollectionOfVirtualAccountTransactionView;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

