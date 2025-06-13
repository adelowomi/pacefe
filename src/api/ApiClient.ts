/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';
import { CalendarService } from './services/CalendarService';
import { DashboardService } from './services/DashboardService';
import { DirectDebitService } from './services/DirectDebitService';
import { OrganizationService } from './services/OrganizationService';
import { OrganizationMemberService } from './services/OrganizationMemberService';
import { TransferService } from './services/TransferService';
import { UserService } from './services/UserService';
import { WebhookService } from './services/WebhookService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class ApiClient {
  public readonly calendar: CalendarService;
  public readonly dashboard: DashboardService;
  public readonly directDebit: DirectDebitService;
  public readonly organization: OrganizationService;
  public readonly organizationMember: OrganizationMemberService;
  public readonly transfer: TransferService;
  public readonly user: UserService;
  public readonly webhook: WebhookService;
  public readonly request: BaseHttpRequest;
  constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? 'http://pace-api-c8gqe6g7ckbfcjhc.canadacentral-01.azurewebsites.net:80',
      VERSION: config?.VERSION ?? '1.0.0',
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? 'include',
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    });
    this.calendar = new CalendarService(this.request);
    this.dashboard = new DashboardService(this.request);
    this.directDebit = new DirectDebitService(this.request);
    this.organization = new OrganizationService(this.request);
    this.organizationMember = new OrganizationMemberService(this.request);
    this.transfer = new TransferService(this.request);
    this.user = new UserService(this.request);
    this.webhook = new WebhookService(this.request);
  }
}

