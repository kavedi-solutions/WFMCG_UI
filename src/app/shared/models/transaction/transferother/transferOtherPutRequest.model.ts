export interface TransferOtherPutRequest {
  transferNo: number;
  transferDate: string;
  details: TransferOtherItemPutRequest[] | null;
  isActive: boolean;
  modifiedBy?: string;
}

export interface TransferOtherItemPutRequest {
  autoID: number;
  srNo: number;
  itemID: number;
  quantity: number;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}
