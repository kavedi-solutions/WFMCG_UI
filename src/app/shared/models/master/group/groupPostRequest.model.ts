export interface GroupPostRequest {
  groupName?: string;
  balanceTransferToID: number;
  scheduleID: number;
  isActive: boolean;
  createdBy?: string;
}
