export interface TransferOtherPostRequest {
  transferNo: number;
  transferDate: string;
  details: TransferOtherItemPostRequest[] | null;
  isActive: boolean;
  createdBy?: string;
}

export interface TransferOtherItemPostRequest {
  srNo: number;
  itemID: number;
  quantity: number;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}
