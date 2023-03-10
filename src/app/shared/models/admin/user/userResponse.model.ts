import { FilterValues } from '../../common/FilterValues.model';
import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface UserResponse {
  headers?: PaginationHeaders;
  body: User[];
}

export interface User {
  companyID: string;
  userID: string;
  firstName: string;
  lastName: string;
  userName: string;
  email?: string;
  roleID: number;
  RoleName: string;
  address?: string;
  city?: string;
  stateID: number;
  StateName: string;
  pinCode?: string;
  mobile_Work?: string;
  mobile_Personal?: string;
  isCompanyOwner: boolean;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
