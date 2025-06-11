/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StandardResponseOfDashboardView } from '../models/StandardResponseOfDashboardView';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DashboardService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns StandardResponseOfDashboardView OK
   * @throws ApiError
   */
  public getApiDashboardGet({
    organizationId = null,
  }: {
    organizationId?: string,
  }): CancelablePromise<StandardResponseOfDashboardView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/Dashboard/get',
      query: {
        'organizationId': organizationId,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
}
