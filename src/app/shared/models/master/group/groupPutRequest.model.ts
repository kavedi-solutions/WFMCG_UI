export interface GroupPutRequest {
  groupName?: string;
  balanceTransferToID: number;
  scheduleID: number;
  isActive: boolean;
  ModifiedBy?: string;
}
