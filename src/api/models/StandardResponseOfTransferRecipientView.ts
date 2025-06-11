/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { TransferRecipientView2 } from './TransferRecipientView2';
export type StandardResponseOfTransferRecipientView = {
  success?: boolean;
  message?: string | null;
  data?: TransferRecipientView2;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

