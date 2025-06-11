/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DirectDebitView } from './DirectDebitView';
import type { HttpStatusCode } from './HttpStatusCode';
export type StandardResponseOfDirectDebitView = {
  success?: boolean;
  message?: string | null;
  data?: DirectDebitView;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

