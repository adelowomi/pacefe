/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { JsonDocument } from './JsonDocument';
export type StandardResponseOfJsonDocument = {
  success?: boolean;
  message?: string | null;
  data?: JsonDocument;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

