import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface TransferDumpPagedResponse {
  headers?: PaginationHeaders;
  body: TransferDump[];
}

export interface TransferDump {
  companyID: string;
  autoID: number;
  transferNo: number;
  transferDate: string;
  returnTypeID: number;
  returnTypeName: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface TransferDumpResponse {
  autoID: number;
  transferNo: number;
  transferDate: string;
  returnTypeID: number;
  details: TransferDumpItemResponse[];
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface TransferDumpItemResponse {
  autoID: number;
  parentAutoID: number;
  srNo: number;
  itemID: number;
  itemName: string;
  crt: number;
  pcs: number;
  quantity: number;
}
