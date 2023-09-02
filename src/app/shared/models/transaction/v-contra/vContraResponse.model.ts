import { PaginationHeaders } from '../../common/PaginationHeaders.model';

export interface VContraPagedResponse {
  headers?: PaginationHeaders;
  body: VContra[];
}

export interface VContra {
  autoID: number;
  companyID: string;
  voucherNo: number;
  refNo?: string;
  voucherDate: string;
  bookAccountID: number;
  bookAccountName?: string;
  accountID: number;
  accountName?: string;
  amount: number;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
}

export interface VContraResponse {
  autoID: number;
  companyID: string;
  voucherType: string;
  voucherNo: number;
  refNo: string;
  voucherDate: string;
  transactionTypeID: number;
  bookAccountID: number;
  accountID: number;
  amount: number;
  paymentType:Number;
  transactionNo: string;
  narration: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
}

