export interface CompanySettingResponse {
  companyID: string;  
  discPostingAccount: number;
  roundingOffPostingAccount: number;
  schemePostingAccount: number;
  otherAddInputPostingAc: number;
  otherLessInputPostingAc: number;
  otherAddOutputPostingAc: number;
  otherLessOutputPostingAc: number;
  finYearStartMonth: number;
  manageBilltoBill: boolean;
  spoiledReturnDays: number;
  goodsReturnDays: number;
  invoiceCopy: number;
  gstLoginID: string;
  gstLoginPassword: string;
  eiAspUserId: string;
  eiAspPassword: string; 
}