/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { TransferRequestView } from './TransferRequestView';
export type StandardResponseOfListOfTransferRequestView = {
  success?: boolean;
  message?: string | null;
  data?: Array<TransferRequestView> | null;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

