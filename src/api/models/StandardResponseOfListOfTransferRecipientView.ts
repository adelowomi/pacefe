/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { TransferRecipientView } from './TransferRecipientView';
export type StandardResponseOfListOfTransferRecipientView = {
  success?: boolean;
  message?: string | null;
  data?: Array<TransferRecipientView> | null;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

