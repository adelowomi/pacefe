/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class WebhookService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns any OK
   * @throws ApiError
   */
  public postApiWebhookPaystack(): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/Webhook/paystack',
    });
  }
}
