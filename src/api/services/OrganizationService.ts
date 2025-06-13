/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrganizationModel } from '../models/OrganizationModel';
import type { StandardResponseOfOrganizationView } from '../models/StandardResponseOfOrganizationView';
import type { StandardResponseOfPagedCollectionOfOrganizationView } from '../models/StandardResponseOfPagedCollectionOfOrganizationView';
import type { StandardResponseOfVirtualAccountView } from '../models/StandardResponseOfVirtualAccountView';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class OrganizationService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns StandardResponseOfOrganizationView OK
   * @throws ApiError
   */
  public createOrganizationAsync({
    requestBody,
  }: {
    requestBody: OrganizationModel,
  }): CancelablePromise<StandardResponseOfOrganizationView> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/Organization/create',
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
   * @returns StandardResponseOfOrganizationView OK
   * @throws ApiError
   */
  public getOrganizationAsync({
    organizationId,
  }: {
    organizationId: string,
  }): CancelablePromise<StandardResponseOfOrganizationView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/Organization/get/{organizationId}',
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
   * @returns StandardResponseOfPagedCollectionOfOrganizationView OK
   * @throws ApiError
   */
  public getOrganizationsAsync({
    pageNumber,
    pageSize,
    searchTerm,
    sortBy,
    sortOrder,
  }: {
    pageNumber?: number,
    pageSize?: number,
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string,
  }): CancelablePromise<StandardResponseOfPagedCollectionOfOrganizationView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/Organization/list',
      query: {
        'PageNumber': pageNumber,
        'PageSize': pageSize,
        'SearchTerm': searchTerm,
        'SortBy': sortBy,
        'SortOrder': sortOrder,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfVirtualAccountView OK
   * @throws ApiError
   */
  public assignVirtualAccountAsync({
    id,
  }: {
    id: string,
  }): CancelablePromise<StandardResponseOfVirtualAccountView> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/Organization/{id}/virtual-account',
      path: {
        'id': id,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
}
