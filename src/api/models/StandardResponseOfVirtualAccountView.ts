/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { VirtualAccountView } from './VirtualAccountView';
export type StandardResponseOfVirtualAccountView = {
  success?: boolean;
  message?: string | null;
  data?: VirtualAccountView;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

