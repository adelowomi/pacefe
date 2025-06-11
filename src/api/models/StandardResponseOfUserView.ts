/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HttpStatusCode } from './HttpStatusCode';
import type { UserView2 } from './UserView2';
export type StandardResponseOfUserView = {
  success?: boolean;
  message?: string | null;
  data?: UserView2;
  statusCode?: HttpStatusCode;
  errors?: any;
  timestamp?: string;
};

