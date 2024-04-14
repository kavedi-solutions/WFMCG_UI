export interface TransferMTGTPostRequest {
  transferNo: number;
  transferDate: string;
  details: TransferMTGTItemPostRequest[] | null;
  isActive: boolean;
  createdBy?: string;
}

export interface TransferMTGTItemPostRequest {
  srNo: number;
  fromItemID: number;
  toItemID: number;
  quantity: number;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}
