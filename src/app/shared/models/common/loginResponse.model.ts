export interface loginResponse {
  isSuccess: boolean;
  companyID: string;
  userID: string;
  firstName: string;
  lastName: string;
  userName: string;
  isCompanyOwner: boolean;
  jwtToken: string;
  stateID: string;
  finYearStartMonth:number;
  manageBilltoBill:boolean;
  spoiledReturnDays:number;
  goodsReturnDays:number;
}
