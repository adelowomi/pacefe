/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessTokenResponse } from '../models/AccessTokenResponse';
import type { ChangePasswordModel } from '../models/ChangePasswordModel';
import type { CompletePasswordResetModel } from '../models/CompletePasswordResetModel';
import type { ForgotPasswordRequest } from '../models/ForgotPasswordRequest';
import type { InfoRequest } from '../models/InfoRequest';
import type { InfoResponse } from '../models/InfoResponse';
import type { InitiatePasswordResetModel } from '../models/InitiatePasswordResetModel';
import type { LoginRequest } from '../models/LoginRequest';
import type { RefreshRequest } from '../models/RefreshRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { RegisterRequest2 } from '../models/RegisterRequest2';
import type { ResendConfirmationEmailRequest } from '../models/ResendConfirmationEmailRequest';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { StandardResponseOfstring } from '../models/StandardResponseOfstring';
import type { StandardResponseOfUserView } from '../models/StandardResponseOfUserView';
import type { TwoFactorRequest } from '../models/TwoFactorRequest';
import type { TwoFactorResponse } from '../models/TwoFactorResponse';
import type { UpdateUserProfileModel } from '../models/UpdateUserProfileModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UserService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Confirms a user's email address using the token sent during registration
   * @returns string OK
   * @throws ApiError
   */
  public confirmEmailAlt({
    userId,
    token,
  }: {
    userId: string,
    token: string,
  }): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/auth/confirm/email/alt',
      query: {
        'userId': userId,
        'token': token,
      },
      errors: {
        400: `Bad Request`,
      },
    });
  }
  /**
   * Register a new user with additional profile information
   * @returns string OK
   * @throws ApiError
   */
  public registerAlt({
    requestBody,
  }: {
    requestBody: RegisterRequest,
  }): CancelablePromise<string> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/register/alt',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
      },
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public postApiAuthRegister({
    requestBody,
  }: {
    requestBody: RegisterRequest2,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/register',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
      },
    });
  }
  /**
   * @returns AccessTokenResponse OK
   * @throws ApiError
   */
  public postApiAuthLogin({
    requestBody,
    useCookies,
    useSessionCookies,
  }: {
    requestBody: LoginRequest,
    useCookies?: boolean,
    useSessionCookies?: boolean,
  }): CancelablePromise<AccessTokenResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/login',
      query: {
        'useCookies': useCookies,
        'useSessionCookies': useSessionCookies,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns AccessTokenResponse OK
   * @throws ApiError
   */
  public postApiAuthRefresh({
    requestBody,
  }: {
    requestBody: RefreshRequest,
  }): CancelablePromise<AccessTokenResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/refresh',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public mapIdentityApiApiAuthConfirmEmail({
    userId,
    code,
    changedEmail,
  }: {
    userId: string,
    code: string,
    changedEmail?: string,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/auth/confirmEmail',
      query: {
        'userId': userId,
        'code': code,
        'changedEmail': changedEmail,
      },
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public postApiAuthResendConfirmationEmail({
    requestBody,
  }: {
    requestBody: ResendConfirmationEmailRequest,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/resendConfirmationEmail',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public postApiAuthForgotPassword({
    requestBody,
  }: {
    requestBody: ForgotPasswordRequest,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/forgotPassword',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
      },
    });
  }
  /**
   * @returns any OK
   * @throws ApiError
   */
  public postApiAuthResetPassword({
    requestBody,
  }: {
    requestBody: ResetPasswordRequest,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/resetPassword',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
      },
    });
  }
  /**
   * @returns TwoFactorResponse OK
   * @throws ApiError
   */
  public postApiAuthManage2Fa({
    requestBody,
  }: {
    requestBody: TwoFactorRequest,
  }): CancelablePromise<TwoFactorResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/manage/2fa',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @returns InfoResponse OK
   * @throws ApiError
   */
  public getApiAuthManageInfo(): CancelablePromise<InfoResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/auth/manage/info',
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @returns InfoResponse OK
   * @throws ApiError
   */
  public postApiAuthManageInfo({
    requestBody,
  }: {
    requestBody: InfoRequest,
  }): CancelablePromise<InfoResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/manage/info',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
        404: `Not Found`,
      },
    });
  }
  /**
   * @returns StandardResponseOfUserView OK
   * @throws ApiError
   */
  public getUserProfileAsync(): CancelablePromise<StandardResponseOfUserView> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/User/profile',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfUserView OK
   * @throws ApiError
   */
  public updateUserProfileAsync({
    requestBody,
  }: {
    requestBody: UpdateUserProfileModel,
  }): CancelablePromise<StandardResponseOfUserView> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/User/profile',
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
   * @returns StandardResponseOfstring OK
   * @throws ApiError
   */
  public initiatePasswordResetAsync({
    requestBody,
  }: {
    requestBody: InitiatePasswordResetModel,
  }): CancelablePromise<StandardResponseOfstring> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/User/password/initiate-reset',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfstring OK
   * @throws ApiError
   */
  public completePasswordResetAsync({
    requestBody,
  }: {
    requestBody: CompletePasswordResetModel,
  }): CancelablePromise<StandardResponseOfstring> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/User/password/complete-reset',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad Request`,
        500: `Internal Server Error`,
      },
    });
  }
  /**
   * @returns StandardResponseOfstring OK
   * @throws ApiError
   */
  public changePasswordAsync({
    requestBody,
  }: {
    requestBody: ChangePasswordModel,
  }): CancelablePromise<StandardResponseOfstring> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/User/password/change',
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
