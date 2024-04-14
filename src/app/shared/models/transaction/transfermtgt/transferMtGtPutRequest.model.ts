export interface TransferMTGTPutRequest {
  transferNo: number;
  transferDate: string;
  details: TransferMTGTItemPutRequest[] | null;
  isActive: boolean;
  modifiedBy?: string;
}

export interface TransferMTGTItemPutRequest {
  autoID: number;
  srNo: number;
  fromItemID: number;
  toItemID: number;
  quantity: number;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}
