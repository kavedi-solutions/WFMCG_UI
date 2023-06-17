import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface DebitNotePagedResponse {
  headers?: PaginationHeaders;
  body: DebitNote[];
}

export interface DebitNote {
  companyID: string;
  autoID: number;
  bookAccountID: number;
  bookAccountName: string;
  billNo: number;
  refNo: string;
  billDate: string;
  accountID: number;
  accountName: string;
  amount: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface DebitNoteResponse {
  autoID: number;
  companyID: string;
  bookAccountID: number;
  billNo: number;
  refNo: string | null;
  billDate: string;
  accountID: number;
  description: string;
  amount: number;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}