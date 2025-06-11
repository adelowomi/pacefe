/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BankView } from './BankView';
import type { HttpStatusCode } from './HttpStatusCode';
export type StandardResponseOfListOfBankView = {
  success?: boolean;
  message?: string | null;
  data?: Array<BankView> | null;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

