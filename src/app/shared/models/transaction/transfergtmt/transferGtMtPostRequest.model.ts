export interface TransferGTMTPostRequest {
  transferNo: number;
  transferDate: string;
  details: TransferGTMTItemPostRequest[] | null;
  isActive: boolean;
  createdBy?: string;
}

export interface TransferGTMTItemPostRequest {
  srNo: number;
  fromItemID: number;
  toItemID: number;
  quantity: number;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}
