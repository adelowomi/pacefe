/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransferRecipientView } from './TransferRecipientView';
import type { UserView } from './UserView';
import type { UserView2 } from './UserView2';
export type TransferRequestView = {
  id?: string;
  amount?: number;
  reason?: string;
  reference?: string;
  status?: string;
  failureReason?: string | null;
  approvedDate?: string | null;
  processedDate?: string | null;
  recipient?: TransferRecipientView;
  requester?: UserView;
  approver?: UserView2;
  organizationId?: string;
  dateCreated?: string;
  dateUpdated?: string | null;
  isActive?: boolean;
};

