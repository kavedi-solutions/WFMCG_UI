export interface PLAllocationResponse {
  autoID: number;
  companyID: string;
  startDate: string;
  endDate: string;
  details: PLAllocationAccountResponse[] | null;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface PLAllocationAccountResponse {
  autoID: number;
  companyID: string;
  parentAutoID: number;
  accountID: number;
  profitPer: number;
  lossPer: number;
}
