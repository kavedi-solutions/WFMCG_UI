import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface TransferMTGTPagedResponse {
  headers?: PaginationHeaders;
  body: TransferMTGT[];
}

export interface TransferMTGT {
  companyID: string;
  autoID: number;
  transferNo: number;
  transferDate: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface TransferMTGTResponse {
  autoID: number;
  transferNo: number;
  transferDate: string;
  details: TransferMTGTItemResponse[];
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface TransferMTGTItemResponse {
  autoID: number;
  parentAutoID: number;
  srNo: number;
  fromItemID: number;
  fromItemName: string;
  toItemID: number;
  toItemName: string;
  crt: number;
  pcs: number;
  quantity: number;
}
