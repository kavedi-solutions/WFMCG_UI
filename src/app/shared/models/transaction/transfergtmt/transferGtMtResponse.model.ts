import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface TransferGTMTPagedResponse {
  headers?: PaginationHeaders;
  body: TransferGTMT[];
}

export interface TransferGTMT {
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

export interface TransferGTMTResponse {
  autoID: number;
  transferNo: number;
  transferDate: string;
  details: TransferGTMTItemResponse[];
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface TransferGTMTItemResponse {
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
