/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { TransferRequestView2 } from './TransferRequestView2';
export type StandardResponseOfTransferRequestView = {
  success?: boolean;
  message?: string | null;
  data?: TransferRequestView2;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

