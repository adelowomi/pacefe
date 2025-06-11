/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DirectDebitInitiateModel } from '../models/DirectDebitInitiateModel';
import type { StandardResponseOfboolean } from '../models/StandardResponseOfboolean';
import type { StandardResponseOfDirectDebitView } from '../models/StandardResponseOfDirectDebitView';
import type { StandardResponseOfstring } from '../models/StandardResponseOfstring';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DirectDebitService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns StandardResponseOfstring OK
   * @throws ApiError
   */
  public postApiDirectDebitInitiate({
    requestBody,
  }: {
    requestBody: DirectDebitInitiateModel,
  }): CancelablePromise<StandardResponseOfstring> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/DirectDebit/initiate',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfDirectDebitView OK
   * @throws ApiError
   */
  public getApiDirectDebitGet({
    organizationId,
  }: {
    organizationId: string,
  }): CancelablePromise<StandardResponseOfDirectDebitView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/DirectDebit/get/{organizationId}',
      path: {
        'organizationId': organizationId,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfDirectDebitView OK
   * @throws ApiError
   */
  public postApiDirectDebitCallback({
    reference,
  }: {
    reference?: string,
  }): CancelablePromise<StandardResponseOfDirectDebitView> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/DirectDebit/callback',
      query: {
        'reference': reference,
      },
      errors: {
        400: `Bad Request`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfDirectDebitView OK
   * @throws ApiError
   */
  public postApiDirectDebitDeactivate({
    directDebitId,
  }: {
    directDebitId: string,
  }): CancelablePromise<StandardResponseOfDirectDebitView> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/DirectDebit/deactivate/{directDebitId}',
      path: {
        'directDebitId': directDebitId,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfboolean OK
   * @throws ApiError
   */
  public postApiDirectDebitCharge({
    directDebitId,
    requestBody,
  }: {
    directDebitId: string,
    requestBody: number,
  }): CancelablePromise<StandardResponseOfboolean> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/DirectDebit/charge/{directDebitId}',
      path: {
        'directDebitId': directDebitId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
}
