export interface TransferGTMTPutRequest {
  transferNo: number;
  transferDate: string;
  details: TransferGTMTItemPutRequest[] | null;
  isActive: boolean;
  modifiedBy?: string;
}

export interface TransferGTMTItemPutRequest {
  autoID: number;
  srNo: number;
  fromItemID: number;
  toItemID: number;
  quantity: number;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}
