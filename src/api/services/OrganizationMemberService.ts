/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrganizationMemberModel } from '../models/OrganizationMemberModel';
import type { StandardResponseOfboolean } from '../models/StandardResponseOfboolean';
import type { StandardResponseOfIEnumerableOfOrganizationMemberView } from '../models/StandardResponseOfIEnumerableOfOrganizationMemberView';
import type { StandardResponseOfOrganizationMemberView } from '../models/StandardResponseOfOrganizationMemberView';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class OrganizationMemberService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns StandardResponseOfOrganizationMemberView OK
   * @throws ApiError
   */
  public addMemberAsync({
    requestBody,
  }: {
    requestBody: OrganizationMemberModel,
  }): CancelablePromise<StandardResponseOfOrganizationMemberView> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/OrganizationMember/add',
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
  /**
   * @returns StandardResponseOfOrganizationMemberView OK
   * @throws ApiError
   */
  public updateMemberRoleAsync({
    memberId,
    requestBody,
  }: {
    memberId: string,
    requestBody: string,
  }): CancelablePromise<StandardResponseOfOrganizationMemberView> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/OrganizationMember/update-role/{memberId}',
      path: {
        'memberId': memberId,
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
  /**
   * @returns StandardResponseOfboolean OK
   * @throws ApiError
   */
  public removeMemberAsync({
    memberId,
  }: {
    memberId: string,
  }): CancelablePromise<StandardResponseOfboolean> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/api/OrganizationMember/remove/{memberId}',
      path: {
        'memberId': memberId,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfIEnumerableOfOrganizationMemberView OK
   * @throws ApiError
   */
  public getOrganizationMembersAsync({
    organizationId,
  }: {
    organizationId: string,
  }): CancelablePromise<StandardResponseOfIEnumerableOfOrganizationMemberView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/OrganizationMember/list/{organizationId}',
      path: {
        'organizationId': organizationId,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfOrganizationMemberView OK
   * @throws ApiError
   */
  public getMemberAsync({
    memberId,
  }: {
    memberId: string,
  }): CancelablePromise<StandardResponseOfOrganizationMemberView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/OrganizationMember/get/{memberId}',
      path: {
        'memberId': memberId,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
}
