/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTransferRecipientModel } from '../models/CreateTransferRecipientModel';
import type { CreateTransferRequestModel } from '../models/CreateTransferRequestModel';
import type { StandardResponseOfJsonDocument } from '../models/StandardResponseOfJsonDocument';
import type { StandardResponseOfListOfBankView } from '../models/StandardResponseOfListOfBankView';
import type { StandardResponseOfListOfTransferRecipientView } from '../models/StandardResponseOfListOfTransferRecipientView';
import type { StandardResponseOfListOfTransferRequestView } from '../models/StandardResponseOfListOfTransferRequestView';
import type { StandardResponseOfPagedCollectionOfTransferRequestView } from '../models/StandardResponseOfPagedCollectionOfTransferRequestView';
import type { StandardResponseOfTransferRecipientView } from '../models/StandardResponseOfTransferRecipientView';
import type { StandardResponseOfTransferRequestView } from '../models/StandardResponseOfTransferRequestView';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TransferService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns StandardResponseOfJsonDocument OK
   * @throws ApiError
   */
  public postApiTransferRecipientsVerifyAccount({
    accountNumber,
    bankCode,
  }: {
    accountNumber?: string,
    bankCode?: string,
  }): CancelablePromise<StandardResponseOfJsonDocument> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/Transfer/recipients/verify-account',
      query: {
        'accountNumber': accountNumber,
        'bankCode': bankCode,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfTransferRecipientView OK
   * @throws ApiError
   */
  public postApiTransferRecipientsCreate({
    requestBody,
  }: {
    requestBody: CreateTransferRecipientModel,
  }): CancelablePromise<StandardResponseOfTransferRecipientView> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/Transfer/recipients/create',
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
   * @returns StandardResponseOfListOfTransferRecipientView OK
   * @throws ApiError
   */
  public getApiTransferRecipientsOrganization({
    organizationId,
  }: {
    organizationId: string,
  }): CancelablePromise<StandardResponseOfListOfTransferRecipientView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/Transfer/recipients/organization/{organizationId}',
      path: {
        'organizationId': organizationId,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfTransferRecipientView OK
   * @throws ApiError
   */
  public getApiTransferRecipients({
    recipientId,
  }: {
    recipientId: string,
  }): CancelablePromise<StandardResponseOfTransferRecipientView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/Transfer/recipients/{recipientId}',
      path: {
        'recipientId': recipientId,
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
   * @returns StandardResponseOfTransferRecipientView OK
   * @throws ApiError
   */
  public deleteApiTransferRecipients({
    recipientId,
  }: {
    recipientId: string,
  }): CancelablePromise<StandardResponseOfTransferRecipientView> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/Transfer/recipients/{recipientId}',
      path: {
        'recipientId': recipientId,
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
   * @returns StandardResponseOfListOfBankView OK
   * @throws ApiError
   */
  public getApiTransferRecipientsBanks(): CancelablePromise<StandardResponseOfListOfBankView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/Transfer/recipients/banks',
      errors: {
        401: `Unauthorized`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfTransferRequestView OK
   * @throws ApiError
   */
  public postApiTransferRequestCreate({
    requestBody,
  }: {
    requestBody: CreateTransferRequestModel,
  }): CancelablePromise<StandardResponseOfTransferRequestView> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/Transfer/request/create',
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
   * @returns StandardResponseOfListOfTransferRequestView OK
   * @throws ApiError
   */
  public getApiTransferRequestOrganization({
    organizationId,
  }: {
    organizationId: string,
  }): CancelablePromise<StandardResponseOfListOfTransferRequestView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/Transfer/request/organization/{organizationId}',
      path: {
        'organizationId': organizationId,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfPagedCollectionOfTransferRequestView OK
   * @throws ApiError
   */
  public getApiTransferV2RequestOrganization({
    organizationId,
    pageNumber = 1,
    pageSize = 10,
    statuses = null,
    dateFrom = null,
    dateTo = null,
    minAmount = null,
    maxAmount = null,
    requesterId = null,
    searchTerm = null,
    sortBy = null,
    sortOrder = null,
  }: {
    organizationId: string,
    pageNumber?: number,
    pageSize?: number,
    statuses?: string,
    dateFrom?: string,
    dateTo?: string,
    minAmount?: number,
    maxAmount?: number,
    requesterId?: string,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string,
  }): CancelablePromise<StandardResponseOfPagedCollectionOfTransferRequestView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/Transfer/v2/request/organization/{organizationId}',
      path: {
        'organizationId': organizationId,
      },
      query: {
        'pageNumber': pageNumber,
        'pageSize': pageSize,
        'statuses': statuses,
        'dateFrom': dateFrom,
        'dateTo': dateTo,
        'minAmount': minAmount,
        'maxAmount': maxAmount,
        'requesterId': requesterId,
        'searchTerm': searchTerm,
        'sortBy': sortBy,
        'sortOrder': sortOrder,
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
   * @returns StandardResponseOfTransferRequestView OK
   * @throws ApiError
   */
  public getApiTransferRequest({
    requestId,
  }: {
    requestId: string,
  }): CancelablePromise<StandardResponseOfTransferRequestView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/Transfer/request/{requestId}',
      path: {
        'requestId': requestId,
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
   * @returns StandardResponseOfTransferRequestView OK
   * @throws ApiError
   */
  public postApiTransferRequestApprove({
    requestId,
  }: {
    requestId: string,
  }): CancelablePromise<StandardResponseOfTransferRequestView> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/Transfer/request/{requestId}/approve',
      path: {
        'requestId': requestId,
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
   * @returns StandardResponseOfTransferRequestView OK
   * @throws ApiError
   */
  public postApiTransferRequestReject({
    requestId,
    requestBody,
  }: {
    requestId: string,
    requestBody: string,
  }): CancelablePromise<StandardResponseOfTransferRequestView> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/Transfer/request/{requestId}/reject',
      path: {
        'requestId': requestId,
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
