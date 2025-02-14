export interface PLAllocationPostRequest {
  startDate: string;
  endDate: string;
  details: PLAllocationAccountPostRequest[] | null;
  isActive: boolean;
  createdBy?: string;
}

export interface PLAllocationAccountPostRequest {
  accountID: number;
  profitPer: number;
  lossPer: number;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}
