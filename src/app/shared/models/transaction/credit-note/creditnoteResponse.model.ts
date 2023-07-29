import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface CreditNotePagedResponse {
  headers?: PaginationHeaders;
  body: CreditNote[];
}

export interface CreditNote {
  companyID: string;
  autoID: number;
  bookAccountID: number;
  bookAccountName: string;
  billNo: number;
  refNo: string;
  billDate: string;
  accountID: number;
  accountName: string;
  netAmount: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface CreditNoteResponse {
  autoID: number;
  companyID: string;
  bookAccountID: number;
  billNo: number;
  refNo: string | null;
  billDate: string;
  accountID: number;
  description: string;
  amount: number;
  roundOffAmount: number;
  netAmount: number;    
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}
