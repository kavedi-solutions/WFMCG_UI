export interface TransferDumpPutRequest {
  transferNo: number;
  transferDate: string;
  returnTypeID: number;
  details: TransferDumpItemPutRequest[] | null;
  isActive: boolean;
  modifiedBy?: string;
}

export interface TransferDumpItemPutRequest {
  autoID: number;
  srNo: number;
  itemID: number;
  quantity: number;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}
