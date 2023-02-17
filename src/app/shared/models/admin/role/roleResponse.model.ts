import { FilterValues } from '../../common/FilterValues.model';
import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface RoleResponse {
  headers?: PaginationHeaders;
  body: Role[];
  sort?: string;
  filter?: FilterValues[];
  searchText?: string;
}

export interface Role {
  CompanyID: string;
  RoleID: number;
  Name: string;
  Description: string;
  Permission: Permission[];
  IsActive: boolean;
  IsAdminRole: boolean;
  CreatedBy: string;
  CreatedDate: string;
  ModifiedBy: string;
  ModifiedDate: string;
}

export interface Permission {
  CompanyID: string;
  PermissionsId: number;
  RoleID: number;
  MenuID: number;
  Name: string;
  CanView: boolean;
  CanAdd: boolean;
  CanEdit: boolean;
  CanDelete: boolean;
}
