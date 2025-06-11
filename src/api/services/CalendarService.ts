/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCalendarEventModel } from '../models/CreateCalendarEventModel';
import type { CreateCalendarModel } from '../models/CreateCalendarModel';
import type { StandardResponseOfCalendarEventView } from '../models/StandardResponseOfCalendarEventView';
import type { StandardResponseOfCalendarView } from '../models/StandardResponseOfCalendarView';
import type { StandardResponseOfIEnumerableOfCalendarEventView } from '../models/StandardResponseOfIEnumerableOfCalendarEventView';
import type { StandardResponseOfstring } from '../models/StandardResponseOfstring';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CalendarService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * @returns StandardResponseOfCalendarView OK
   * @throws ApiError
   */
  public createCalendarAsync({
    organizationId,
    requestBody,
  }: {
    organizationId: string,
    requestBody: CreateCalendarModel,
  }): CancelablePromise<StandardResponseOfCalendarView> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/organization/{organizationId}/calendars/create',
      path: {
        'organizationId': organizationId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfCalendarView OK
   * @throws ApiError
   */
  public getCalendarAsync({
    organizationId,
    calendarId,
  }: {
    organizationId: string,
    calendarId: string,
  }): CancelablePromise<StandardResponseOfCalendarView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/organization/{organizationId}/calendars/get/{calendarId}',
      path: {
        'organizationId': organizationId,
        'calendarId': calendarId,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfCalendarView OK
   * @throws ApiError
   */
  public getOrganizationOwnerCalendarAsync({
    organizationId,
  }: {
    organizationId: string,
  }): CancelablePromise<StandardResponseOfCalendarView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/organization/{organizationId}/calendars/owner',
      path: {
        'organizationId': organizationId,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfCalendarEventView OK
   * @throws ApiError
   */
  public createEventAsync({
    organizationId,
    calendarId,
    requestBody,
  }: {
    organizationId: string,
    calendarId: string,
    requestBody: CreateCalendarEventModel,
  }): CancelablePromise<StandardResponseOfCalendarEventView> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/organization/{organizationId}/calendars/{calendarId}/events/create',
      path: {
        'organizationId': organizationId,
        'calendarId': calendarId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfIEnumerableOfCalendarEventView OK
   * @throws ApiError
   */
  public getCalendarEventsAsync({
    organizationId,
    calendarId,
    startDate = null,
    endDate = null,
  }: {
    organizationId: string,
    calendarId: string,
    startDate?: string,
    endDate?: string,
  }): CancelablePromise<StandardResponseOfIEnumerableOfCalendarEventView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/organization/{organizationId}/calendars/{calendarId}/events/list',
      path: {
        'organizationId': organizationId,
        'calendarId': calendarId,
      },
      query: {
        'startDate': startDate,
        'endDate': endDate,
      },
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfstring OK
   * @throws ApiError
   */
  public importIcsFileAsync({
    organizationId,
    calendarId,
    formData,
    clearExisting = false,
  }: {
    organizationId: string,
    calendarId: string,
    formData: {
      icsFile?: Blob;
    },
    clearExisting?: boolean,
  }): CancelablePromise<StandardResponseOfstring> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/organization/{organizationId}/calendars/{calendarId}/import-ics',
      path: {
        'organizationId': organizationId,
        'calendarId': calendarId,
      },
      query: {
        'clearExisting': clearExisting,
      },
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
}
