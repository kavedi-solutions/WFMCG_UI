export interface CompanySettingResponse {
  companyID: string;
  autoID: number;
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
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}
