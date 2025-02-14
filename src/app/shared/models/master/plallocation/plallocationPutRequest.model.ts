export interface PLAllocationPutRequest {
  startDate: string;
  endDate: string;
  details: PLAllocationAccountPutRequest[] | null;
  isActive: boolean;
  modifiedBy?: string;
}

export interface PLAllocationAccountPutRequest {
  autoID: number;
  accountID: number;
  profitPer: number;
  lossPer: number;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}
