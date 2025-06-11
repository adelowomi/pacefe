/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrganizationMemberView } from './OrganizationMemberView';
import type { OrganizationView } from './OrganizationView';
import type { OrganizationView2 } from './OrganizationView2';
import type { TransferRequestView } from './TransferRequestView';
import type { UserView } from './UserView';
export type DashboardView = {
  currentUser?: UserView;
  organizations?: Array<OrganizationView> | null;
  currentOrganization?: OrganizationView2;
  role?: string;
  totalTransfersAmount?: number | null;
  pendingTransfersCount?: number;
  successfulTransfersCount?: number;
  hasActiveDirectDebit?: boolean;
  lastDirectDebitAmount?: number | null;
  lastDirectDebitDate?: string | null;
  recentTransfers?: Array<TransferRequestView> | null;
  teamMembers?: Array<OrganizationMemberView> | null;
};

