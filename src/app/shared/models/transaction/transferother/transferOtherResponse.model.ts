import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface TransferOtherPagedResponse {
  headers?: PaginationHeaders;
  body: TransferOther[];
}

export interface TransferOther {
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

export interface TransferOtherResponse {
  autoID: number;
  transferNo: number;
  transferDate: string;
  details: TransferOtherItemResponse[];
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface TransferOtherItemResponse {
  autoID: number;
  parentAutoID: number;
  srNo: number;
  itemID: number;
  itemName: string;
  crt: number;
  pcs: number;
  quantity: number;
}
