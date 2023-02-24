import { FilterValues } from '../../common/FilterValues.model';
import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface UserResponse {
  headers?: PaginationHeaders;
  body: User[];
  sort?: string;
  filter?: FilterValues[];
  searchText?: string;
}

export interface User {
  companyID: string;
  userID: string;
  firstName: string;
  lastName: string;
  userName: string;
  roleID: number;
  RoleName: string;
  isCompanyOwner: boolean;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
