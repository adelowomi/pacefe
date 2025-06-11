/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserView } from './UserView';
export type OrganizationMemberView = {
  id?: string;
  organizationId?: string;
  user?: UserView;
  role?: string;
  isActive?: boolean;
  joinedDate?: string;
  dateUpdated?: string | null;
};

