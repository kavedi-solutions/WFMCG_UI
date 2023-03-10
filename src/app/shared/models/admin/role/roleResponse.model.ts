import { FilterValues } from '../../common/FilterValues.model';
import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface RoleResponse {
  headers?: PaginationHeaders;
  body: Role[];
}

export interface Role {
  companyID: string;
  roleID: number;
  name: string;
  description: string;
  permission: Permission[];
  isActive: boolean;
  isAdminRole: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface Permission {
  companyID: string;
  permissionsId: number;
  roleID: number;
  menuID: number;
  name: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
