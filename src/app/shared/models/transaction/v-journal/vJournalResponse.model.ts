import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface VJournalPagedResponse {
  headers?: PaginationHeaders;
  body: VJournal[];
}

export interface VJournal {
  autoID: number;
  companyID: string;
  voucherNo: number;
  refNo?: string;
  voucherDate: string;
  bookAccountID: number;
  bookAccountName?: string;
  receiverAccountID: number;
  receiverAccountName?: string;
  giverAccountID: number;
  giverAccountName?: string;  
  amount: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface VJournalResponse {
  autoID: number;
  companyID: string;
  voucherType: string;
  voucherNo: number;
  refNo: string;
  voucherDate: string;
  transactionTypeID: number;
  bookAccountID: number;
  receiverAccountID: number;
  giverAccountID: number;
  amount: number;
  narration: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

