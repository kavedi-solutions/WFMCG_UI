export interface UserPutRequest {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  address?: string;
  city?: string;
  stateID: number;
  pinCode?: string;
  mobile_Work?: string;
  mobile_Personal?: string;
  isCompanyOwner: boolean;
  roleID: number;
  isActive: boolean;
  ModifiedBy?: string;
}
