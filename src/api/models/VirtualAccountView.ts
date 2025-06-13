/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VirtualAccountStatus } from './VirtualAccountStatus';
export type VirtualAccountView = {
  id?: string;
  organizationId?: string;
  organizationName?: string;
  paystackCustomerCode?: string;
  paystackCustomerId?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  bankSlug?: string;
  bankId?: number;
  currency?: string;
  status?: VirtualAccountStatus;
  isActive?: boolean;
  requestedAt?: string | null;
  paystackAccountId?: number;
  assignedAt?: string | null;
  splitConfig?: string | null;
  metadata?: string | null;
  accountType?: string;
  isExpired?: boolean;
  expiredAt?: string | null;
  dateCreated?: string;
  dateUpdated?: string | null;
};

