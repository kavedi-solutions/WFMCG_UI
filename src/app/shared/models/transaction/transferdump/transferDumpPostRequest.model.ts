export interface TransferDumpPostRequest {
  transferNo: number;
  transferDate: string;
  returnTypeID: number;
  details: TransferDumpItemPostRequest[] | null;
  isActive: boolean;
  createdBy?: string;
}

export interface TransferDumpItemPostRequest {
  srNo: number;
  itemID: number;
  quantity: number;
  isAdd: boolean;
  isModified: boolean;
  isDeleted: boolean;
}
